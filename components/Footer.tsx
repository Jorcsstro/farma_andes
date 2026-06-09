import { Logo } from "@/components/Logo";
import { farmacia } from "@/data/site";

const customerLinks = [
  { href: "#nosotros", label: "Sobre nosotros" },
  { href: "#terminos", label: "Terminos y condiciones" },
  { href: "#privacidad", label: "Politicas de privacidad" },
  { href: "#reclamos", label: "Libro de reclamos" },
  { href: "#preguntas", label: "Preguntas frecuentes" }
];

const infoLinks = [
  { href: "#decreto-3", label: "Decreto 3" },
  { href: "#decreto-466", label: "Decreto 466" },
  { href: "#ram-isp", label: "Formulario RAM ISP" },
  { href: "#desabastecimiento", label: "Cartas de desabastecimiento" }
];

export function Footer() {
  return (
    <footer className="site-footer" id="contacto">
      <div className="container">
        <div className="footer-hero">
          <div className="footer-brand-panel">
            <Logo light />
            <p>{farmacia.subtitulo}</p>

            <div className="cenabast-badge">
              <span>Farmacia adherida</span>
              <strong>CENABAST</strong>
            </div>
          </div>

          <div className="footer-contact-panel">
            <span className="footer-kicker">Contacto directo</span>
            <h3>{farmacia.dominio}</h3>

            <div className="footer-contact-grid">
              <a href={`tel:${farmacia.telefono}`}>
                <span>Telefono</span>
                <strong>{farmacia.telefono}</strong>
              </a>

              <a href={farmacia.whatsappUrl} target="_blank" rel="noreferrer">
                <span>WhatsApp</span>
                <strong>Consultar disponibilidad</strong>
              </a>

              <a href={`mailto:${farmacia.email}`}>
                <span>Email</span>
                <strong>{farmacia.email}</strong>
              </a>

              <a href={farmacia.instagramUrl} target="_blank" rel="noreferrer">
                <span>Instagram</span>
                <strong>{farmacia.instagram}</strong>
              </a>
            </div>
          </div>

          <div className="footer-map-panel">
            <div>
              <span className="footer-kicker">Ubicacion</span>
              <h3>{farmacia.direccion}</h3>
              <p>
                Lunes a viernes: {farmacia.horarioSemana}
                <br />
                Sabados: {farmacia.horarioSabado}
              </p>
            </div>

            <div className="map-box">
              <iframe
                title="Ubicacion Farmacia Andes"
                src={farmacia.mapaEmbed}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="footer-link-row">
          <nav className="footer-link-group" aria-label="Servicio al cliente">
            <h4>Servicio al cliente</h4>
            <ul>
              {customerLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-link-group" aria-label="Informacion legal">
            <h4>Informacion</h4>
            <ul>
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-status">
            <span>Direccion tecnica</span>
            <strong>{farmacia.directorTecnico || "Q.F. por confirmar"}</strong>
            <span>Autorizacion ISP</span>
            <strong>{farmacia.resolucionISP}</strong>
          </div>
        </div>

        <div className="footer-bottom">
          <span>2026 farmaciaandes.cl | Todos los derechos reservados</span>
          <a href={farmacia.mapaUrl} target="_blank" rel="noreferrer">
            Abrir en Google Maps
          </a>
        </div>
      </div>
    </footer>
  );
}
