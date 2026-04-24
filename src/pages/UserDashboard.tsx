import { useEffect, useState } from "react";
import { api } from "../services/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface Event {
  id?: string;
  title: string;
  start: string; // FullCalendar usa 'start' e 'end' (nosso backend já envia assim)
  end?: string;
  backgroundColor?: string;
}

export default function UserDashboard() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await api.get("/zoho/events");
        // O backend do NestJS já mandou exatamente no formato que o calendário precisa!
        setEvents(res.data);
      } catch (error) {
        console.error("Erro ao carregar os eventos do calendário:", error);
      }
    }

    loadTasks();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Planejamento</h1>

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
        />
      </div>
    </div>
  );
}
