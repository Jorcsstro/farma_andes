"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import { farmacia } from "@/data/site";
import { formatCLP } from "@/lib/format";
import { getProductImageUrl } from "@/lib/product-image-overrides";
import { buildProductWhatsappUrl } from "@/lib/whatsapp";
import { getProductSlug } from "@/lib/product-slug";
import type { Product } from "@/types/product";

type AndesHomeProps = {
  products: HomeProduct[];
};

export type HomeProduct = Omit<Product, "descripcionCorta" | "bioequivalente"> & {
  searchText: string;
};

type CategoryCard = {
  id: string;
  title: string;
  subtitle: string;
  icon: "kit" | "bottle" | "heart" | "truck";
  terms: string[];
};

type TrustBenefit = {
  title: string;
  description: string;
  icon: "quality" | "price" | "care";
};

const categoryCards: CategoryCard[] = [
  {
    id: "medicamentos",
    title: "Medicamentos",
    subtitle: "Recetados y de venta libre",
    icon: "kit",
    terms: ["medicamento", "receta", "farmaco", "analgesico", "antibiotico"]
  },
  {
    id: "cuidado-personal",
    title: "Cuidado personal",
    subtitle: "Higiene, belleza y más",
    icon: "bottle",
    terms: ["higiene", "dermo", "cosmetica", "belleza", "cuidado personal", "solar"]
  },
  {
    id: "salud-bienestar",
    title: "Salud y bienestar",
    subtitle: "Productos para tu bienestar",
    icon: "heart",
    terms: ["bienestar", "vitamina", "suplemento", "nutricion", "magnesio", "omega"]
  },
  {
    id: "contacto",
    title: "Cercanos a ti",
    subtitle: "En San Fernando",
    icon: "truck",
    terms: []
  }
];

const trustBenefits: TrustBenefit[] = [
  { title: "Productos", description: "de calidad", icon: "quality" },
  { title: "Precios", description: "competitivos", icon: "price" },
  { title: "Atención", description: "cercana y confiable", icon: "care" },
];

const quickFilters = [
  { id: "todos", label: "Todos", terms: [] },
  { id: "medicamentos", label: "Medicamentos", terms: categoryCards[0].terms },
  { id: "cuidado-personal", label: "Cuidado personal", terms: categoryCards[1].terms },
  { id: "salud-bienestar", label: "Salud y bienestar", terms: categoryCards[2].terms },
  { id: "ofertas", label: "Ofertas", terms: ["oferta"] }
];

const featuredBrands = [
  { name: "Colgate", src: "/brands/colgate.png" },
  { name: "Nivea", src: "/brands/nivea.png" },
  { name: "Aquafresh", src: "/brands/aquafresh.png" },
  { name: "Banana Boat", src: "/brands/banana-boat.png" },
  { name: "Vitis", src: "/brands/vitis.png" },
  { name: "La Roche-Posay", src: "/brands/la-roche-posay.png" },
  { name: "Cicatricure", src: "/brands/cicatricure.png" },
  { name: "Bepanthol", src: "/brands/bepanthol.png" },
  { name: "CeraVe", src: "/brands/cerave.png" },
  { name: "Dove", src: "/brands/dove.png" },
  { name: "Eucerin", src: "/brands/eucerin.png" },
  { name: "ISDIN", src: "/brands/isdin.png" },
  { name: "Pantene", src: "/brands/pantene.png" },
  { name: "Rexona", src: "/brands/rexona.png" },
  { name: "Vichy", src: "/brands/vichy.png" },
  { name: "Dentaid", src: "/brands/dentaid.png" }
];

const winterSeasonTerms = [
  "ab antisep",
  "ab antitusivo",
  "abrilar",
  "acemuk",
  "antigripal",
  "bisolvon",
  "brontec",
  "caramelos de propoleo",
  "cetirizina",
  "clorfenamina",
  "desloratadina",
  "fexofenadina",
  "geniol",
  "hiedrix",
  "ibuprofeno",
  "kitadol",
  "knop palto miel",
  "loratadina",
  "mentholatum",
  "mucolitico",
  "nastizol",
  "nastul",
  "paracetamol",
  "propoleo",
  "suero fisiologico",
  "tapsin",
  "termometro",
  "tocalm",
  "vitamina c",
  "vaporub",
  "xumadol"
];

