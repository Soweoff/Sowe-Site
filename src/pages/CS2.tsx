import { whatsappUrl } from "../data/brand";
import { optimizeImage } from "../services/cloudinary";
import { usePageTitle } from "../services/usePageTitle";

export default function CS2() {
  usePageTitle("Compra e venda de skins de CS2");

  return (
    <>
      {/* MAIN */}
      <main>
        <div className="content">
          <h1>
            COMPRAMOS & VENDEMOS <br /> SKINS DE CS2
          </h1>

          <p className="description">
            Compra e venda de skins de CS2, com conteúdo sobre trade, upgrades
            e estratégias de mercado.
          </p>

          <div className="buttons">
            <a
              href="https://ig.me/m/sowe.skins"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-get-started"
            >
              Mande mensagem aqui
            </a>

            <a
              href={whatsappUrl("Olá! Quero comprar ou vender skins de CS2.")}
              className="btn-signing-main"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp &gt;
            </a>
          </div>
        </div>

        {/* INTRO */}
        <section className="cs2-intro">
          <h2>CS2 & Mercado</h2>

          <div className="cs2-content">
            <div className="cs2-text">
              <p>
                Atuo no mercado de Counter-Strike há anos, promovendo
                plataformas e gerando resultados reais através de cupons e
                campanhas estratégicas.
              </p>

              <ul className="cs2-achievements">
                <li>Parcerias com sites de skins</li>
                <li>Milhares de usuários via cupom</li>
                <li>Sorteios recorrentes</li>
                <li>Alto engajamento patrocinado</li>
              </ul>
            </div>

            <div className="cs2-images">
              <img
                src={optimizeImage(
                  "https://res.cloudinary.com/dvqbwddan/image/upload/v1769360196/Sowe-Site/CS2-IMG-1_w5glje.jpg",
                  900,
                )}
                alt="CS2"
                loading="lazy"
              />
              <img
                src={optimizeImage(
                  "https://res.cloudinary.com/dvqbwddan/image/upload/v1769360197/Sowe-Site/CS2-IMG-2_ui4cu1.jpg",
                  900,
                )}
                alt="CS2"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* PARCEIROS */}
        <section className="cs2-partners">
          <h2>Parceiros & Cupons</h2>

          <p className="page-note">
            Publicidade: são links de indicação e posso receber comissão quando
            você usa meus cupons. Os bônus mudam com o tempo; confira no site do
            parceiro. Conteúdo para maiores de 18 anos. Jogue com
            responsabilidade.
          </p>

          <div className="partners-list">
            {/* Skinsmonkey */}
            <div className="partner-card">
              <img
                className="partner-logo"
                src="https://res.cloudinary.com/dvqbwddan/image/upload/v1769355134/Sowe-Site/logo-skinsmonkey1-e1730745473590_wc80i1.png"
                alt="Skinsmonkey"
              />

              <div className="partner-info">
                <h3>Troque sua skins na Skinsmonkey!</h3>
                <p>
                  Cupom: <strong>SOWE</strong>
                  <br />
                  Bônus: <strong>+35%</strong>
                </p>
              </div>

              <a
                href="https://skinsmonkey.com/pt/r/SOWE"
                target="_blank"
                rel="noopener noreferrer"
                className="partner-button"
              >
                Acessar site
              </a>
            </div>

            {/* Skinflow */}
            <div className="partner-card">
              <div className="partner-media-video">
                <video
                  src="https://res.cloudinary.com/dvqbwddan/video/upload/v1769781789/Sowe-Site/skinflow-video_xk44bo.webm"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>

              <div className="partner-info">
                <h3>Skinflow Sell and Trade CS2 Skins</h3>
                <p>
                  Cupom: <strong>SOWE</strong>
                  <br />
                  Bônus: <strong>+5%</strong>
                </p>
              </div>

              <a
                href="https://skinflow.gg/?referral=SOWE"
                target="_blank"
                rel="noopener noreferrer"
                className="partner-button"
              >
                Acessar site
              </a>
            </div>

            {/* CSGO Skins */}
            <div className="partner-card">
              <div className="partner-media">
                <iframe
                  src="https://player.cloudinary.com/embed/?cloud_name=dvqbwddan&public_id=Sowe-Site%2Fstream-banner_tvb2jr&autoplay=true&loop=true&muted=true&controls=false"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                  title="CSGO Skins"
                />
              </div>

              <div className="partner-info">
                <h3>(+18) CSGO-SKINS</h3>
                <p>
                  Cupom: <strong>SOWE</strong>
                  <br />
                  Bônus: <strong>+10%</strong>
                </p>
              </div>

              <a
                href="https://csgo-skins.com/?ref=SOWE"
                target="_blank"
                rel="noopener noreferrer"
                className="partner-button"
              >
                Acessar site
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
