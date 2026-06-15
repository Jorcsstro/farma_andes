"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AndesSearch } from "@/components/AndesSearch";
import type { VademecumEntry } from "@/data/vademecum";
import styles from "@/components/AndesInternal.module.css";

type AndesVademecumSectionProps = {
  entries: VademecumEntry[];
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function AndesVademecumSection({ entries }: AndesVademecumSectionProps) {
  const [query, setQuery] = useState("");

  const filteredEntries = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    if (!normalizedQuery) return entries;

    return entries.filter((entry) =>
      normalize([entry.nombre, entry.categoria, entry.usosComunes.join(" ")].join(" ")).includes(normalizedQuery)
    );
  }, [entries, query]);

  return (
    <>
      <div className={styles.toolbar}>
        <AndesSearch
          label="Buscar en vademecum"
          placeholder="Buscar por principio activo, uso comun o categoria..."
          value={query}
          onChange={setQuery}
        />
      </div>

      {filteredEntries.length ? (
        <div className={styles.grid}>
          {filteredEntries.map((entry) => (
            <article className={styles.card} key={entry.id}>
              <div className={styles.cardBody}>
                <span className={styles.category}>{entry.categoria}</span>
                <h2>{entry.nombre}</h2>
                <p className={styles.meta}>{entry.usosComunes.slice(0, 3).join(", ")}</p>
                <div className={styles.actions}>
                  <Link className={styles.buttonSecondary} href={`/vademecum/${entry.slug}`}>
                    Ver ficha
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>No encontramos coincidencias en el vademecum.</div>
      )}
    </>
  );
}