const winterPriorityTerms = [
  "tapsin",
  "geniol",
  "paracetamol",
  "ibuprofeno",
  "abrilar",
  "hiedrix",
  "propoleo",
  "vitamina c",
  "loratadina",
  "termometro",
  "suero fisiologico"
];


function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function productText(product: HomeProduct) {
  return product.searchText;
}

function matchesTerms(product: HomeProduct, terms: string[]) {
  if (!terms.length) return true;

  const text = productText(product);

  return terms.some((term) => text.includes(normalizeText(term)));
}

function getProductPriority(product: HomeProduct) {
  if (productHasImage(product) && product.destacado && product.precioAnterior) return -2;
  if (productHasImage(product) && product.destacado) return -1;
  if (product.destacado && product.precioAnterior) return 0;
  if (product.destacado) return 1;
  if (product.precioAnterior) return 2;
  if (product.precio > 0) return 3;

  return 4;
}

function productHasImage(product: HomeProduct) {
  const imageUrl = getProductImageUrl(product);

  return Boolean(imageUrl && !imageUrl.endsWith("/products/receta.svg"));
}

function isWinterSeasonProduct(product: HomeProduct) {
  if (product.precio <= 0) {
    return false;
  }

  const text = productText(product);

  return winterSeasonTerms.some((term) => text.includes(normalizeText(term)));
}

function getWinterProductPriority(product: HomeProduct) {
  const text = productText(product);
  const matchedPriority = winterPriorityTerms.findIndex((term) =>
    text.includes(normalizeText(term))
  );

  const termPriority = matchedPriority === -1 ? 30 : matchedPriority;
  const imagePriority = productHasImage(product) ? -8 : 0;
  const salePriority = product.requiereReceta ? 3 : 0;
  const featuredPriority = product.destacado ? -2 : 0;

  return termPriority + imagePriority + salePriority + featuredPriority;
}

