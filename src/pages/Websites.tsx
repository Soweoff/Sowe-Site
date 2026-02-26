import "../styles/style.css";

export default function Websites() {
  const projects = [
    {
      title: "Sowe Studio",
      description: "Site institucional focado em branding.",
      image:
        "https://res.cloudinary.com/dvqbwddan/image/upload/v1772083015/Sowe-Site/Sites/Sowe_Site_nzowxk.jpg",
      link: "https://sowestudio.com.br",
    },
    {
      title: "TNK Store",
      description: "Site focada em conversão de vendas.",
      image:
        "https://res.cloudinary.com/dvqbwddan/image/upload/v1772082969/Sowe-Site/Sites/TNK_Store_u5mv3k.jpg",
      link: "https://tnkstore3.lojavirtualnuvem.com.br/",
    },
    {
      title: "Hotmart Área de Membros",
      description: "Área de membros personalizada para cursos online.",
      image:
        "https://res.cloudinary.com/dvqbwddan/image/upload/v1772082969/Sowe-Site/Sites/TNK_Store_u5mv3k.jpg",
      link: "https://tnkstore3.lojavirtualnuvem.com.br/",
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
                  {/*  <button className="btn-secondary">Ver Detalhes</button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
