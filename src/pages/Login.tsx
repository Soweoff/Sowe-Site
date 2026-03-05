import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await login(email, password);

      // pega role do localStorage
      const token = localStorage.getItem("token");

      if (token) {
        const decoded: any = JSON.parse(atob(token.split(".")[1]));

        if (decoded.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/usedashboard");
        }
      }
    } catch (error) {
      alert("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Entrar na sua conta</h2>

          <form onSubmit={handleLogin} className="auth-form">
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
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="auth-footer">
            Não tem conta? <Link to="/register">Criar conta</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
