import { useAuth } from "../context/AuthContext";
import Users from "./Users";

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <div>
      <h2>Bem-vindo ao Dashboard 🚀</h2>
      <button onClick={logout}>Logout</button>
      <Users />
    </div>
  );
}
