"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";
import { categoriasBase, farmacia } from "@/data/site";
import { formatCLP } from "@/lib/format";
import { getProductImageUrl } from "@/lib/product-image-overrides";
import { buildProductWhatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

type CatalogoProps = {
  products: Product[];
};

const MAX_VISIBLE_RESULTS = 24;

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function SearchProductCard({ product }: { product: Product }) {
  const whatsappUrl = buildProductWhatsappUrl(product);
  const hasPrice = product.precio > 0;
  const imageUrl = getProductImageUrl(product);
  const isExternalImage = imageUrl.startsWith("http");
  const saleTypeClass = product.requiereReceta ? "search-tag-prescription" : "search-tag-free";

  return (
    <article className="search-product-card">
      <div className="search-product-media">
        <Image
          src={imageUrl}
          alt=""
          width={120}
          height={92}
          aria-hidden="true"
          unoptimized={isExternalImage}
        />
        {product.destacado && <span>Destacado</span>}
      </div>

      <div className="search-product-body">
        <small>{product.categoria}</small>
        <h3>{product.nombre}</h3>
        <p>{product.marca}</p>

        <div className="search-product-meta">
          <span>{product.formato}</span>
          <span className={saleTypeClass}>
            {product.requiereReceta ? "Requiere receta" : "Venta libre"}
          </span>
        </div>

        <div className="search-product-bottom">
          <strong>{hasPrice ? formatCLP(product.precio) : "Consultar"}</strong>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            Consultar
          </a>
        </div>
      </div>
    </article>
  );
}

export function Catalogo({ products }: CatalogoProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeSearchText(deferredQuery.trim());
  const hasSearch = normalizedQuery.length > 0;

  const categories = useMemo(() => {
    const productCategories = Array.from(new Set(products.map((product) => product.categoria)));
    const baseCategories = categoriasBase.filter((item) => item === "Todos" || productCategories.includes(item));
    const extraCategories = productCategories
      .filter((item) => !categoriasBase.includes(item))
      .sort((a, b) => a.localeCompare(b, "es"));

    return [...baseCategories, ...extraCategories];
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

  const searchMatches = useMemo(() => {
    if (!hasSearch) {
      return [];
    }

    return searchableProducts
      .filter(({ searchText }) => searchText.includes(normalizedQuery))
      .map(({ product }) => product);
  }, [hasSearch, normalizedQuery, searchableProducts]);

  const matchingProducts = useMemo(() => {
    return category === "Todos"
      ? searchMatches
      : searchMatches.filter((product) => product.categoria === category);
  }, [category, searchMatches]);

  const panelProducts = matchingProducts.slice(0, MAX_VISIBLE_RESULTS);

  return (
    <section className={`catalog-section ${hasSearch ? "has-search" : ""}`} id="catalogo">
      <span className="plus-float p1">+</span>
      <span className="plus-float p2">+</span>
      <span className="plus-float p3">+</span>

      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">
              <span className="pulse-dot" />
              Farmacia local - atencion humana - San Fernando
            </div>

            <h1>
              Tu farmacia de confianza, con energia <span className="highlight">Andes</span>.
            </h1>
          </div>
        </div>

        <div className="catalog-search-area reveal">
          <div className="catalog-tools">
            <label className="search-box" htmlFor="product-search">
              <span className="sr-only">Buscar productos</span>
              <span aria-hidden="true">Buscar</span>
              <input
                id="product-search"
                type="text"
                role="searchbox"
                placeholder="Buscar por producto, marca o formato"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCategory("Todos");
                }}
              />
              {query && (
                <button
                  className="search-clear"
                  type="button"
                  aria-label="Limpiar busqueda"
                  onClick={() => {
                    setQuery("");
                    setCategory("Todos");
                  }}
                >
                  x
                </button>
              )}
            </label>

            <div className="category-tabs" role="tablist" aria-label="Filtrar por categoria">
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

          {hasSearch && (
            <div className="search-results-panel" role="region" aria-label="Resultados de busqueda">
              {searchMatches.length > 0 ? (
                <div className="search-panel-grid">
                  <div className="search-products">
                    <div className="search-results-head">
                      <span>
                        {matchingProducts.length > panelProducts.length
                          ? `Mostrando ${panelProducts.length} de ${matchingProducts.length} resultados`
                          : `${panelProducts.length} resultados`}
                      </span>
                      <strong>{category === "Todos" ? "Todos" : category}</strong>
                    </div>

                    <div className="search-product-grid">
                      {panelProducts.map((product) => (
                        <SearchProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>

                  <aside className="search-help">
                    <h2>Buscas otra cosa?</h2>
                    <a href={`https://wa.me/${farmacia.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                    <a href="#horarios">Horarios</a>
                    <a href="#contacto">Contacto</a>
                  </aside>
                </div>
              ) : (
                <div className="search-empty">
                  <h2>Sin resultados</h2>
                  <p>Consulta por WhatsApp y el equipo revisara alternativas disponibles.</p>
                  <a href={`https://wa.me/${farmacia.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    Consultar por WhatsApp
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="marquee-wrap" aria-hidden="true">
        <div className="marquee">
          <span>
            PROTECCION SOLAR <b>+</b> MEDICAMENTOS <b>+</b> DERMOCOSMETICA <b>+</b> CUIDADO
            FAMILIAR <b>+</b> SAN FERNANDO <b>+</b>
          </span>

          <span>
            PROTECCION SOLAR <b>+</b> MEDICAMENTOS <b>+</b> DERMOCOSMETICA <b>+</b> CUIDADO
            FAMILIAR <b>+</b> SAN FERNANDO <b>+</b>
          </span>
        </div>
      </div>
    </section>
  );
}