function buildWhatsappMessage(message: string) {
  const whatsappBaseUrl = farmacia.whatsappUrl.split("?")[0];

  return `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function Icon({ name }: { name: CategoryCard["icon"] }) {
  if (name === "bottle") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M13 3h6v5l3 3v16a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V11l3-3V3Z" />
        <path d="M12 14h8" />
      </svg>
    );
  }

  if (name === "heart") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 28S5 21 5 12a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 9-11 16-11 16Z" />
        <path d="M9 16h5l2-4 3 8 2-4h3" />
      </svg>
    );
  }

  if (name === "truck") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M4 9h15v13H4V9Zm15 4h5l4 4v5h-9v-9Z" />
        <path d="M9 25a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm14 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M7 10h18a2 2 0 0 1 2 2v14H5V12a2 2 0 0 1 2-2Z" />
      <path d="M12 10V7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v3M16 15v7M12.5 18.5h7" />
    </svg>
  );
}

function TrustIcon({ name }: { name: TrustBenefit["icon"] }) {
  if (name === "price") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 8h12l10 10-9 9L8 17V8Z" />
        <path d="M11 12h.01M18 13l-5 5M19 19l-.01.01M13 13l.01.01" />
      </svg>
    );
  }

  if (name === "care") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 17v-5a5 5 0 0 1 10 0 5 5 0 0 1 10 0v5" />
        <path d="M5 17h22v3a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5v-3Z" />
        <path d="M12 17v4M20 17v4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 4 26 8v7c0 6-4 10-10 13C10 25 6 21 6 15V8l10-4Z" />
      <path d="m11 16 3 3 7-8" />
    </svg>
  );
}

function ProductTile({ product }: { product: HomeProduct }) {
  const imageUrl = getProductImageUrl(product);
  const isExternalImage = imageUrl.startsWith("http");
  const hasPrice = product.precio > 0;
  const productHref = `/productos/${getProductSlug(product)}`;

  return (
    <article className="andes-product-card">
      <Link
        className="andes-product-card-link"
        href={productHref}
        aria-label={`Ver detalle de ${product.nombre}`}
      />

      <div className="andes-product-image">
        <Image
          src={imageUrl}
          alt={product.nombre}
          width={240}
          height={190}
          unoptimized={isExternalImage}
        />

        {product.precioAnterior && <span>Oferta</span>}
      </div>

      <div className="andes-product-info">
        <p>{product.categoria}</p>
        <h3>{product.nombre}</h3>
        <small>{product.marca || farmacia.nombre}</small>

        <div className="andes-product-price">
          <div>
            {hasPrice && product.precioAnterior && (
              <del>{formatCLP(product.precioAnterior)}</del>
            )}

            <strong>{hasPrice ? formatCLP(product.precio) : "Consultar"}</strong>
          </div>

          <span>{product.requiereReceta ? "Con receta" : "Venta libre"}</span>
        </div>

        <a
          className="andes-product-button"
          href={buildProductWhatsappUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar
        </a>
      </div>
    </article>
  );
}

function WinterSeasonCarousel({ products }: { products: HomeProduct[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: -1 | 1) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const firstCard = track.querySelector<HTMLElement>(".andes-winter-card");
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 220;
    const columnGap = Number.parseFloat(window.getComputedStyle(track).columnGap || "16");

    track.scrollBy({
      behavior: "smooth",
      left: direction * (cardWidth + columnGap) * 2
    });
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="andes-winter-season" aria-label="Productos para temporada de invierno">
      <div className="andes-winter-banner-shell">
        <Image
          className="andes-winter-banner andes-winter-banner-desktop"
          src="/sections/invierno.png"
          alt="Temporada de invierno Farmacia Andes: resfrio y fiebre, tos y garganta, defensas, cuidado e higiene."
          width={2048}
          height={682}
          sizes="(max-width: 768px) calc(100vw - 32px), min(1180px, calc(100vw - 32px))"
          priority={false}
        />

        <Image
          className="andes-winter-banner andes-winter-banner-mobile"
          src="/sections/invierno-banner-movil.png"
          alt="Temporada de invierno Farmacia Andes (móvil): resfrio y fiebre, tos y garganta, defensas, cuidado e higiene."
          width={800}
          height={900}
          sizes="(max-width: 768px) calc(100vw - 32px)"
          priority={false}
        />
      </div>
      <div className="andes-winter-head">
        
        <div>
          
          <span>Temporada invierno</span>
          <h2>Productos para cuidarte en dias frios</h2>
          <p>
            Resfrio, tos, garganta, defensas y apoyo practico para consultar
            disponibilidad por WhatsApp.
          </p>
        </div>

        <div className="andes-winter-actions">
          <button type="button" aria-label="Ver productos anteriores de invierno" onClick={() => scrollByCard(-1)}>
            &lsaquo;
          </button>
          <button type="button" aria-label="Ver mas productos de invierno" onClick={() => scrollByCard(1)}>
            &rsaquo;
          </button>
        </div>
      </div>

      <div className="andes-winter-track" ref={trackRef}>
        {products.map((product) => {
          const imageUrl = getProductImageUrl(product);
          const isExternalImage = imageUrl.startsWith("http");

          return (
            <article className="andes-winter-card" key={product.id}>
              <a href={buildProductWhatsappUrl(product)} target="_blank" rel="noopener noreferrer">
                <span className="andes-winter-media">
                  <Image
                    src={imageUrl}
                    alt=""
                    width={180}
                    height={132}
                    aria-hidden="true"
                    unoptimized={isExternalImage}
                  />
                </span>

                <span className="andes-winter-info">
                  <small>{product.marca || farmacia.nombre}</small>
                  <strong>{product.nombre}</strong>
                  <span>{formatCLP(product.precio)}</span>
                  <em>{product.requiereReceta ? "Con receta" : "Venta libre"}</em>
                </span>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}



export function AndesHome({ products }: AndesHomeProps) {
  // Estado del buscador hero (FiboSearch) — independiente del catálogo
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // Estado del catálogo — independiente del buscador
  const [activeFilter, setActiveFilter] = useState("todos");
  const [catalogQuery, setCatalogQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Montar en cliente (necesario para portal)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const router = useRouter();

  // Calcular posición fija del dropdown desde el bounding rect del input y actualizar con scroll/resize
  useEffect(() => {
    function updatePosition() {
      if (isSearchOpen && searchWrapRef.current) {
        const rect = searchWrapRef.current.getBoundingClientRect();
        setDropdownStyle({
          position: "fixed",
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width,
          zIndex: 99999,
        });
      }
    }

    updatePosition();

    if (isSearchOpen) {
      window.addEventListener("scroll", updatePosition, { passive: true });
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isSearchOpen, searchQuery]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      const clickedInsideSearch = searchWrapRef.current?.contains(target) ?? false;
      const clickedInsideDropdown = searchDropdownRef.current?.contains(target) ?? false;

      if (!clickedInsideSearch && !clickedInsideDropdown) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const featuredProducts = useMemo(
    () =>
      [...products]
        .filter((product) => productHasImage(product))
        .sort((a, b) => getProductPriority(a) - getProductPriority(b))
        .slice(0, 12),
    [products]
  );

  // Catálogo: solo filtra por categoría, sin texto de búsqueda
  const filteredProducts = useMemo(() => {
    const filter =
      quickFilters.find((item) => item.id === activeFilter) ?? quickFilters[0];
    const normalizedQuery = normalizeText(catalogQuery.trim());

    return [...products]
      .filter((product) => matchesTerms(product, filter.terms))
      .filter((product) =>
        normalizedQuery ? productText(product).includes(normalizedQuery) : true
      )
      .sort((a, b) => getProductPriority(a) - getProductPriority(b))
      .slice(0, 12);
  }, [activeFilter, catalogQuery, products]);

  // Buscador hero: resultados en tiempo real para el dropdown
  const searchResults = useMemo(() => {
    const normalized = normalizeText(searchQuery.trim());

    if (normalized.length < 2) return [];

    return [...products]
      .filter((product) => productText(product).includes(normalized))
      .sort((a, b) => getProductPriority(a) - getProductPriority(b))
      .slice(0, 6);
  }, [products, searchQuery]);

  const isCatalogFiltering = activeFilter !== "todos" || catalogQuery.trim().length > 0;
  const catalogProducts = (
    isCatalogFiltering ? filteredProducts : featuredProducts
  ).slice(0, isMobile ? 4 : 12);

  const winterSeasonProducts = useMemo(
    () =>
      [...products]
        .filter(isWinterSeasonProduct)
        .sort((a, b) => {
          const priority = getWinterProductPriority(a) - getWinterProductPriority(b);

          if (priority !== 0) {
            return priority;
          }

          return a.nombre.localeCompare(b.nombre, "es");
        })
        .slice(0, 18),
    [products]
  );

  const requestMessage =
    "Hola Farmacia Andes, no encontré el producto que busco. Quiero enviar nombre, foto o receta para consultar disponibilidad.";

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSearchOpen(false);
  }

  function handleCategory(category: CategoryCard) {
    if (category.id === "contacto") {
      scrollToSection("contacto");
      return;
    }

    setActiveFilter(category.id);
    scrollToSection("catalogo");
  }

  return (
    <div className="andes-site" id="inicio">
    

      <main>
        <section className="andes-hero">
          <div className="andes-hero-bg" aria-hidden="true">
            <Image
              src="/images/farma-andes-hero.webp"
              alt=""
              fill
              sizes="100vw"
              priority
            />
          </div>

          <div className="andes-hero-content">
            <div className="andes-hero-copy">
              <h1>
                Tu farmacia <br />
                de confianza en <span>{farmacia.ciudad}</span>
              </h1>

              <p>
                Medicamentos, cuidado personal y bienestar con la atención cercana de{" "}
                {farmacia.nombre}.
              </p>

              <div ref={searchWrapRef} className="andes-search-wrap">
                <form className="andes-search" onSubmit={handleSearchSubmit}>
                  <label className="sr-only" htmlFor="andes-product-search">
                    Buscar productos
                  </label>

                  <span aria-hidden="true" />

                  <input
                    id="andes-product-search"
                    type="search"
                    placeholder="Buscar por producto, marca o categoría..."
                    value={searchQuery}
                    autoComplete="off"
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setIsSearchOpen(false);
                    }}
                  />

                  <button type="submit">Buscar</button>
                </form>
              </div>

              {/* Dropdown via portal — escapa cualquier stacking context del hero */}
              {isMounted && isSearchOpen && searchQuery.length >= 2 &&
                createPortal(
                  <div
                    ref={searchDropdownRef}
                    className="andes-search-dropdown"
                    style={dropdownStyle}
                    role="listbox"
                    aria-label="Resultados de búsqueda"
                  >
                    {searchResults.length > 0 ? (
                      <>
                                    {searchResults.map((product) => {
                          const imgUrl = getProductImageUrl(product);
                          const isExternal = imgUrl.startsWith("http");
                          const hasPrice = product.precio > 0;
                                      const slug = getProductSlug(product);

                                      return (
                                        <a
                                          key={product.id}
                                          className="andes-search-result"
                                          href={`/productos/${slug}`}
                                          onMouseDown={(e) => e.preventDefault()}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setIsSearchOpen(false);
                                            router.push(`/productos/${slug}`);
                                          }}
                                        >
                                          <span className="andes-search-result-img">
                                            <Image
                                              src={imgUrl}
                                              alt=""
                                              width={52}
                                              height={52}
                                              aria-hidden={true}
                                              unoptimized={isExternal}
                                            />
                                          </span>
                                          <span className="andes-search-result-info">
                                            <strong>{product.nombre}</strong>
                                            <small>{product.marca}</small>
                                          </span>
                                          <span className="andes-search-result-price">
                                            {hasPrice ? formatCLP(product.precio) : "Consultar"}
                                          </span>
                                        </a>
                                      );
                        })}
                        <div className="andes-search-footer">
                          <a
                            href={`https://wa.me/${farmacia.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsSearchOpen(false)}
                          >
                            ¿No lo encuentras? Consultar por WhatsApp →
                          </a>
                        </div>
                      </>
                    ) : (
                      <div className="andes-search-empty">
                        <span>
                          Sin resultados para <strong>&quot;{searchQuery}&quot;</strong>
                        </span>
                        <a
                          href={`https://wa.me/${farmacia.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Consultar por WhatsApp
                        </a>
                      </div>
                    )}
                  </div>,
                  document.body
                )}

              <div
                className="andes-trust-row"
                aria-label="Beneficios de Farmacia Andes"
              >
                {trustBenefits.map((benefit) => (
                  <span className="andes-trust-item" key={benefit.icon}>
                    <span className="andes-trust-icon">
                      <TrustIcon name={benefit.icon} />
                    </span>
                    <span className="andes-trust-text">
                      <b>{benefit.title}</b>
                      {benefit.description}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="andes-category-strip"
          aria-label="Categorías principales"
        >
          {categoryCards.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategory(category)}
            >
              <span>
                <Icon name={category.icon} />
              </span>

              <strong>{category.title}</strong>
              <small>{category.subtitle}</small>
            </button>
          ))}
        </section>

        <section className="andes-featured-brands">
          <h2 className="andes-brands-title">Marcas destacadas</h2>
          <div className="andes-brands-carousel-wrap">
            <div className="andes-brands-carousel">
              {[0, 1].map((group) => (
                <div className="andes-brands-group" key={group} aria-hidden={group === 1}>
                  {featuredBrands.map((brand) => (
                    <div className="andes-brand-item" key={`${group}-${brand.name}`}>
                      <Image
                        src={brand.src}
                        alt={brand.name}
                        width={120}
                        height={60}
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="andes-catalog" id="catalogo">
          <div className="andes-section-head">
            <span>Catálogo</span>
            <h2>Productos disponibles para consultar hoy</h2>
            <p>
              Busca por nombre, marca o categoría. Los precios son referenciales
              y se confirman por WhatsApp.
            </p>
          </div>

          <div className="andes-catalog-search" role="search">
            <label className="sr-only" htmlFor="andes-catalog-search">
              Buscar en el catalogo
            </label>
            <span aria-hidden="true" />
            <input
              id="andes-catalog-search"
              type="search"
              placeholder="Buscar producto, marca o categoria..."
              value={catalogQuery}
              autoComplete="off"
              onChange={(event) => setCatalogQuery(event.target.value)}
            />
          </div>

          <div className="andes-filter-row" aria-label="Filtros del catálogo">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={activeFilter === filter.id ? "active" : ""}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="andes-product-grid">
            {catalogProducts.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>

          {isCatalogFiltering && !filteredProducts.length && (
            <div className="andes-empty">
              No encontramos coincidencias exactas. Puedes encargarnos el producto
              por WhatsApp.
            </div>
          )}
        </section>

        <WinterSeasonCarousel products={winterSeasonProducts} />

        <section className="andes-request-banner" id="encargo">
          <div className="andes-request-visual" aria-hidden="true">
            <Image
              src="/identidad-visual/04%20Isotipo.png"
              alt=""
              width={118}
              height={92}
            />

            <i>+</i>
          </div>

          <div>
            <h2>
              ¿No encontraste lo que buscas?{" "}
              <span>¡Encárgalo en Farmacia Andes!</span>
            </h2>

            <p>
              Envíanos el nombre del producto, una foto del envase o tu receta.
              Revisamos disponibilidad, precio referencial y alternativas seguras
              para ayudarte a encontrar lo que necesitas.
            </p>
          </div>

          <div className="andes-request-actions">
            <a
              href={buildWhatsappMessage(requestMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/whatsapp.svg"
                alt=""
                width={22}
                height={22}
                aria-hidden="true"
              />
              Encargar por WhatsApp
            </a>

            <span>Tu salud es nuestra prioridad</span>
          </div>
        </section>

        <section className="andes-location-vademecum" id="ubicacion">
          <div className="andes-location-card">
            <div className="andes-location-left">
              <div className="andes-location-copy">
                <span className="andes-info-label">Donde estamos</span>

                <h2>
                  Estamos frente a la plaza de <strong>{farmacia.ciudad}</strong>
                </h2>
                <p>Facil acceso y atencion cercana para tus consultas de salud.</p>

              </div>

              <div className="andes-location-contact-grid" aria-label="Datos de contacto">
                <a
                  className="andes-location-contact-card"
                  href={farmacia.mapaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="andes-location-contact-icon andes-location-contact-icon--pin" aria-hidden="true" />
                  <span>
                    <strong>Direccion</strong>
                    {farmacia.direccion}
                  </span>
                </a>

                <a className="andes-location-contact-card" href={`mailto:${farmacia.email}`}>
                  <span className="andes-location-contact-icon andes-location-contact-icon--mail" aria-hidden="true" />
                  <span>
                    <strong>Correo</strong>
                    {farmacia.email}
                  </span>
                </a>

                <div className="andes-location-contact-card">
                  <span className="andes-location-contact-icon andes-location-contact-icon--clock" aria-hidden="true" />
                  <span>
                    <strong>Horario</strong>
                    Lunes a viernes
                    <br />
                    {farmacia.horarioSemana.replace(" hrs", "")}
                    <br />
                    Sabados {farmacia.horarioSabado.replace(" hrs", "")}
                  </span>
                </div>

                <a
                  className="andes-location-contact-card"
                  href={buildWhatsappMessage("Hola, quiero consultar por Farmacia Andes.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="andes-location-contact-icon andes-location-contact-icon--whatsapp" aria-hidden="true" />
                  <span>
                    <strong>WhatsApp</strong>
                    {farmacia.telefono}
                  </span>
                </a>
              </div>
            </div>

            <div className="andes-map-card">
              <div className="andes-map-frame">
                <iframe
                  title={`Mapa de ubicacion de ${farmacia.nombre}`}
                  src={farmacia.mapaEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <a
                  className="andes-map-open"
                  href={farmacia.mapaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir en Maps
                </a>
              </div>

              <div className="andes-map-summary">
                <span aria-hidden="true">+</span>
                <div>
                  <strong>Ubicacion practica y centrica</strong>
                  <p>
                    Estamos frente a la plaza, en un sector de facil acceso para
                    nuestros clientes.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        <section className="andes-info-section">
          <div className="andes-info-container">
            <div className="andes-info-header">
              <span className="andes-info-label">Centro de informacion</span>
              <h2>Informacion para tu salud</h2>
              <p>
                Consulta recursos utiles para conocer medicamentos y promover un
                uso seguro, responsable e informado.
              </p>
            </div>

            <div className="andes-info-grid">
              <Link href="/vademecum" className="andes-info-card">
                <div className="andes-info-icon">Rx</div>
                <h3>Vademecum</h3>
                <p>
                  Revisa informacion basica sobre medicamentos, principios
                  activos, presentaciones y recomendaciones generales.
                </p>
                <span>Ver vademecum &rarr;</span>
              </Link>

              <Link href="/uso-racional-de-medicamentos" className="andes-info-card">
                <div className="andes-info-icon">+</div>
                <h3>Uso racional de medicamentos</h3>
                <p>
                  Aprende buenas practicas para evitar la automedicacion,
                  duplicidad de tratamientos y uso incorrecto de farmacos.
                </p>
                <span>Ver recomendaciones &rarr;</span>
              </Link>
            </div>
          </div>
        </section>
        
        
      </main>
    </div>
  );
}
