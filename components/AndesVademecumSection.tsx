"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AndesSearch } from "@/components/AndesSearch";
import styles from "@/components/AndesInternal.module.css";

type AndesVademecumSectionProps = {
  entries: VademecumListEntry[];
};

export type VademecumListEntry = {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  categoriaTerapeutica?: string;
  descripcion: string;
  usosComunes: string[];
  searchText: string;
};

const ENTRIES_PER_PAGE = 18;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getPaginationItems(currentPage: number, totalPages: number) {
  const delta = 2;
  const items: Array<number | "..."> = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  items.push(1);

  if (left > 2) {
    items.push("...");
  }

  for (let page = left; page <= right; page += 1) {
    items.push(page);
  }

  if (right < totalPages - 1) {
    items.push("...");
  }

  items.push(totalPages);

  return items;
}

export function AndesVademecumSection({ entries }: AndesVademecumSectionProps) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    if (!normalizedQuery) return entries;

    return entries.filter((entry) => entry.searchText.includes(normalizedQuery));
  }, [entries, query]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / ENTRIES_PER_PAGE));
  const paginationItems = getPaginationItems(currentPage, totalPages);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * ENTRIES_PER_PAGE,
    currentPage * ENTRIES_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  return (
    <>
      <div className={styles.toolbar}>
        <AndesSearch
          label="Buscar en vademecum"
          placeholder="Buscar por principio activo, medicamento o categoria terapeutica..."
          value={query}
          onChange={setQuery}
        />
        <p className={styles.meta}>
          Mostrando {paginatedEntries.length} de {filteredEntries.length} fichas disponibles en el vademecum.
        </p>
      </div>

      {filteredEntries.length ? (
        <>
          <div className={styles.grid}>
            {paginatedEntries.map((entry) => (
              <article className={styles.card} key={entry.id}>
                <div className={styles.cardBody}>
                  <span className={styles.category}>{entry.categoriaTerapeutica ?? entry.categoria}</span>
                  <h2>{entry.nombre}</h2>
                  <p className={styles.meta}>{entry.descripcion}</p>
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

          {totalPages > 1 ? (
            <nav className={styles.pagination} aria-label="Paginacion del vademecum">
              <button
                type="button"
                className={styles.pageButton}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                Anterior
              </button>

              {paginationItems.map((item, index) =>
                item === "..." ? (
                  <span className={styles.paginationEllipsis} key={`ellipsis-${index}`}>
                    ...
                  </span>
                ) : (
                  <button
                    type="button"
                    key={item}
                    className={item === currentPage ? styles.pageButtonActive : styles.pageButton}
                    onClick={() => setCurrentPage(item)}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                className={styles.pageButton}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                Siguiente
              </button>
            </nav>
          ) : null}
        </>
      ) : (
        <div className={styles.empty}>No encontramos coincidencias en el vademecum.</div>
      )}
    </>
  );
}
