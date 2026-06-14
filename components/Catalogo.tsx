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

const DEFAULT_CATEGORY_IMAGE = "/identidad-visual/04%20Isotipo.png";
const BRAND_LOGOS = [
  { name: "Eucerin", src: "/brands/eucerin.png" },
  { name: "NIVEA", src: "/brands/nivea.png" },
  { name: "La Roche-Posay", src: "/brands/la-roche-posay.png" },
  { name: "Vichy", src: "/brands/vichy.png" },
  { name: "CeraVe", src: "/brands/cerave.png" },
  { name: "ISDIN", src: "/brands/isdin.png" },
  { name: "Banana Boat", src: "/brands/banana-boat.png" },
  { name: "Dove", src: "/brands/dove.png" },
  { name: "Rexona", src: "/brands/rexona.png" },
  { name: "Colgate", src: "/brands/colgate.png" },
  { name: "Vitis", src: "/brands/vitis.png" },
  { name: "Petrizzio", src: "/brands/petrizzio.png" },
  { name: "Pantene", src: "/brands/pantene.png" },
  { name: "Cicatricure", src: "/brands/cicatricure.png" },
  { name: "Bepanthol", src: "/brands/bepanthol.png" },
  { name: "Aquafresh", src: "/brands/aquafresh.png" }
];

const CATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  Todos: "/products/medicamentos/tapsin-infantil-160mg-16comp.jpg",
  Medicamentos: "/products/medicamentos/tapsin-infantil-160mg-16comp.jpg",
  "Protección solar": "/products/solar-kids.svg",
  Dermocosmética: "/products/medicamentos/prod-44688-garni-agua-mic-t-1-400-ml.jpg",
  "Cuidado familiar": "/products/showcase/dha-kids-omega-3-90-capsulas.jpg",
  Higiene: "/products/medicamentos/prod-44685-colgate-lum-w-carbon-90-g.jpg",
  Veterinaria: "/products/suero.svg",
  Accesorios: "/products/medicamentos/prod-12320-algodon-corriente-100-g.jpg",
  Homeopatía: "/products/medicamentos/prod-16056-armonyl-noche-con-manzanilla-20-capsulas.jpg"
};

const CATEGORY_IMAGE_HINTS: Record<string, string[]> = {
  Medicamentos: ["tapsin", "ibuprofeno", "paracetamol"],
  "Protección solar": ["solar", "spf", "after sun"],
  Dermocosmética: ["nivea", "crema", "piel", "serum"],
  "Cuidado familiar": ["kids", "bebe", "dha", "pediasure"],
  Higiene: ["oral", "bucal", "alcohol", "gel"],
  Veterinaria: ["veter", "perro", "gato", "mascota"],
  Accesorios: ["test", "algodon", "gasa"],
  Homeopatía: ["homeop", "armonyl", "natural"]
};

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isRealProductImageUrl(imageUrl: string) {
  return /\.(jpe?g|png|webp)(\?.*)?$/i.test(imageUrl) && !imageUrl.includes("/identidad-visual/");
}

function productMatchesHint(product: Product, hint: string) {
  const normalizedHint = normalizeSearchText(hint);

  return normalizeSearchText([product.nombre, product.marca, product.formato].join(" ")).includes(normalizedHint);
}

