import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Layout() {
  const { token, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="layout-wrapper">
      {/* BACKGROUND */}
      <img
        className="image-gradient"
        src="https://res.cloudinary.com/dvqbwddan/image/upload/v1771988142/Sowe-Site/gradient_hhkjkr.png"
        alt="gradient"
      />

      <div className="layer-blur"></div>

      {/* CONTAINER */}
      <div className="container">
        <header>
          <h1 className="logo">SOWE</h1>

          {/* MENU MOBILE */}
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            ☰
          </button>

          {/* NAV */}
          <nav className={menuOpen ? "nav active" : "nav"}>
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/youtube" onClick={closeMenu}>
              Youtube
            </Link>
            <Link to="/edition" onClick={closeMenu}>
              Edição
            </Link>
            <Link to="/cs2" onClick={closeMenu}>
              CS2
            </Link>
            <Link to="/products" onClick={closeMenu}>
              Produtos
            </Link>
            <Link to="/websites" onClick={closeMenu}>
              Websites
            </Link>

            <div className="mobile-auth-actions">
              {!token ? (
                <Link
                  to="/login"
                  className="mobile-login-button"
                  onClick={closeMenu}
                >
                  Login
                </Link>
              ) : (
                <>
                  {role === "ADMIN" ? (
                    <Link
                      to="/admin"
                      className="mobile-login-button"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="mobile-login-button"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="mobile-logout-button"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>

          <div className="desktop-auth-actions">
            {!token ? (
              <Link to="/login" className="btn-signing">
                Login
              </Link>
            ) : (
              <div className="header-actions">
                {role === "ADMIN" ? (
                  <Link to="/admin" className="btn-signing">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/dashboard" className="btn-signing">
                    Dashboard
                  </Link>
                )}

                <button onClick={logout} className="btn-signing logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* PÁGINAS */}
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
