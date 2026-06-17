import type { Metadata } from "next";
import Image from "next/image";

import { AndesWhatsappButton } from "@/components/AndesWhatsappButton";
import styles from "@/components/AndesInternal.module.css";

export const metadata: Metadata = {
  title: "Uso racional de medicamentos | Farmacia Andes",
  description: "Recomendaciones para usar medicamentos de forma segura, responsable e informada."
};

const usoRacionalPosterUrl = "https://www.redfarma.cl/img/carro-compra/USO-RACIONAL-DE-MEDICAMENTOS.jpg";

const recommendations = [
  {
    title: "Consulta antes de automedicarte.",
    text: "Evita iniciar tratamientos por cuenta propia, especialmente si tienes enfermedades cronicas, embarazo, lactancia o usas otros medicamentos."
  },
  {
    title: "Revisa la fecha de vencimiento.",
    text: "No uses medicamentos vencidos, alterados, abiertos indebidamente o sin identificacion clara."
  },
  {
    title: "No recomiendes medicamentos a otras personas.",
    text: "Un medicamento que sirvio a una persona puede no ser adecuado para otra, incluso con sintomas parecidos."
  },
  {
    title: "Almacena correctamente.",
    text: "Mantenlos en su envase original, lejos de humedad, calor, luz intensa y fuera del alcance de ninos."
  },
  {
    title: "Respeta la dosis indicada.",
    text: "Usa la cantidad, frecuencia y duracion recomendada por tu profesional de salud o por el envase."
  },
  {
    title: "Consulta al quimico farmaceutico.",
    text: "Pide orientacion si tienes dudas sobre dosis, interacciones, duplicidades, efectos no esperados o condiciones de venta."
  }
];

export default function UsoRacionalPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.kicker}>Educacion en salud</span>
          <h1>Uso racional de medicamentos</h1>
          <p>
            Informacion educativa para usar medicamentos de forma segura, responsable e informada.
          </p>
        </section>

        <section className={styles.posterSection} aria-labelledby="uso-racional-afiche-title">
          <div className={styles.posterIntro}>
            <span className={styles.kicker}>Material informativo</span>
            <h2 id="uso-racional-afiche-title">Guia visual para el uso responsable</h2>
            <p>
              Antes de usar un medicamento, revisa su envase, fecha de vencimiento, condiciones de almacenamiento y orientacion profesional cuando corresponda.
            </p>
          </div>

          <figure className={styles.posterFrame}>
            <Image
              src={usoRacionalPosterUrl}
              alt="Infografia Uso racional de medicamentos con recomendaciones sobre embarazo, fecha de vencimiento, no recomendar medicamentos, almacenamiento y mantener fuera del alcance de ninos."
              width={1342}
              height={896}
              className={styles.posterImage}
              priority
            />
            <figcaption>
              Infografia educativa sobre uso racional de medicamentos. Ante dudas, consulta al profesional tratante o al quimico farmaceutico.
            </figcaption>
          </figure>
        </section>

        <section className={styles.recommendations} aria-label="Recomendaciones de uso racional">
          {recommendations.map((item, index) => (
            <article className={styles.recommendation} key={item.title}>
              <span className={styles.number}>{index + 1}</span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.notice}>
          <h2>Informacion educativa</h2>
          <p>
            Este contenido no reemplaza la atencion medica ni la orientacion del quimico farmaceutico. No te automediques. Consulta siempre si tienes enfermedades de base, embarazo, lactancia, uso de otros medicamentos o sintomas persistentes.
          </p>
        </section>

        <section className={styles.cta}>
          <span className={styles.kicker}>Estamos para ayudarte</span>
          <h2>Tienes dudas sobre un medicamento?</h2>
          <p>Conversemos por WhatsApp para orientarte y confirmar disponibilidad en Farmacia Andes.</p>
          <div className={styles.actions}>
            <AndesWhatsappButton
              label="Escribenos por WhatsApp"
              message="Hola Farmacia Andes, tengo dudas sobre un medicamento y quisiera orientacion."
            />
          </div>
        </section>
      </div>
    </main>
  );
}
