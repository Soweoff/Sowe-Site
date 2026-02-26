export default function Edition() {
  const equipments = [
    {
      name: "iPhone 12 Pro Max",
      desc: "Captação 4K profissional",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771996971/Sowe-Site/Equipamento/Iphone-12-Pro-Max_tb7j7k.png",
    },
    {
      name: "Microfone Ulanzi",
      desc: "Áudio limpo e profissional",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771996971/Sowe-Site/Equipamento/Microfone-Ulanzi_b5x0km.png",
    },
    {
      name: "Mini Soft Light",
      desc: "Iluminação portátil",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771996971/Sowe-Site/Equipamento/Mini-Sotflight_mc3b3r.png",
    },
    {
      name: "Monitor LG",
      desc: "Precisão de cor",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771996971/Sowe-Site/Equipamento/LG_prktr7.png",
    },
    {
      name: "Hohem iSteady M6",
      desc: "Estabilização cinematográfica",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771996971/Sowe-Site/Equipamento/Hohen-M6_ytezni.png",
    },
    {
      name: "PC High Performance",
      desc: "Render 3D e VFX avançado",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771996972/Sowe-Site/Equipamento/PC_exbtnj.png",
    },
    {
      name: "Headset Redragon",
      desc: "Monitoramento de áudio",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771996972/Sowe-Site/Equipamento/Redragon_wnfxtt.png",
    },
    {
      name: "Edifier",
      desc: "Áudio profissional",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771998773/Sowe-Site/Equipamento/Edifier_fwnmul.png",
    },
  ];

  const softwares = [
    {
      name: "Adobe Premiere",
      desc: "Edição profissional",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771999319/Sowe-Site/Softwares/5968525_ndnucz.png",
    },
    {
      name: "Adobe Photoshop",
      desc: "Manipulação e design",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771999320/Sowe-Site/Softwares/Adobe_Photoshop_CC_icon.svg_w4h3vv.png",
    },
    {
      name: "After Effects",
      desc: "VFX & Motion Design",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771999320/Sowe-Site/Softwares/Adobe_After_Effects_CC_icon.svg_q1eaux.png",
    },
    {
      name: "Blender",
      desc: "Modelagem e animação 3D",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771999320/Sowe-Site/Softwares/Blender_logo_no_text.svg_ikxfla.png",
    },
    {
      name: "Cinema 4D",
      desc: "3D profissional",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771999320/Sowe-Site/Softwares/Cinema-4D-Logo_wxlkgm.png",
    },
    {
      name: "Unreal Engine",
      desc: "Ambientes e render realista",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771999794/Sowe-Site/Softwares/Unreal-Engine_wtec0v.png",
    },
    {
      name: "Adobe Lightroom",
      desc: "Color grading profissional",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771999967/Sowe-Site/Softwares/Adobe_LightRoom_j54aac.png",
    },
    {
      name: "Marvelous Designer",
      desc: "Simulação de tecidos 3D",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1771999970/Sowe-Site/Softwares/Marvelous-Desinger_cuerhn.png",
    },
    {
      name: "Meta Ads",
      desc: "Gestão de tráfego pago",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1772000098/Sowe-Site/Softwares/Meta_Ads_dmmwgc.png",
    },
    {
      name: "DaVinci Resolve",
      desc: "Color grading avançado",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1772000336/Sowe-Site/Softwares/DaVinci_Resolve_logo_nblngi.png",
    },
    {
      name: "Heygen",
      desc: "IA para vídeos",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1772000338/Sowe-Site/Softwares/heygen-logo_brandlogos.net_rm7jl_tkcrgf.png",
    },
    {
      name: "Higgsfield",
      desc: "IA para produção criativa",
      img: "https://res.cloudinary.com/dvqbwddan/image/upload/v1772000337/Sowe-Site/Softwares/68aeed5167eda64aa0ef6380_Higgsfield_logo_lyq8fv.webp",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="edition-hero">
        <div className="edition-container">
          <h1>
            EDIÇÃO PROFISSIONAL <br /> VFX • 3D • IA
          </h1>

          <p className="description">
            Transformo ideias em vídeos de alto impacto visual. Do roteiro ao
            render final, entrego projetos completos com estética
            cinematográfica e foco em resultado.
          </p>
        </div>
      </section>

      {/* ESTILOS DE EDIÇÃO */}
      <section className="styles-section">
        <div className="edition-container">
          <h2>Estilos de Edição</h2>

          <ul className="styles-grid">
            <li>Propagandas & Comerciais</li>
            <li>Imobiliário</li>
            <li>Carros & Speed Ramp</li>
            <li>VFX Cinematográfico</li>
            <li>3D & Unreal Engine</li>
            <li>Conteúdo com IA</li>
            <li>Culinária</li>
            <li>Daily Vlog</li>
            <li>YouTube Long & Shorts</li>
            <li>VSL (Vídeo de Vendas)</li>
            <li>Aulas & Cursos Online</li>
            <li>Gameplay</li>
          </ul>
        </div>
      </section>

      {/* SOFTWARES E HABILIDADES */}
      <section className="skills-section">
        <div className="edition-container">
          <h2>Softwares & Ferramentas</h2>

          <div className="equipment-grid">
            {softwares.map((item, index) => (
              <div key={index} className="equipment-card">
                <div className="equipment-image">
                  <img src={item.img} alt={item.name} />
                </div>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="equipment-section">
        <div className="edition-container">
          <h2>Equipamentos</h2>

          <div className="equipment-grid">
            {equipments.map((item, index) => (
              <div key={index} className="equipment-card">
                <div className="equipment-image">
                  <img src={item.img} alt={item.name} />
                </div>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="investment">
            Estrutura total superior a <strong>R$20.000</strong> em equipamentos
            profissionais.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="edition-cta">
        <div className="edition-container">
          <h2>Vamos elevar o nível do seu projeto?</h2>

          <a
            href="https://wa.me/5542984265832"
            className="btn-get-started cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar Orçamento
          </a>
        </div>
      </section>
    </>
  );
}
