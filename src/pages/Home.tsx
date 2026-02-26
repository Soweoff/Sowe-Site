import Spline from "@splinetool/react-spline";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="content">
            <div className="tag-box">
              <div className="tag">Orçamentos</div>
            </div>

            <h1>
              PARA CRIADORES <br /> E EMPRESAS
            </h1>

            <p className="description">
              Sowe é criador de conteúdo com 3 canais no Youtube, além de
              trabalhar com edição de vídeos para empresas e criadores.
            </p>

            <div className="buttons">
              <a
                href="https://wa.me/5542984265832?text=Olá!%20Gostaria%20de%20saber%20sobre%20os%20orçamentos."
                className="btn-get-started"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vamos Trabalhar &gt;
              </a>

              <a
                href="https://www.behance.net/Soweoff"
                className="btn-signing-main"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfólio &gt;
              </a>
            </div>
          </div>

          {/* SPLINE */}
          <div className="painels-3d">
            <Spline scene="https://prod.spline.design/nY5f6cCRY2Iashx0/scene.splinecode" />
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="services-section">
        <h2>Serviços</h2>

        <div className="services-grid">
          <ServiceCard
            img="https://res.cloudinary.com/dvqbwddan/image/upload/v1769346933/Sowe-Site/do-vfx-video-effects-vfx-compositing-visual-effects_kytrch.webp"
            title="VFX"
            desc="Efeitos visuais cinematográficos."
          />

          <ServiceCard
            img="https://res.cloudinary.com/dvqbwddan/image/upload/v1769347782/Sowe-Site/90109812-e8d34880-dd7e-11ea-9e0e-b11e25ca6123_pi4ycc.png"
            title="3D"
            desc="Modelagem, animação e renders."
          />

          <ServiceCard
            img="https://res.cloudinary.com/dvqbwddan/image/upload/v1769347890/Sowe-Site/piotr-cichosz-NhRk-907Ayc-unsplash_j4qyyi.jpg"
            title="Redes Sociais"
            desc="Conteúdos otimizados para Instagram e TikTok."
          />

          <ServiceCard
            img="https://res.cloudinary.com/dvqbwddan/image/upload/v1769348020/Sowe-Site/YT_fyxfft.jpg"
            title="YouTube"
            desc="Edição narrativa e retenção."
          />

          <ServiceCard
            img="https://res.cloudinary.com/dvqbwddan/image/upload/v1769346936/Sowe-Site/a-village-public-house-menus-stacked-in-a-basket-2026-01-09-10-03-35-utc_hdeaeb.jpg"
            title="Roteiros"
            desc="Criação estratégica para conversão."
          />

          <ServiceCard
            img="https://res.cloudinary.com/dvqbwddan/image/upload/v1769346933/Sowe-Site/trafego-pago_sxyzy1.jpg"
            title="Tráfego Pago"
            desc="Gestão de anúncios para resultados reais."
          />
        </div>
      </section>

      {/* VÍDEOS */}
      <section className="videos-section">
        <h2>Últimos Trabalhos</h2>

        <div className="videos-grid">
          <Video id="0OKPMsnscHc" />
          <Video id="SGsAEn5kTUA" />
          <Video id="EDDi_Vi1650" />
          <Video id="SH_VTSTyy9Q" />
        </div>
      </section>
    </>
  );
}

function ServiceCard({ img, title, desc }: any) {
  return (
    <div className="service-card image-card">
      <img src={img} alt={title} />
      <div className="service-overlay">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function Video({ id }: { id: string }) {
  return (
    <div className="video-card">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}
