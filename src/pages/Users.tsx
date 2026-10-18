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
  const [error, setError] = useState<string | null>(null);
  const { role } = useAuth();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/v1/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
        setError("Não foi possível carregar os usuários.");
      }
    }

    fetchUsers();
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Deseja realmente excluir este usuário?")) return;

    try {
      await api.delete(`/v1/users/${id}`);
      setUsers((current) => current.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      alert("Não foi possível excluir o usuário.");
    }
  }

  return (
    <div>
      <h2>Lista de Usuários</h2>

      {error && <p>{error}</p>}

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
