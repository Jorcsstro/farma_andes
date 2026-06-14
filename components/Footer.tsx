import Image from "next/image";
import { farmacia } from "@/data/site";
import styles from "./Footer.module.css";

function buildWhatsappMessage(message: string) {
  const whatsappBaseUrl = farmacia.whatsappUrl.split("?")[0];

  return `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}

export function Footer() {
  return (
    <footer className={styles.footer} id="contacto">
      <div className={styles.container}>
        <div className={styles.brand}>
          <Image
            src="/identidad-visual/02%20Horizontal%20Blanco%20Naranjo.png"
            alt="Farmacia Andes San Fernando"
            width={210}
            height={74}
            sizes="210px"
            className={styles.logo}
          />

          <p>
            {farmacia.subtitulo}. Medicamentos, cuidado personal y bienestar con
            atención cercana en {farmacia.ciudad}.
          </p>

          <a
            className={styles.whatsapp}
            href={buildWhatsappMessage(
              "Hola Farmacia Andes, quiero consultar por un producto."
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar por WhatsApp
          </a>
        </div>

        <div className={styles.col}>
          <h3>Contacto</h3>

          <div className={styles.item}>
            <span>Dirección</span>
            <p>{farmacia.direccion}</p>
          </div>

          <div className={styles.item}>
            <span>Teléfono</span>
            <p>{farmacia.telefono}</p>
          </div>

          <div className={styles.item}>
            <span>WhatsApp</span>
            <a
              href={buildWhatsappMessage(
                "Hola Farmacia Andes, quiero consultar disponibilidad."
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar disponibilidad
            </a>
          </div>

          <div className={styles.item}>
            <span>Instagram</span>
            <a
              href={farmacia.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {farmacia.instagram}
            </a>
          </div>
        </div>

        <div className={styles.col}>
          <h3>Horarios</h3>

          <div className={styles.item}>
            <span>Lunes a viernes</span>
            <p>{farmacia.horarioSemana}</p>
          </div>

          <div className={styles.item}>
            <span>Sábados</span>
            <p>{farmacia.horarioSabado}</p>
          </div>

          <div className={styles.item}>
            <span>Domingos y feriados</span>
            <p>{farmacia.horarioDomingo}</p>
          </div>

          <div className={styles.links}>
            <a href="#inicio">Inicio</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#encargo">Encargos</a>
            <a href="#ubicacion">Ubicación</a>
          </div>
        </div>

        <div className={styles.map}>
          <h3>Ubicación</h3>

          <div className={styles.mapBox}>
            <iframe
              title="Ubicación Farmacia Andes"
              src={farmacia.mapaEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <a
            className={styles.mapLink}
            href={farmacia.mapaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver ubicación en Google Maps
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 {farmacia.nombre}. Todos los derechos reservados.</p>

        <div className={styles.bottomLinks}>
          <a href="#ubicacion">Ubicación</a>

          <a
            href={buildWhatsappMessage(
              "Hola Farmacia Andes, quiero consultar por un producto."
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>

          <a
            href={farmacia.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
