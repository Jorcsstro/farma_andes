import { farmacia } from "@/data/site";

export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-bg" aria-hidden="true" />

      <span className="plus-float p1">+</span>
      <span className="plus-float p2">+</span>
      <span className="plus-float p3">+</span>

      <div className="container hero-grid">
        <div className="hero-content reveal">
          <div className="eyebrow">
            <span className="pulse-dot" />
            Farmacia local · atención humana · San Fernando
          </div>

          <h1>
            Tu farmacia de confianza, con energía{" "}
            <span className="highlight">Andes</span>.
          </h1>

          <p className="lead">
            Consulta productos, precios referenciales y disponibilidad por WhatsApp:
            medicamentos, dermocosmética, protección solar, cuidado familiar y atención rápida
            desde San Fernando.
          </p>

          <div className="hero-actions">
            <a className="btn btn-blue magnetic" href="#catalogo">
              Ver catálogo
            </a>

            <a
              className="btn btn-soft"
              href={farmacia.mapaUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cómo llegar
            </a>
          </div>

          <div className="trust-row" aria-label="Indicadores de Farmacia Andes">
            <div className="trust-card">
              <b data-count="35">0</b>
              <span>publicaciones activas</span>
            </div>

            <div className="trust-card">
              <b data-count="69">0</b>
              <span>seguidores en crecimiento</span>
            </div>

            <div className="trust-card">
              <b>+ salud</b>
              <span>para toda la familia</span>
            </div>
          </div>
        </div>
      </div>

      <div className="marquee-wrap" aria-hidden="true">
        <div className="marquee">
          <span>
            PROTECCIÓN SOLAR <b>+</b> MEDICAMENTOS <b>+</b> DERMOCOSMÉTICA <b>+</b> CUIDADO
            FAMILIAR <b>+</b> SAN FERNANDO <b>+</b>
          </span>

          <span>
            PROTECCIÓN SOLAR <b>+</b> MEDICAMENTOS <b>+</b> DERMOCOSMÉTICA <b>+</b> CUIDADO
            FAMILIAR <b>+</b> SAN FERNANDO <b>+</b>
          </span>
        </div>
      </div>
    </section>
  );
}