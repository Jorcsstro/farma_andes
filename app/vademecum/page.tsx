import type { Metadata } from "next";

import { AndesVademecumSection } from "@/components/AndesVademecumSection";
import { vademecum } from "@/data/vademecum";
import styles from "@/components/AndesInternal.module.css";

export const metadata: Metadata = {
  title: "Vademecum Farmacia Andes | Informacion de medicamentos",
  description: "Informacion consultiva sobre principios activos y uso seguro de medicamentos."
};

export default function VademecumPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.kicker}>Centro de informacion</span>
          <h1>Vademecum Farmacia Andes</h1>
          <p>Informacion consultiva sobre principios activos y uso seguro de medicamentos.</p>
        </section>

        <AndesVademecumSection entries={vademecum} />

        <section className={styles.notice}>
          <p>El vademecum tiene fines educativos y no reemplaza la evaluacion de un profesional de salud.</p>
        </section>
      </div>
    </main>
  );
}
