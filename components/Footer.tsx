import Image from "next/image";
import { farmacia } from "@/data/site";

export function Footer() {
  return (
    <footer className="footer-farmacia" id="contacto">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <Image
              src="/identidad-visual/02%20Horizontal%20Blanco%20Naranjo.png"
              alt="Farmacia Andes"
              width={178}
              height={62}
              sizes="178px"
            />
          </div>

          <p className="footer-subtitle">{farmacia.subtitulo}</p>

          <div className="footer-badges">
            <span>Lun a vie {farmacia.horarioSemana}</span>
            <span>Sábados {farmacia.horarioSabado}</span>
          </div>
        </div>

        <div className="footer-info">
          <h3>Contacto</h3>

          <div className="footer-item">
            <span>Dirección</span>
            <p>{farmacia.direccion}</p>
          </div>

          <div className="footer-item">
            <span>Teléfono</span>
            <p>{farmacia.telefono}</p>
          </div>

          <div className="footer-item">
            <span>WhatsApp</span>
            <a href={farmacia.whatsappUrl} target="_blank" rel="noopener noreferrer">
              Consultar disponibilidad
            </a>
          </div>

          <div className="footer-item">
            <span>Instagram</span>
            <a href={farmacia.instagramUrl} target="_blank" rel="noopener noreferrer">
              {farmacia.instagram}
            </a>
          </div>
        </div>

        <div className="footer-map" id="ubicacion">
          <h3>Ubicación</h3>

          <div className="map-box">
            <iframe
              title="Ubicación Farmacia Andes"
              src={farmacia.mapaEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <a className="map-link" href={farmacia.mapaUrl} target="_blank" rel="noopener noreferrer">
            Ver en Google Maps
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 farmaciaandes.cl — Todos los derechos reservados.</p>

        <div className="footer-links">
          <a href="#ubicacion">Ubicación</a>
          <a href={farmacia.whatsappUrl} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href={farmacia.instagramUrl} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
