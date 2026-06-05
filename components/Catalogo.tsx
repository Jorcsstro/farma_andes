"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { categoriasBase } from "@/data/site";
import type { Product } from "@/types/product";

type CatalogoProps = {
  products: Product[];
};

const MAX_VISIBLE_RESULTS = 60;

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function Catalogo({ products }: CatalogoProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeSearchText(deferredQuery.trim());
  const hasSearch = normalizedQuery.length > 0;

  const categories = useMemo(() => {
    const productCategories = Array.from(new Set(products.map((product) => product.categoria)));
    return categoriasBase.filter((item) => item === "Todos" || productCategories.includes(item));
  }, [products]);

  const searchableProducts = useMemo(
    () =>
      products.map((product) => ({
        product,
        searchText: normalizeSearchText(
          [
            product.nombre,
            product.categoria,
            product.marca,
            product.descripcionCorta,
            product.formato
          ].join(" ")
        )
      })),
    [products]
  );

  const filteredProducts = useMemo(() => {
    if (!hasSearch) {
      return [];
    }

    const matches: Product[] = [];

    for (const { product, searchText } of searchableProducts) {
      const matchesCategory = category === "Todos" || product.categoria === category;

      if (matchesCategory && searchText.includes(normalizedQuery)) {
        matches.push(product);
      }

      if (matches.length >= MAX_VISIBLE_RESULTS) {
        break;
      }
    }

    return matches;
  }, [category, hasSearch, normalizedQuery, searchableProducts]);

  return (
    <section className="catalog-section" id="catalogo">
      <span className="plus-float p1">+</span>
      <span className="plus-float p2">+</span>
      <span className="plus-float p3">+</span>

      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">
              <span className="pulse-dot" />
              Farmacia local · atención humana · San Fernando
            </div>

            <h1>
              Tu farmacia de confianza, con energía <span className="highlight">Andes</span>.
            </h1>
          </div>
        </div>

        <div className="catalog-tools reveal">
          <label className="search-box" htmlFor="product-search">
            <span className="sr-only">Buscar productos</span>
            <span aria-hidden="true">⌕</span>
            <input
              id="product-search"
              type="search"
              placeholder="Buscar por producto, marca o formato"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="category-tabs" role="tablist" aria-label="Filtrar por categoría">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={item === category ? "active" : ""}
                onClick={() => setCategory(item)}
                aria-pressed={item === category}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {hasSearch && filteredProducts.length > 0 && (
          <div className="catalog-results">
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="marquee-wrap" aria-hidden="true">
        <div className="marquee">
          <span>
            PROTECCIÓN SOLAR <b>+</b> MEDICAMENTOS <b>+</b> DERMOCOSMÉTICA <b>+</b> CUIDADO
            FAMILIAR <b>+</b> SAN FERNANDO <b>+</b>
          </span>

          <span>
            PROTECCIÓN SOLAR <b>+</b> MEDICAMENTOS <b>+</b> DERMOCOSMÉTICA <b>+</b> CUIDADO
            FAMILIAR <b>+</b> SAN FERNANDO <b>+</b>
          </span>
        </div>
      </div>
    </section>
  );
}
