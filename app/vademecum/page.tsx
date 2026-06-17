import type { Metadata } from "next";

import { AndesVademecumSection } from "@/components/AndesVademecumSection";
import styles from "@/components/AndesInternal.module.css";
import { getVademecumEntries } from "@/lib/vademecum";

export const metadata: Metadata = {
  title: "Vademecum Farmacia Andes | Informacion de medicamentos",
  description: "Informacion consultiva sobre principios activos y uso seguro de medicamentos."
};

export default function VademecumPage() {
  const entries = getVademecumEntries();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.kicker}>Centro de informacion</span>
          <h1>Vademecum Farmacia Andes</h1>
          <p>
            Informacion consultiva sobre principios activos, usos comunes y orientacion para el uso responsable de medicamentos.
          </p>
        </section>

        <section className={styles.notice}>
          <h2>Informacion educativa</h2>
          <p>
            Este vademecum tiene fines informativos y no reemplaza la atencion medica ni la orientacion del quimico farmaceutico. No te automediques. Consulta siempre si tienes enfermedades de base, embarazo, lactancia, uso de otros medicamentos o sintomas persistentes.
          </p>
        </section>

        <AndesVademecumSection entries={entries} />
      </div>
    </main>
  );
}
