"use client";

import { useMemo, useState } from "react";

import { AndesProductCard } from "@/components/AndesProductCard";
import { AndesSearch } from "@/components/AndesSearch";
import type { AndesProduct } from "@/data/productos";
import styles from "@/components/AndesInternal.module.css";

type AndesCatalogProps = {
  products: AndesProduct[];
  categories: string[];
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function AndesCatalog({ products, categories }: AndesCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return products.filter((product) => {
      const matchesCategory = category === "Todos" || product.categoria === category;
      const searchable = normalize(
        [product.nombre, product.categoria, product.principioActivo, product.formato].join(" ")
      );

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, products, query]);

  return (
    <>
      <div className={styles.toolbar}>
        <AndesSearch
          label="Buscar productos"
          placeholder="Buscar por nombre, categoria o principio activo..."
          value={query}
          onChange={setQuery}
        />
        <div className={styles.filters} aria-label="Filtros por categoria">
          {["Todos", ...categories].map((item) => (
            <button
              className={`${styles.filter} ${category === item ? styles.filterActive : ""}`}
              key={item}
              type="button"
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length ? (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <AndesProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>No encontramos productos para esta busqueda. Escribenos por WhatsApp.</div>
      )}
    </>
  );
}
