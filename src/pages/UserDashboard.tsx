import { useEffect, useState } from "react";
import { api } from "../services/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface Event {
  title: string;
  date: string;
}

export default function UserDashboard() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function loadTasks() {
      const res = await api.get("/monday/tasks");

      console.log("Monday response:", res.data);

      const tasks = res.data.data.boards[0].items_page.items;

      const formattedEvents = tasks.map((task: any) => ({
        title: task.name,
        date: "2026-03-02", // depois vamos pegar a data real
      }));

      setEvents(formattedEvents);
    }

    loadTasks();
  }, []);

  return (
    <div>
      <h1>Planejamento</h1>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
}
