import type { Metadata } from "next";

import {
  AndesVademecumSection,
  type VademecumListEntry
} from "@/components/AndesVademecumSection";
import styles from "@/components/AndesInternal.module.css";
import { getVademecumEntries } from "@/lib/vademecum";
import type { VademecumEntry } from "@/data/vademecum";

export const metadata: Metadata = {
  title: "Vademecum Farmacia Andes | Informacion de medicamentos",
  description: "Informacion consultiva sobre principios activos y uso seguro de medicamentos."
};

export const revalidate = 300;

function normalizeEntryText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toVademecumListEntry(entry: VademecumEntry): VademecumListEntry {
  return {
    id: entry.id,
    slug: entry.slug,
    nombre: entry.nombre,
    categoria: entry.categoria,
    categoriaTerapeutica: entry.categoriaTerapeutica,
    descripcion: entry.descripcion,
    usosComunes: entry.usosComunes.slice(0, 3),
    searchText: normalizeEntryText(
      [
        entry.nombre,
        entry.principioActivo,
        entry.categoria,
        entry.categoriaTerapeutica,
        entry.descripcion,
        entry.tipo,
        ...entry.usosComunes
      ]
        .filter(Boolean)
        .join(" ")
    )
  };
}

export default async function VademecumPage() {
  const entries = await getVademecumEntries();

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

        <AndesVademecumSection entries={entries.map(toVademecumListEntry)} />
      </div>
    </main>
  );
}
