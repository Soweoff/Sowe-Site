import { useEffect, useState } from "react";
import { api } from "../services/api";
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

export default function UserDashboard() {
  const [events, setEvents] = useState<Event[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await api.get("/zoho/events");
        setEvents(res.data);
      } catch (error) {
        console.error("Erro ao carregar os eventos:", error);
      }
    }
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
      title: event.title,
      date: dateFormatted,
      time: timeFormatted,
      description: event.extendedProps.description,
      status: event.extendedProps.status || "Agendado", // Resgata o status
      color: event.backgroundColor,
    });

    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-container" style={{ position: "relative" }}>
      <h1 className="dashboard-title">Planejamento de Entregas</h1>

      <div className="calendar-wrapper">
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

      {/* MODAL DE DETALHES DO EVENTO */}
      {isModalOpen && selectedEvent && (
        <div style={modalOverlayStyle} onClick={() => setIsModalOpen(false)}>
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

              <button
                style={closeButtonStyle}
                onClick={() => setIsModalOpen(false)}
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

// --- CSS INLINE ---
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
