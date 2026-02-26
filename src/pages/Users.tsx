import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const { role } = useAuth();

  useEffect(() => {
    async function fetchUsers() {
      const response = await api.get("/v1/users");
      setUsers(response.data);
    }

    fetchUsers();
  }, []);

  async function handleDelete(id: number) {
    await api.delete(`/v1/users/${id}`);
    setUsers(users.filter((user) => user.id !== id));
  }

  return (
    <div>
      <h2>Lista de Usuários</h2>

      {users.map((user) => (
        <div key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.role}</p>

          {role === "ADMIN" && (
            <button onClick={() => handleDelete(user.id)}>Deletar</button>
          )}

          <hr />
        </div>
      ))}
    </div>
  );
}
