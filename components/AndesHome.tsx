"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { farmacia } from "@/data/site";
import { formatCLP } from "@/lib/format";
import { getProductImageUrl } from "@/lib/product-image-overrides";
import { buildProductWhatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";
import { Footer } from "@/components/Footer";

type AndesHomeProps = {
  products: Product[];
};

type CategoryCard = {
  id: string;
  title: string;
  subtitle: string;
  icon: "kit" | "bottle" | "heart" | "truck";
  terms: string[];
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


function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function productText(product: Product) {
  return normalizeText(
    [
      product.nombre,
      product.categoria,
      product.marca,
      product.descripcionCorta,
      product.formato,
      product.precioAnterior ? "oferta" : "",
      product.destacado ? "destacado oferta" : ""
    ].join(" ")
  );
}

function matchesTerms(product: Product, terms: string[]) {
  if (!terms.length) return true;

  const text = productText(product);

  return terms.some((term) => text.includes(normalizeText(term)));
}

function getProductPriority(product: Product) {
  if (productHasImage(product) && product.destacado && product.precioAnterior) return -2;
  if (productHasImage(product) && product.destacado) return -1;
  if (product.destacado && product.precioAnterior) return 0;
  if (product.destacado) return 1;
  if (product.precioAnterior) return 2;
  if (product.precio > 0) return 3;

  return 4;
}

function productHasImage(product: Product) {
  const imageUrl = getProductImageUrl(product);

  return Boolean(imageUrl && !imageUrl.endsWith("/products/receta.svg"));
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

function ProductTile({ product }: { product: Product }) {
  const imageUrl = getProductImageUrl(product);
  const isExternalImage = imageUrl.startsWith("http");
  const hasPrice = product.precio > 0;

  return (
    <article className="andes-product-card">
      <a
        className="andes-product-image"
        href={buildProductWhatsappUrl(product)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={imageUrl}
          alt={product.nombre}
          width={240}
          height={190}
          unoptimized={isExternalImage}
        />

        {product.precioAnterior && <span>Oferta</span>}
      </a>

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



export function AndesHome({ products }: AndesHomeProps) {
  // Estado del buscador hero (FiboSearch) — independiente del catálogo
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // Estado del catálogo — independiente del buscador
  const [activeFilter, setActiveFilter] = useState("todos");

  // Montar en cliente (necesario para portal)
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) {
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

  const offerProducts = useMemo(
    () =>
      [...products]
        .filter((product) => product.precioAnterior || product.destacado)
        .sort((a, b) => getProductPriority(a) - getProductPriority(b))
        .slice(0, 4),
    [products]
  );

  // Catálogo: solo filtra por categoría, sin texto de búsqueda
  const filteredProducts = useMemo(() => {
    const filter =
      quickFilters.find((item) => item.id === activeFilter) ?? quickFilters[0];

    return [...products]
      .filter((product) => matchesTerms(product, filter.terms))
      .sort((a, b) => getProductPriority(a) - getProductPriority(b))
      .slice(0, 12);
  }, [activeFilter, products]);

  // Buscador hero: resultados en tiempo real para el dropdown
  const searchResults = useMemo(() => {
    const normalized = normalizeText(searchQuery.trim());

    if (normalized.length < 2) return [];

    return [...products]
      .filter((product) => productText(product).includes(normalized))
      .sort((a, b) => getProductPriority(a) - getProductPriority(b))
      .slice(0, 6);
  }, [products, searchQuery]);

  const catalogProducts =
    activeFilter === "todos"
      ? featuredProducts
      : filteredProducts.length
        ? filteredProducts
        : featuredProducts;

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

                          return (
                            <a
                              key={product.id}
                              className="andes-search-result"
                              href={buildProductWhatsappUrl(product)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsSearchOpen(false)}
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
                <span>
                  <b>Productos</b>
                  de calidad
                </span>

                <span>
                  <b>Precios</b>
                  competitivos
                </span>

                <span>
                  <b>Atención</b>
                  cercana y confiable
                </span>
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

          {!filteredProducts.length && (
            <div className="andes-empty">
              No encontramos coincidencias exactas. Puedes encargarnos el producto
              por WhatsApp.
            </div>
          )}
        </section>

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

        <section className="andes-split-section" id="cuidado-personal">
          <div>
            <span>Cuidado personal</span>

            <h2>Higiene, belleza y protección para el día a día</h2>

            <p>
              Reunimos dermocosmética, cuidado familiar, protección solar e
              higiene para que encuentres soluciones prácticas cerca de casa.
            </p>

            <a
              href="#catalogo"
              onClick={() => setActiveFilter("cuidado-personal")}
            >
              Ver cuidado personal
            </a>
          </div>

          <Image
            src="/sections/banner-invierno-andes-real-products.png"
            alt="Productos de cuidado personal disponibles en Farmacia Andes"
            width={720}
            height={332}
          />
        </section>

        <section className="andes-wellness" id="salud-bienestar">
          <div className="andes-section-head">
            <span>Salud y bienestar</span>
            <h2>Acompañamiento cercano para cada necesidad</h2>
          </div>

          <div className="andes-service-grid">
            {[
              [
                "Orientación farmacéutica",
                "Te ayudamos a revisar alternativas, formatos y disponibilidad."
              ],
              [
                "Vitaminas y suplementos",
                "Opciones para energía, nutrición, defensas y bienestar diario."
              ],
              [
                "Recetas y continuidad",
                "Consulta disponibilidad y requisitos antes de visitar la farmacia."
              ],
              [
                "Atención local",
                "Estamos en San Fernando con comunicación directa por WhatsApp."
              ]
            ].map(([title, text]) => (
              <article key={title}>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="andes-offers" id="ofertas">
          <div className="andes-section-head">
            <span>Ofertas</span>
            <h2>Destacados y oportunidades</h2>
            <p>Una selección de productos para consultar de forma rápida.</p>
          </div>

          <div className="andes-offer-grid">
            {offerProducts.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        </section>
        <section className="andes-location-vademecum" id="ubicacion">
          <div className="andes-location-card">
            <div className="andes-location-copy">
              <span>Donde estamos</span>
              <h2>
                Estamos en el centro de <strong>{farmacia.ciudad}</strong>
              </h2>
              <p>Facil acceso y atencion cercana para tus consultas de salud.</p>

              <div className="andes-location-details">
                <a href={farmacia.mapaUrl} target="_blank" rel="noopener noreferrer">
                  <i aria-hidden="true" />
                  {farmacia.direccion}
                </a>
                <span>
                  <i aria-hidden="true" />
                  Lunes a Viernes: {farmacia.horarioSemana}
                  <br />
                  Sabados: {farmacia.horarioSabado}
                </span>
              </div>
            </div>

            <a
              className="andes-mini-map"
              href={farmacia.mapaUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver ubicacion de ${farmacia.nombre} en Google Maps`}
            >
              <span className="andes-map-park">
                Plaza de
                <br />
                San Fernando
              </span>
              <span className="andes-map-place andes-map-place--cathedral">
                Catedral
                <br />
                San Fernando
              </span>
              <span className="andes-map-place andes-map-place--mall">
                Mall
                <br />
                Vivo
              </span>
              <span className="andes-map-pin">
                <b>{farmacia.nombre}</b>
                <small>{farmacia.direccion}</small>
              </span>
            </a>
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
      <Footer />

      
      

      
    </div>
  );
}
