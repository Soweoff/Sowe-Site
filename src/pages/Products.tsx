export default function Products() {
  return (
    <>
      <div className="content">
        <h1>
          CURSOS <br /> E TUTORIAIS
        </h1>

        <p className="description">
          Cursos e conteúdos educacionais sobre edição, After Effects, Blender,
          VFX e workflow profissional.
        </p>
      </div>

      <section className="products-section">
        {/* ================= CURSOS ================= */}
        <h2 className="products-title">Cursos</h2>

        <div className="products-grid">
          {/* Curso 1 */}
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/dvqbwddan/image/upload/v1769550317/Sowe-Site/CAPA-DO-CURSO_ezbomx.jpg"
              alt="Curso Criptomoedas"
            />
            <h3>
              Criptomoedas do Zero: Segurança, Carteiras, Trading e Uso Real
            </h3>
            <p>
              Este curso foi criado para quem quer entender de verdade o mercado
              de criptomoedas, sem promessas de lucro fácil e sem cair em
              golpes. Você aprenderá fundamentos do Bitcoin, blockchain,
              carteiras, exchanges e estratégias de trading.
            </p>
            <a
              href="https://go.hotmart.com/W104080017A?dp=1"
              target="_blank"
              rel="noopener noreferrer"
              className="product-button"
            >
              Saiba mais
            </a>
          </div>

          {/* Curso 2 */}
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/dvqbwddan/image/upload/v1770788616/Sowe-Site/Capa-CS-ECONOMY_vtypfr.jpg"
              alt="CS Economy"
            />
            <h3>CS ECONOMY</h3>
            <p>
              Método estruturado para transformar conhecimento sobre skins em
              resultado. Aprenda análise de mercado, oportunidades e estratégias
              profissionais de trade.
            </p>
            <a
              href="https://go.hotmart.com/G104389853D"
              target="_blank"
              rel="noopener noreferrer"
              className="product-button"
            >
              Saiba mais
            </a>
          </div>

          {/* Curso 3 */}
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/dvqbwddan/image/upload/v1770783426/Sowe-Site/Capa-do-curso-de-edi%C3%A7%C3%A3o_ahcoie.jpg"
              alt="Edição de Alto Valor"
            />
            <h3>Edição de Alto Valor</h3>
            <p>
              Edição estratégica para YouTube, reels, campanhas e modelagem 3D.
              Blender, Cinema 4D, EmberGen, Marvelous Designer, After Effects e
              Premiere aplicados à produção profissional.
            </p>
            <a href="#" className="product-button">
              Saiba mais
            </a>
          </div>
        </div>

        {/* ================= PRODUTOS ================= */}
        <h2 className="products-title">Produtos</h2>

        <div className="products-grid">
          {/* Produto 1 */}
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/dvqbwddan/image/upload/v1772001857/Sowe-Site/Estilos%20de%20edi%C3%A7%C3%A3o/3D_jypqhk.png"
              alt="Modelos 3D"
            />
            <h3>Modelos 3D</h3>
            <p>Assets otimizados para vídeos, jogos e renders.</p>
            <a href="#" className="product-button">
              Ver produto
            </a>
          </div>

          {/* Produto 2 */}
          <div className="product-card">
            <img src="/IMG/products/assets.jpg" alt="Assets" />
            <h3>Assets & Packs</h3>
            <p>Packs de efeitos, overlays e elementos visuais.</p>
            <a href="#" className="product-button">
              Ver produto
            </a>
          </div>

          {/* Produto 3 */}
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/dvqbwddan/image/upload/v1770753125/Sowe-Site/Capa-do-Pack-de-editing_u3a4ht.jpg"
              alt="Pack de Edição"
            />
            <h3>Pack de Edição</h3>
            <p>Presets, LUTs e templates para acelerar seu workflow.</p>
            <a
              href="https://evertonwience.gumroad.com/l/mgqmy"
              target="_blank"
              rel="noopener noreferrer"
              className="product-button"
            >
              Ver produto
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
