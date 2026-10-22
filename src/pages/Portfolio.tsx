import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/style.css";
import {
  categoryLabels,
  filterProjects,
  projectImage,
  projects,
  type Category,
  type Project,
} from "../data/projects";
import { usePageTitle } from "../services/usePageTitle";

const WHATSAPP_URL =
  "https://wa.me/5542984265832?text=Olá!%20Vi%20o%20portfólio%20e%20gostaria%20de%20um%20orçamento.";

const filters = Object.keys(categoryLabels) as Array<Category | "all">;

export default function Portfolio() {
  usePageTitle("Portfólio");

  const [active, setActive] = useState<Category | "all">("all");
  const [selected, setSelected] = useState<Project | null>(null);

  const visible = filterProjects(projects, active);

  // Fecha o vídeo com a tecla Esc.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  function open(project: Project) {
    if (project.youtubeId) setSelected(project);
    else if (project.link) {
      window.open(project.link, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <section className="portfolio-section">
      <div className="portfolio-container">
        <h2 className="portfolio-title">Portfólio</h2>
        <p className="portfolio-subtitle">
          Vídeos, efeitos visuais e sites criados para marcas, empresas e
          criadores.
        </p>

        <div className="portfolio-filters" role="group" aria-label="Filtrar">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className={`portfolio-filter${active === f ? " active" : ""}`}
              aria-pressed={active === f}
              onClick={() => setActive(f)}
            >
              {categoryLabels[f]}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {visible.map((project) => (
            <article key={project.id} className="portfolio-card">
              <button
                type="button"
                className="portfolio-thumb"
                onClick={() => open(project)}
                aria-label={
                  project.youtubeId
                    ? `Assistir: ${project.title}`
                    : `Visitar: ${project.title}`
                }
              >
                <img
                  src={projectImage(project)}
                  alt={project.title}
                  className="portfolio-image"
                  loading="lazy"
                />
                {project.youtubeId && (
                  <span className="portfolio-play" aria-hidden="true">
                    ▶
                  </span>
                )}
              </button>

              <div className="portfolio-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                {project.tags && (
                  <ul className="portfolio-tags">
                    {project.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}

                <div className="portfolio-buttons">
                  {project.youtubeId ? (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => open(project)}
                    >
                      Assistir
                    </button>
                  ) : (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Visitar Site
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="portfolio-cta">
          <h3>Quer um projeto assim?</h3>
          <p>Conte sua ideia e receba um orçamento.</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Pedir orçamento
          </a>{" "}
          <Link to="/agendar" className="btn-secondary">
            Agendar uma conversa
          </Link>
        </div>
      </div>

      {selected?.youtubeId && (
        <div
          className="portfolio-modal"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setSelected(null)}
        >
          <div
            className="portfolio-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="portfolio-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
            >
              ×
            </button>
            <div className="video-card">
              <iframe
                src={`https://www.youtube.com/embed/${selected.youtubeId}?autoplay=1`}
                title={selected.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
