import { featuredProducts } from "@/data/products";
import { farmacia, horarios, servicios } from "@/data/site";
import { formatCLP } from "@/lib/format";

export function Servicios() {
  return (
    <section id="servicios">
      <div className="container">
        <div className="section-head reveal">
          <h2>Más que vender productos: acompañamos tu cuidado.</h2>
          <p>
            Una web pensada para crecer: hoy informa y conecta por WhatsApp, mañana puede sumar
            productos reales desde Supabase, campañas y administración simple.
          </p>
        </div>

        <div className="cards">
          {servicios.map((item, index) => (
            <article
              className="service-card reveal"
              key={item.titulo}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="icon">{item.icono}</div>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OfertasYHorarios() {
  return (
    <section id="ofertas">
      <div className="container offers">
        <div className="offer-main reveal">
          <h3>Ofertas claras, visuales y listas para consultar.</h3>
          <p>
            Destaca productos de temporada, promociones por categoría y llamados directos a
            WhatsApp sin implementar pagos online en esta primera etapa.
          </p>
          <a
            className="btn btn-primary"
            href={`https://wa.me/${farmacia.whatsapp}?text=${encodeURIComponent(
              "Hola Farmacia Andes, quiero consultar por una oferta"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar disponibilidad
          </a>

          <div className="offer-grid">
            {featuredProducts.slice(0, 3).map((product) => (
              <article className="deal" key={product.id}>
                <small>{product.categoria}</small>
                <b>{product.nombre}</b>
                <strong>{product.precio > 0 ? formatCLP(product.precio) : "Consultar"}</strong>
              </article>
            ))}
          </div>
        </div>

        <aside className="side-panel reveal" id="horarios">
          <div className="hours-card">
            <h3>Horarios</h3>
            <div className="hours-list">
              {horarios.map((item) => (
                <div key={item.dia}>
                  <b>{item.dia}</b>
                  <span>{item.hora}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-card">
            <h3>Compra simple</h3>
            <p>
              Envía tu consulta, receta o foto del producto. El equipo puede confirmar stock,
              precio y alternativa disponible.
            </p>
            <a
              className="btn btn-blue"
              href={`https://wa.me/${farmacia.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribir ahora
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function Experiencia() {
  return (
    <section id="experiencia">
      <div className="container experience">
        <div className="andes-card reveal">
          <div className="andes-illustration" aria-hidden="true">
            <div className="sun" />
            <div className="mountain" />
            <div className="orange-river" />
          </div>
          <div className="andes-copy">
            <h2>Identidad visual inspirada en Andes.</h2>
            <p>
              Azul profundo para confianza, naranjo para energía y cercanía, formas de montaña y
              cruces médicos como patrón visual distintivo.
            </p>
          </div>
        </div>

        <div className="steps reveal">
          {[
            {
              title: "Atención rápida por WhatsApp",
              text:
                "Botones preparados para que el cliente consulte productos, ofertas, turnos y disponibilidad sin perder tiempo."
            },
            {
              title: "Datos listos para Supabase",
              text:
                "Los productos viven en archivos separados con el mismo contrato que luego puede mapearse a tablas reales."
            },
            {
              title: "Diseño memorable",
              text:
                "Integra colores corporativos, movimiento, tarjetas flotantes y una estética cercana sin verse como plantilla genérica."
            },
            {
              title: "Preparada para campañas",
              text:
                "Ideal para verano, invierno, vendimia, turnos y promociones semanales sin prometer stock automático."
            }
          ].map((step, index) => (
            <article className="step" key={step.title}>
              <div className="num">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contacto() {
  return (
    <section className="cta" id="contacto">
      <div className="container cta-box reveal">
        <div>
          <h2>Farmacia Andes, más cerca de tu salud.</h2>
          <p>
            Visítanos en San Fernando o escríbenos para consultar por medicamentos, protectores
            solares, productos de cuidado personal y ofertas vigentes.
          </p>
          <div className="cta-actions">
            <a
              className="btn btn-primary"
              href={`https://wa.me/${farmacia.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <a className="btn btn-white" href={farmacia.mapaUrl} target="_blank" rel="noopener noreferrer">
              Abrir mapa
            </a>
          </div>
        </div>

        <div className="quick-contact">
          <div className="contact-line">
            <span>Dirección</span>
            <b>{farmacia.direccion}</b>
          </div>
          <div className="contact-line">
            <span>Teléfono</span>
            <b>{farmacia.telefono}</b>
          </div>
          <div className="contact-line">
            <span>Instagram</span>
            <b>{farmacia.instagram}</b>
          </div>
          <div className="contact-line">
            <span>Facebook</span>
            <b>{farmacia.facebook}</b>
          </div>
        </div>
      </div>
    </section>
  );
}
