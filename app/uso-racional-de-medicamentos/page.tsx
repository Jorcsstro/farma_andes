import type { Metadata } from "next";

import { AndesWhatsappButton } from "@/components/AndesWhatsappButton";
import styles from "@/components/AndesInternal.module.css";

export const metadata: Metadata = {
  title: "Uso racional de medicamentos | Farmacia Andes",
  description: "Recomendaciones para usar medicamentos de forma segura, responsable e informada."
};

const recommendations = [
  {
    title: "No te automediques.",
    text: "Evita iniciar tratamientos por cuenta propia, especialmente si tienes enfermedades cronicas o usas otros medicamentos."
  },
  {
    title: "Respeta la dosis indicada.",
    text: "Usa la cantidad, frecuencia y duracion recomendada por tu profesional de salud o por el envase."
  },
  {
    title: "No combines medicamentos sin orientacion.",
    text: "Algunos productos pueden duplicar principios activos o aumentar riesgos al mezclarse."
  },
  {
    title: "Conserva los medicamentos correctamente.",
    text: "Mantenlos en su envase original, lejos de humedad, calor y fuera del alcance de ninos."
  },
  {
    title: "Revisa fechas de vencimiento.",
    text: "No uses medicamentos vencidos, alterados, abiertos indebidamente o sin identificacion clara."
  },
  {
    title: "Consulta al quimico farmaceutico.",
    text: "Pide orientacion si tienes dudas sobre dosis, interacciones, duplicidades o efectos no esperados."
  }
];

export default function UsoRacionalPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.kicker}>Educacion en salud</span>
          <h1>Uso racional de medicamentos</h1>
          <p>Recomendaciones para usar medicamentos de forma segura, responsable e informada.</p>
        </section>

        <section className={styles.recommendations}>
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
