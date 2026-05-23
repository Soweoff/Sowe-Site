import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import Users from "./Users";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import rrulePlugin from "@fullcalendar/rrule";

type CalendarKey = "tnk_store" | "personal";
type ReminderAction = "notification" | "email" | "popup";

interface Event {
  id?: string;
  title: string;
  start?: string;
  end?: string;
  rrule?: string;
  duration?: string;
  backgroundColor?: string;
  borderColor?: string;
  description?: string;
  status?: string;
  calendar?: CalendarKey;
}

export default function Dashboard() {
  const { logout } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCalendar, setSelectedCalendar] =
    useState<CalendarKey>("tnk_store");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editEventId, setEditEventId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Não iniciado");
  const [loading, setLoading] = useState(false);

  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatUntil, setRepeatUntil] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);

  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderAction, setReminderAction] =
    useState<ReminderAction>("notification");
  const [reminderMinutes, setReminderMinutes] = useState(5);
  const [notifyPersonal, setNotifyPersonal] = useState(true);
  const [attendeeEmail, setAttendeeEmail] = useState("");

  const daysOptions = [
    { label: "Seg", value: "MO" },
    { label: "Ter", value: "TU" },
    { label: "Qua", value: "WE" },
    { label: "Qui", value: "TH" },
    { label: "Sex", value: "FR" },
    { label: "Sáb", value: "SA" },
    { label: "Dom", value: "SU" },
  ];

  async function loadTasks() {
    try {
      const res = await api.get(`/zoho/events?calendar=${selectedCalendar}`);
      setEvents(res.data);
    } catch (error) {
      console.error("Erro ao carregar os eventos:", error);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [selectedCalendar]);

  const toLocalDatetime = (dateObj: Date | null) => {
    if (!dateObj) return "";
    const tzoffset = dateObj.getTimezoneOffset() * 60000;
    return new Date(dateObj.getTime() - tzoffset).toISOString().slice(0, 16);
  };

  const resetNotificationFields = () => {
    setReminderEnabled(true);
    setReminderAction("notification");
    setReminderMinutes(5);
    setNotifyPersonal(true);
    setAttendeeEmail("");
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    const startDate = new Date(event.start);

    const dateFormatted = startDate.toLocaleDateString("pt-BR");

    const timeFormatted =
      startDate.getHours() === 0 && startDate.getMinutes() === 0
        ? "Dia todo"
        : startDate.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });

    setSelectedEvent({
      id: event.id,
      title: event.title,
      date: dateFormatted,
      time: timeFormatted,
      description: event.extendedProps.description,
      status: event.extendedProps.status || "Agendado",
      color: event.backgroundColor,
      rawStart: toLocalDatetime(event.start),
      rawEnd: toLocalDatetime(event.end || event.start),
    });

    setIsViewModalOpen(true);
  };

  const openCreateModal = () => {
    setEditEventId(null);
    setTitle("");
    setStart("");
    setEnd("");
    setDescription("");
    setStatus("Não iniciado");
    setIsRecurring(false);
    setRepeatUntil("");
    setDaysOfWeek([]);
    resetNotificationFields();
    setIsFormModalOpen(true);
  };

  const openEditModal = () => {
    setIsViewModalOpen(false);
    setEditEventId(selectedEvent.id);

    setTitle(selectedEvent.title);
    setStart(selectedEvent.rawStart);
    setEnd(selectedEvent.rawEnd);
    setDescription(selectedEvent.description || "");
    setStatus(selectedEvent.status || "Agendado");

    setIsRecurring(false);
    resetNotificationFields();
    setIsFormModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRecurring && daysOfWeek.length === 0 && !editEventId) {
      alert("Selecione ao menos um dia da semana para repetir.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        start,
        end,
        description,
        status,
        isRecurring,
        repeatUntil,
        daysOfWeek,
        reminderEnabled,
        reminderAction,
        reminderMinutes,
        notifyPersonal,
        attendeeEmail: attendeeEmail.trim() || undefined,
      };

      if (editEventId) {
        await api.put(
          `/zoho/events/${editEventId}?calendar=${selectedCalendar}`,
          payload,
        );
      } else {
        await api.post(`/zoho/events?calendar=${selectedCalendar}`, payload);
      }

      setIsFormModalOpen(false);
      loadTasks();
    } catch (error) {
      alert("Erro ao salvar o evento.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja deletar este agendamento? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/zoho/events/${selectedEvent.id}?calendar=${selectedCalendar}`,
      );

      setIsViewModalOpen(false);
      loadTasks();
    } catch (error) {
      alert("Erro ao deletar o evento.");
      console.error(error);
    }
  };

  return (
    <div className="dashboard-container calendar-page">
      <div className="dashboard-topbar">
        <h1 className="dashboard-title">Painel do Administrador</h1>

        <button onClick={logout} className="dashboard-danger-button">
          Sair do Sistema
        </button>
      </div>

      <div className="calendar-wrapper calendar-card">
        <div className="calendar-toolbar-card">
          <div>
            <h2>Gestão de Agendamentos</h2>

            <p>
              Calendário ativo:{" "}
              <strong>
                {selectedCalendar === "tnk_store" ? "TNK STORE" : "Sowe Studio"}
              </strong>
            </p>

            <select
              value={selectedCalendar}
              onChange={(e) =>
                setSelectedCalendar(e.target.value as CalendarKey)
              }
              className="calendar-select"
            >
              <option value="tnk_store">TNK STORE</option>
              <option value="personal">Sowe Studio</option>
            </select>
          </div>

          <button onClick={openCreateModal} className="calendar-primary-button">
            + Novo Agendamento
          </button>
        </div>

        <div className="calendar-legend">
          <span>
            <i style={{ background: "#64748b" }} /> Não iniciado
          </span>
          <span>
            <i style={{ background: "#f59e0b" }} /> Em andamento
          </span>
          <span>
            <i style={{ background: "#22c55e" }} /> Feito
          </span>
          <span>
            <i style={{ background: "#6c63ff" }} /> Agendado
          </span>
        </div>

        <div className="calendar-scroll-area">
          <FullCalendar
            plugins={[dayGridPlugin, rrulePlugin]}
            initialView="dayGridMonth"
            height="auto"
            dayMaxEvents={3}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth",
            }}
            events={events}
            eventClick={handleEventClick}
          />
        </div>
      </div>

      <hr className="dashboard-divider" />

      <Users />

      {isFormModalOpen && (
        <div
          style={modalOverlayStyle}
          onClick={() => setIsFormModalOpen(false)}
        >
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                ...modalHeaderStyle,
                backgroundColor: editEventId ? "#f59e0b" : "#6c63ff",
              }}
            >
              <h2 style={{ margin: 0, color: "#fff" }}>
                {editEventId ? "Editar Agendamento" : "Novo Agendamento"}
              </h2>
            </div>

            <div
              style={{
                maxHeight: "75vh",
                overflowY: "auto",
                ...modalBodyStyle,
              }}
            >
              <form onSubmit={handleSaveEvent}>
                <div style={{ marginBottom: "10px" }}>
                  <label>Título:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="Não iniciado">Não iniciado</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Feito">Feito</option>
                    <option value="Agendado">Agendado</option>
                  </select>
                </div>

                <div className="event-form-grid">
                  <div>
                    <label>Início:</label>
                    <input
                      type="datetime-local"
                      required
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label>Fim:</label>
                    <input
                      type="datetime-local"
                      required
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="event-form-card">
                  <label className="event-checkbox-row">
                    <input
                      type="checkbox"
                      checked={reminderEnabled}
                      onChange={(e) => setReminderEnabled(e.target.checked)}
                    />
                    Ativar lembrete no Zoho Calendar
                  </label>

                  {reminderEnabled && (
                    <div className="event-form-grid event-form-grid-spaced">
                      <div>
                        <label>Tipo de notificação:</label>
                        <select
                          value={reminderAction}
                          onChange={(e) =>
                            setReminderAction(e.target.value as ReminderAction)
                          }
                          style={inputStyle}
                        >
                          <option value="notification">Notificação</option>
                          <option value="email">E-mail</option>
                          <option value="popup">Pop-up</option>
                        </select>
                      </div>

                      <div>
                        <label>Quando avisar:</label>
                        <select
                          value={reminderMinutes}
                          onChange={(e) =>
                            setReminderMinutes(Number(e.target.value))
                          }
                          style={inputStyle}
                        >
                          <option value={5}>5 minutos antes</option>
                          <option value={10}>10 minutos antes</option>
                          <option value={30}>30 minutos antes</option>
                          <option value={60}>1 hora antes</option>
                          <option value={1440}>1 dia antes</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <label className="event-checkbox-row">
                    <input
                      type="checkbox"
                      checked={notifyPersonal}
                      onChange={(e) => setNotifyPersonal(e.target.checked)}
                    />
                    Notificar minha conta pessoal como participante
                  </label>

                  {notifyPersonal && (
                    <div style={{ marginTop: "12px" }}>
                      <label>E-mail pessoal para notificar:</label>
                      <input
                        type="email"
                        placeholder="Opcional. Se vazio, usa o e-mail do Render."
                        value={attendeeEmail}
                        onChange={(e) => setAttendeeEmail(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  )}
                </div>

                {!editEventId && (
                  <div className="event-form-card">
                    <label className="event-checkbox-row">
                      <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                      />
                      Repetir semanalmente?
                    </label>

                    {isRecurring && (
                      <div style={{ marginTop: "15px" }}>
                        <label style={{ fontSize: "0.9rem", color: "#ccc" }}>
                          Quais dias da semana?
                        </label>

                        <div className="days-selector">
                          {daysOptions.map((day) => (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() => {
                                setDaysOfWeek((prev) =>
                                  prev.includes(day.value)
                                    ? prev.filter((d) => d !== day.value)
                                    : [...prev, day.value],
                                );
                              }}
                              className={
                                daysOfWeek.includes(day.value)
                                  ? "day-button day-button-active"
                                  : "day-button"
                              }
                            >
                              {day.label}
                            </button>
                          ))}
                        </div>

                        <div style={{ marginTop: "15px" }}>
                          <label style={{ fontSize: "0.9rem", color: "#ccc" }}>
                            Repetir até o dia:
                          </label>

                          <input
                            type="date"
                            value={repeatUntil}
                            onChange={(e) => setRepeatUntil(e.target.value)}
                            style={inputStyle}
                            required={isRecurring}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginBottom: "20px" }}>
                  <label>Descrição:</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div className="modal-actions-row">
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      ...closeButtonStyle,
                      backgroundColor: "#22c55e",
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {loading ? "Salvando..." : "Salvar no Zoho"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    style={{
                      ...closeButtonStyle,
                      backgroundColor: "#3a3a48",
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedEvent && (
        <div
          style={modalOverlayStyle}
          onClick={() => setIsViewModalOpen(false)}
        >
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                ...modalHeaderStyle,
                backgroundColor: selectedEvent.color,
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#fff" }}>
                {selectedEvent.title}
              </h2>
            </div>

            <div style={modalBodyStyle}>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  backgroundColor: selectedEvent.color,
                  color: "#fff",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Status: {selectedEvent.status}
              </div>

              <p style={{ margin: "5px 0" }}>
                <strong>📅 Data:</strong> {selectedEvent.date}
              </p>

              <p style={{ margin: "5px 0" }}>
                <strong>⏰ Horário:</strong> {selectedEvent.time}
              </p>

              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  backgroundColor: "#2a2a36",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc" }}>
                  <strong>📝 Descrição:</strong>
                  <br />
                  <br />
                  {selectedEvent.description}
                </p>
              </div>

              <div className="modal-actions-row">
                <button
                  style={{
                    ...closeButtonStyle,
                    backgroundColor: "#f59e0b",
                    margin: 0,
                    flex: 1,
                  }}
                  onClick={openEditModal}
                >
                  ✏️ Editar
                </button>

                <button
                  style={{
                    ...closeButtonStyle,
                    backgroundColor: "#ef4444",
                    margin: 0,
                    flex: 1,
                  }}
                  onClick={handleDeleteEvent}
                >
                  🗑️ Deletar
                </button>
              </div>

              <button
                style={closeButtonStyle}
                onClick={() => setIsViewModalOpen(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(4px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 3000,
  padding: "12px",
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#1e1e24",
  width: "95%",
  maxWidth: "620px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  border: "1px solid #333",
  color: "#fff",
};

const modalHeaderStyle: React.CSSProperties = {
  padding: "15px 20px",
  textAlign: "center",
};

const modalBodyStyle: React.CSSProperties = {
  padding: "20px",
  fontSize: "1rem",
  lineHeight: "1.5",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  background: "#2a2a36",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "8px",
};

const closeButtonStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  backgroundColor: "#6c63ff",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};
