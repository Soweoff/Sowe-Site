import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import Users from "./Users";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface Event {
  id?: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  description?: string;
  status?: string;
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Não iniciado"); // Valor inicial
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    try {
      const res = await api.get("/zoho/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Erro ao carregar os eventos:", error);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

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
      status: event.extendedProps.status || "Agendado", // Resgata o status
      color: event.backgroundColor,
    });
    setIsViewModalOpen(true);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/zoho/events", {
        title,
        start,
        end,
        description,
        status,
      });
      setIsCreateModalOpen(false);
      loadTasks();
      setTitle("");
      setStart("");
      setEnd("");
      setDescription("");
      setStatus("Não iniciado");
    } catch (error) {
      alert("Erro ao criar evento.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Tem certeza que deseja deletar este agendamento?"))
      return;
    try {
      await api.delete(`/zoho/events/${selectedEvent.id}`);
      setIsViewModalOpen(false);
      loadTasks();
    } catch (error) {
      alert("Erro ao deletar evento.");
    }
  };

  return (
    <div
      className="dashboard-container"
      style={{ position: "relative", padding: "20px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 className="dashboard-title">Painel do Administrador</h1>
        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Sair do Sistema
        </button>
      </div>

      <div className="calendar-wrapper" style={{ marginBottom: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h2>Gestão de Agendamentos</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              padding: "10px 20px",
              background: "#6c63ff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Novo Agendamento
          </button>
        </div>

        {/* LEGENDA DE CORES */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "15px",
            fontSize: "0.9rem",
            color: "#ccc",
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#64748b",
              }}
            ></div>{" "}
            Não iniciado
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#f59e0b",
              }}
            ></div>{" "}
            Em andamento
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#22c55e",
              }}
            ></div>{" "}
            Feito
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#6c63ff",
              }}
            ></div>{" "}
            Agendado
          </span>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin]}
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

      <hr style={{ borderColor: "#333", margin: "40px 0" }} />
      <Users />

      {/* MODAL 1: CRIAR */}
      {isCreateModalOpen && (
        <div
          style={modalOverlayStyle}
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...modalHeaderStyle, backgroundColor: "#6c63ff" }}>
              <h2 style={{ margin: 0, color: "#fff" }}>Novo Agendamento</h2>
            </div>

            <form onSubmit={handleCreateEvent} style={modalBodyStyle}>
              <div style={{ marginBottom: "10px" }}>
                <label>Título da Entrega:</label>
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

              <div
                style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
              >
                <div style={{ flex: 1 }}>
                  <label>Início:</label>
                  <input
                    type="datetime-local"
                    required
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
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

              <div style={{ marginBottom: "20px" }}>
                <label>Descrição:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
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
                  onClick={() => setIsCreateModalOpen(false)}
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
      )}

      {/* MODAL 2: VER/EDITAR/DELETAR */}
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
              {/* STATUS BADGE */}
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

              <div
                style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
              >
                <button
                  style={{
                    ...closeButtonStyle,
                    backgroundColor: "#f59e0b",
                    margin: 0,
                    flex: 1,
                  }}
                  onClick={() => alert("Função de edição em construção!")}
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
  zIndex: 1000,
};
const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#1e1e24",
  width: "90%",
  maxWidth: "400px",
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
  borderRadius: "6px",
  border: "1px solid #444",
  backgroundColor: "#2a2a36",
  color: "#fff",
  boxSizing: "border-box",
};
const closeButtonStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "10px",
  backgroundColor: "#3a3a48",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "background 0.2s",
};
