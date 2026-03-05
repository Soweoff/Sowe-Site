import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface Event {
  title: string;
  date: string;
}

export default function UserDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTasks() {
      const res = await api.get("/monday/tasks");

      const tasks = res.data?.data?.boards?.[0]?.items_page?.items || [];

      const formattedEvents = tasks.map((task: any) => ({
        title: task.name,
        date: "2026-03-02",
      }));

      setEvents(formattedEvents);
    }

    loadTasks();
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div style={{ padding: "40px" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>Planejamento</h1>

        <button
          onClick={handleLogout}
          style={{
            background: "#ff4d4f",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </div>

      {/* CALENDÁRIO */}
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
}