function getCategoryCoverProduct(category: string, products: Product[]) {
  const categoryProducts = category === "Todos" ? products : products.filter((product) => product.categoria === category);
  const hints = CATEGORY_IMAGE_HINTS[category] ?? [];

  for (const hint of hints) {
    const hintedProduct = categoryProducts.find((product) => {
      const imageUrl = getProductImageUrl(product);

      return productMatchesHint(product, hint) && isRealProductImageUrl(imageUrl);
    });

    if (hintedProduct) {
      return hintedProduct;
    }
  }

  for (const hint of hints) {
    const hintedProduct = categoryProducts.find((product) => productMatchesHint(product, hint));

    if (hintedProduct) {
      return hintedProduct;
    }
  }

  return (
    categoryProducts.find((product) => product.destacado && isRealProductImageUrl(getProductImageUrl(product))) ??
    categoryProducts.find((product) => isRealProductImageUrl(getProductImageUrl(product))) ??
    categoryProducts.find((product) => product.destacado && product.imagenUrl) ??
    categoryProducts.find((product) => product.imagenUrl) ??
    categoryProducts[0]
  );
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
const [isSearchOpen, setIsSearchOpen] = useState(false);

const deferredQuery = useDeferredValue(query);
const normalizedQuery = normalizeSearchText(deferredQuery.trim());
const hasSearch = normalizedQuery.length >= 2;

  const categories = useMemo(() => {
    const productCategories = Array.from(new Set(products.map((product) => product.categoria)));
    const baseCategories = categoriasBase.filter((item) => item === "Todos" || productCategories.includes(item));
    const extraCategories = productCategories
      .filter((item) => !categoriasBase.includes(item))
      .sort((a, b) => a.localeCompare(b, "es"));

    return [...baseCategories, ...extraCategories];
  }, [products]);

  const categoryCards = useMemo(
    () =>
      categories.map((item) => {
        const coverProduct = item === "Todos" ? undefined : getCategoryCoverProduct(item, products);
        const productImageUrl = coverProduct ? getProductImageUrl(coverProduct) : "";
        const imageUrl = isRealProductImageUrl(productImageUrl)
          ? productImageUrl
          : CATEGORY_IMAGE_FALLBACKS[item] || productImageUrl || DEFAULT_CATEGORY_IMAGE;
        const productCount = item === "Todos" ? products.length : products.filter((product) => product.categoria === item).length;

        return {
          name: item,
          imageUrl,
          isExternalImage: imageUrl.startsWith("http"),
          productCount
        };
      }),
    [categories, products]
  );

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

  const panelProducts = matchingProducts.slice(0, 6);
  const showSearchPanel = isSearchOpen && hasSearch;

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

            <div className="category-tabs" role="tablist" aria-label="Filtrar por categoria">
              {categoryCards.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={`category-card ${item.name === category ? "active" : ""}`}
                  onClick={() => setCategory(item.name)}
                  aria-label={`Filtrar ${item.productCount} productos de ${item.name}`}
                  aria-pressed={item.name === category}
                >
                  <span className="category-card-media" aria-hidden="true">
                    <Image
                      src={item.imageUrl}
                      alt=""
                      width={86}
                      height={70}
                      sizes="86px"
                      unoptimized={item.isExternalImage}
                    />
                  </span>
                  <span className="category-card-title">{item.name}</span>
                </button>
              ))}
            </div>
            
            <div className="search-box search-box-fibo">
  <label className="sr-only" htmlFor="product-search">
    Buscar productos
  </label>

  <span aria-hidden="true">Buscar</span>

  <input
    id="product-search"
    type="text"
    role="searchbox"
    placeholder="Buscar por producto, marca o formato"
    value={query}
    autoComplete="off"
    onFocus={() => setIsSearchOpen(true)}
    onKeyDown={(event) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    }}
    onChange={(event) => {
      setQuery(event.target.value);
      setCategory("Todos");
      setIsSearchOpen(true);
    }}
  />

  {query && (
    <button
      className="search-clear"
      type="button"
      aria-label="Limpiar búsqueda"
      onClick={() => {
        setQuery("");
        setCategory("Todos");
        setIsSearchOpen(false);
      }}
    >
      ×
    </button>
  )}
</div>

          </div>

          {showSearchPanel && (
            <div className="search-results-panel" role="region" aria-label="Resultados de busqueda">
              {searchMatches.length > 0 ? (
                <div className="search-panel-grid">
                  <div className="search-products">
                    <div className="search-results-head">
                      <span>
                        {matchingProducts.length > panelProducts.length
  ? `Mostrando ${panelProducts.length} de ${matchingProducts.length} resultados`
  : `${matchingProducts.length} resultado${matchingProducts.length === 1 ? "" : "s"}`}
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

      <div className="brand-marquee-wrap" aria-label="Marcas disponibles en Farmacia Andes">
        <div className="brand-marquee">
          {[0, 1].map((group) => (
            <div className="brand-marquee-group" key={group} aria-hidden={group === 1}>
              {BRAND_LOGOS.map((brand) => (
                <span className="brand-logo-pill" key={`${group}-${brand.name}`}>
                  <Image src={brand.src} alt={brand.name} width={130} height={48} sizes="130px" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
