"use client";

import { useMemo, useState } from "react";
import { categoriasBase } from "@/data/site";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

type CatalogoProps = {
  products: Product[];
};

export function Catalogo({ products }: CatalogoProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");

  const categories = useMemo(() => {
    const productCategories = Array.from(new Set(products.map((product) => product.categoria)));
    return categoriasBase.filter((item) => item === "Todos" || productCategories.includes(item));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === "Todos" || product.categoria === category;
      const searchable = [
        product.nombre,
        product.categoria,
        product.marca,
        product.descripcionCorta,
        product.formato
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, products, query]);

  return (
    <section className="catalog-section" id="catalogo">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <span className="section-kicker">Catálogo inicial</span>
            <h2>Busca productos y consulta disponibilidad en segundos.</h2>
          </div>
          <p>
            Precios y stock son referenciales para esta primera etapa. Cada tarjeta abre WhatsApp
            con el producto listo para confirmar disponibilidad, receta o alternativa.
          </p>
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

        <div className="catalog-summary" aria-live="polite">
          <span>{filteredProducts.length} productos encontrados</span>
          <span>Stock a confirmar por WhatsApp</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No encontramos productos con esos filtros.</h3>
            <p>Prueba con otra categoría o escribe a WhatsApp para pedir una alternativa.</p>
          </div>
        )}
      </div>
    </section>
  );
}
