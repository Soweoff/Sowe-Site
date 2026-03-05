import { useEffect, useState } from "react";
import { api } from "../services/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface Event {
  title: string;
  date: string;
  backgroundColor?: string;
}

export default function UserDashboard() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function loadTasks() {
      const res = await api.get("/monday/tasks");

      const tasks = res.data?.data?.boards?.[0]?.items_page?.items || [];

      const formattedEvents = tasks.map((task: any) => {
        const dateColumn = task.column_values?.find(
          (col: any) => col.id === "date",
        );

        const statusColumn = task.column_values?.find(
          (col: any) => col.id === "status",
        );

        let date = null;

        if (dateColumn?.value) {
          const parsed = JSON.parse(dateColumn.value);
          date = parsed.date;
        }

        let color = "#6c63ff";

        if (statusColumn?.text === "Feito") {
          color = "#22c55e";
        } else if (statusColumn?.text === "Em andamento") {
          color = "#f59e0b";
        } else if (statusColumn?.text === "Não iniciado") {
          color = "#64748b";
        }

        return {
          title: task.name,
          date: date,
          backgroundColor: color,
        };
      });

      setEvents(formattedEvents);
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
