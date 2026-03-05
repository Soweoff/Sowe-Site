import { useEffect, useState } from "react";
import { api } from "../services/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";

interface Event {
  title: string;
  date: string;
}

export default function UserDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await api.get("/monday/tasks");

        const tasks = res.data?.data?.boards?.[0]?.items_page?.items || [];

        const formattedEvents = tasks.map((task: any) => ({
          title: task.name,
          date: "2026-03-02",
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Erro ao carregar tarefas", error);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  if (loading) {
    return <p style={{ padding: "40px" }}>Carregando tarefas...</p>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Planejamento</h1>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
}
