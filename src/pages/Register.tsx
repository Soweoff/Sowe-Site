import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      await register(name, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Criar nova conta</h2>

          <form onSubmit={handleRegister} className="auth-form">
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn-signing" disabled={loading}>
              {loading ? "Criando..." : "Criar conta"}
            </button>
          </form>

          <p className="auth-footer">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
