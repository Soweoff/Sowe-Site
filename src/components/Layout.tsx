import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { token, logout, role } = useAuth();

  return (
    <div className="layout-wrapper">
      {/* BACKGROUND ELEMENTS */}
      <img
        className="image-gradient"
        src="https://res.cloudinary.com/dvqbwddan/image/upload/v1771988142/Sowe-Site/gradient_hhkjkr.png"
        alt="gradient"
      />
      <div className="layer-blur"></div>

      {/* CONTAINER PRINCIPAL */}
      <div className="container">
        <header>
          <h1 className="logo">SOWE</h1>

          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/youtube">Youtube</Link>
            <Link to="/edition">Edição</Link>
            <Link to="/cs2">CS2</Link>
            <Link to="/products">Produtos</Link>
            <Link to="/websites">WebSites</Link>
          </nav>

          {/* BOTÃO DINÂMICO */}
          {!token ? (
            <Link to="/login" className="btn-signing">
              Login
            </Link>
          ) : role === "ADMIN" ? (
            <Link to="/admin" className="btn-signing">
              Dashboard
            </Link>
          ) : (
            <Link to="/dashboard" className="btn-signing">
              Dashboard
            </Link>
          )}
        </header>

        <main>
          <Outlet />
        </main>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>SOWE</h3>
            <p>VFX • 3D • Edição de Vídeo</p>
          </div>

          <div className="footer-links">
            <a
              href="https://www.youtube.com/@Sowevfx"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
            <a
              href="https://www.instagram.com/sowevfx"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/5542984265832"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Sowe Studio. CNPJ: 62.808.317/0001-06.
        </div>
      </footer>
    </div>
  );
}
