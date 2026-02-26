import "../styles/style.css";

export default function Websites() {
  const projects = [
    {
      title: "Sowe Studio",
      description: "Site institucional focado em branding.",
      image: "https://via.placeholder.com/600x400",
      link: "https://sowestudio.com.br",
    },
    {
      title: "Cliente X",
      description: "Landing page focada em conversão.",
      image: "https://via.placeholder.com/600x400",
      link: "https://exemplo.com",
    },
  ];

  return (
    <section className="portfolio-section">
      <div className="portfolio-container">
        <h2 className="portfolio-title">Sites Desenvolvidos</h2>

        <p className="portfolio-subtitle">
          Projetos profissionais criados para marcas, empresas e criadores.
        </p>

        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <div key={index} className="portfolio-card">
              <img
                src={project.image}
                alt={project.title}
                className="portfolio-image"
              />

              <div className="portfolio-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="portfolio-buttons">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Visitar Site
                  </a>

                  <button className="btn-secondary">Ver Detalhes</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
