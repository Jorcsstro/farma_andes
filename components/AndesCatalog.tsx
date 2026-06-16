"use client";

import { useEffect, useMemo, useState } from "react";

import { AndesProductCard } from "@/components/AndesProductCard";
import type { AndesProduct } from "@/data/productos";
import styles from "@/components/AndesInternal.module.css";

type AndesCatalogProps = {
  products: AndesProduct[];
  categories: string[];
  initialCategory?: string;
};

const PAGE_SIZE = 6;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function slugify(value: string) {
  return normalize(value)
    .replace(/&/g, "y")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function getCategoryFromSlug(categories: string[], categorySlug?: string) {
  if (!categorySlug || categorySlug === "todos") return "Todos";

  const matchedCategory = categories.find(
    (category) => slugify(category) === categorySlug
  );

  return matchedCategory ?? "Todos";
}

export function AndesCatalog({
  products,
  categories,
  initialCategory = "todos",
}: AndesCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(() =>
    getCategoryFromSlug(categories, initialCategory)
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("destacados");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setCategory(getCategoryFromSlug(categories, initialCategory));
    setPage(1);
  }, [categories, initialCategory]);

  const conditions = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.condicionVenta))
      ).sort(),
    [products]
  );

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateCategory(value: string) {
    setCategory(value);
    setPage(1);
  }

  function toggleCondition(value: string) {
    setSelectedConditions((current) =>
      current.includes(value)
        ? current.filter((condition) => condition !== value)
        : [...current, value]
    );
    setPage(1);
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalize(query);

    const matches = products.filter((product) => {
      const matchesCategory =
        category === "Todos" || product.categoria === category;

      const matchesCondition =
        !selectedConditions.length ||
        selectedConditions.includes(product.condicionVenta);

      const searchable = normalize(
        [
          product.nombre,
          product.categoria,
          product.principioActivo,
          product.formato,
          product.condicionVenta,
          product.laboratorio,
          product.descripcion
        ].join(" ")
      );

      return (
        matchesCategory &&
        matchesCondition &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });

    return [...matches].sort((a, b) => {
      if (sortBy === "nombre") {
        return a.nombre.localeCompare(b.nombre);
      }

      if (sortBy === "precio-menor") {
        return (
          (a.precio ?? Number.MAX_SAFE_INTEGER) -
          (b.precio ?? Number.MAX_SAFE_INTEGER)
        );
      }

      if (sortBy === "precio-mayor") {
        return (b.precio ?? 0) - (a.precio ?? 0);
      }

      return products.indexOf(a) - products.indexOf(b);
    });
  }, [category, products, query, selectedConditions, sortBy]);
  

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    // Reset to first page when search, category, conditions or sort change
    setPage(1);
  }, [query, category, selectedConditions, sortBy]);

  useEffect(() => {
    // Ensure current page is within bounds when totalPages changes
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className={styles.catalogLayout}>
      <aside className={styles.sidebar} aria-label="Filtros de productos">
        <div className={styles.sidebarGroup}>
          <h2>Categorías</h2>

          <div className={styles.sidebarList}>
            {["Todos", ...categories].map((item) => (
              <button
                className={`${styles.sidebarButton} ${
                  category === item ? styles.sidebarButtonActive : ""
                }`}
                key={item}
                type="button"
                onClick={() => updateCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sidebarGroup}>
          <h2>Condición de venta</h2>

          <div className={styles.checkboxList}>
            {conditions.map((condition) => (
              <label key={condition} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(condition)}
                  onChange={() => toggleCondition(condition)}
                />
                <span>{condition}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      <section className={styles.productArea} aria-label="Listado de productos">
        <div className={styles.catalogTools}>
          <div className={styles.fiboSearch}>
            <label className="sr-only" htmlFor="product-fibo-search">
              Buscar producto
            </label>

            <input
              id="product-fibo-search"
              type="search"
              value={query}
              placeholder="Buscar producto..."
              autoComplete="off"
              onChange={(event) => updateQuery(event.target.value)}
            />

            <button type="button" aria-label="Buscar productos">
              Buscar
            </button>
            
          </div>

          <select
            className={styles.sortSelect}
            value={sortBy}
            aria-label="Ordenar productos"
            onChange={(event) => {
              setSortBy(event.target.value);
              setPage(1);
            }}
          >
            <option value="destacados">Ordenar: Destacados</option>
            <option value="nombre">Ordenar: Nombre</option>
            <option value="precio-menor">Precio menor</option>
            <option value="precio-mayor">Precio mayor</option>
          </select>
        </div>

        {visibleProducts.length ? (
          <>
            <div className={styles.productGrid}>
              {visibleProducts.map((product) => (
                <AndesProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 ? (
              <nav
                className={styles.pagination}
                aria-label="Paginación de productos"
              >
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={
                      currentPage === item
                        ? styles.pageButtonActive
                        : styles.pageButton
                    }
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </button>
                ))}

                <button
                  type="button"
                  className={styles.pageButton}
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage((value) => Math.min(totalPages, value + 1))
                  }
                >
                  &gt;
                </button>
              </nav>
            ) : null}
          </>
        ) : (
          <div className={styles.empty}>
            No encontramos productos para esta búsqueda. Escríbenos por
            WhatsApp.
          </div>
        )}
      </section>
    </div>
  );
}