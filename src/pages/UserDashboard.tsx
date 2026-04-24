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
}

export default function UserDashboard() {
  const [events, setEvents] = useState<Event[]>([]);

  // Estados para controlar o Modal
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

  // Função disparada ao clicar em um evento no calendário
  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;

    // Formatando a data e a hora para o padrão brasileiro
    const startDate = new Date(event.start);
    const dateFormatted = startDate.toLocaleDateString("pt-BR");

    // Pega a hora. Se for um evento de "dia inteiro", o horário vem zerado
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
      color: event.backgroundColor,
    });

    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-container" style={{ position: "relative" }}>
      <h1 className="dashboard-title">Planejamento de Entregas</h1>

      <div className="calendar-wrapper">
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
          eventClick={handleEventClick} // <-- ATIVA O CLIQUE NO EVENTO
          eventCursor="pointer" // Muda o mouse para uma "mãozinha" ao passar por cima
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
              <p>
                <strong>📅 Data:</strong> {selectedEvent.date}
              </p>
              <p>
                <strong>⏰ Horário:</strong> {selectedEvent.time}
              </p>

              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  backgroundColor: "#2a2a36",
                  borderRadius: "8px",
                }}
              >
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc" }}>
                  <strong>📝 Descrição:</strong>
                  <br />
                  <br />
                  {selectedEvent.description}
                </p>
              </div>
            </div>

            <button
              style={closeButtonStyle}
              onClick={() => setIsModalOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- CSS INLINE PARA O MODAL (Para funcionar perfeitamente com seu tema escuro) ---
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
  width: "calc(100% - 40px)",
  margin: "0 auto 20px auto",
  padding: "10px",
  backgroundColor: "#3a3a48",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "background 0.2s",
};
