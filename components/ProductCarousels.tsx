"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatCLP } from "@/lib/format";
import { getProductImageUrl } from "@/lib/product-image-overrides";
import { buildProductWhatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

type ProductCarouselsProps = {
  products: Product[];
};

type ShowcaseConfig = {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
  winterProducts?: Product[];
  variant: "medicines" | "vitamins" | "nutrition" | "veterinary";
};

const MAX_CAROUSEL_ITEMS = 18;
const AUTO_SCROLL_DELAY_MS = 4800;

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function slugifyText(value: string) {
  return normalizeText(value)
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getProductSlug(product: Product) {
  const maybeSlug = (product as Product & { slug?: string }).slug;
  return maybeSlug ? maybeSlug : slugifyText(product.nombre);
}

function searchableText(product: Product) {
  return normalizeText(
    [
      product.nombre,
      product.marca,
      product.categoria,
      product.descripcionCorta,
      product.formato
    ].join(" ")
  );
}

function hasAnyTerm(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

function sortShowcaseProducts(products: Product[]) {
  return [...products]
    .filter((product) => product.precio > 0)
    .sort((a, b) => {
      if (a.destacado !== b.destacado) {
        return a.destacado ? -1 : 1;
      }

      return a.nombre.localeCompare(b.nombre, "es");
    })
    .slice(0, MAX_CAROUSEL_ITEMS);
}

function isVitaminOrSupplement(product: Product) {
  const text = searchableText(product);
  const terms = [
    "alervit",
    "apivit",
    "biotina",
    "calcio",
    "citrato de magnesio",
    "cranberry",
    "dha",
    "magnesio",
    "moringa",
    "multi 3",
    "multivitamin",
    "omega",
    "propoleo",
    "suplement",
    "triple magnesio",
    "triple omega",
    "vita sleep",
    "vitabion",
    "vitakron",
    "vitamax",
    "vitamina",
    "vitamin",
    "zinc",
    "zincovit"
  ];

  return product.categoria === "Cuidado familiar" && hasAnyTerm(text, terms);
}

function isNutritionProduct(product: Product) {
  const text = searchableText(product);
  const terms = [
    "ensure",
    "glucerna",
    "pediasure",
    "proteina",
    "proteinas",
    "protein",
    "whey"
  ];

  return product.categoria === "Cuidado familiar" && hasAnyTerm(text, terms);
}

function isMedicationProduct(product: Product) {
  return product.categoria === "Medicamentos";
}

function isVeterinaryProduct(product: Product) {
  return product.categoria === "Veterinaria";
}

function isWinterProduct(product: Product) {
  const text = searchableText(product);
  const terms = [
    "abrilar",
    "acido ascorbico",
    "antigripal",
    "bron",
    "cebion",
    "cetirizina",
    "clorfenamina",
    "descongestion",
    "finagrip",
    "garganta",
    "geniol",
    "hiedrix",
    "ibuprofeno",
    "jarabe",
    "kitadol",
    "loratadina",
    "miel",
    "mucolitico",
    "nastizol",
    "paracetamol",
    "propoleo",
    "resfrio",
    "salbutamol",
    "tapsin",
    "tocalm",
    "tos",
    "vitamina c",
    "xumadol"
  ];

  return hasAnyTerm(text, terms);
}

function sortWinterProducts(products: Product[]) {
  return [...products]
    .filter((product) => product.precio > 0 && isWinterProduct(product))
    .sort((a, b) => {
      if (a.destacado !== b.destacado) {
        return a.destacado ? -1 : 1;
      }

      const aImage = getProductImageUrl(a).includes(".svg") ? 1 : 0;
      const bImage = getProductImageUrl(b).includes(".svg") ? 1 : 0;

      if (aImage !== bImage) {
        return aImage - bImage;
      }

      return a.nombre.localeCompare(b.nombre, "es");
    })
    .slice(0, 16);
}

function ShowcaseProductCard({ product }: { product: Product }) {
  const whatsappUrl = buildProductWhatsappUrl(product);
  const imageUrl = getProductImageUrl(product);
  const isExternalImage = imageUrl.startsWith("http");
  const saleTypeLabel = product.requiereReceta ? "Requiere receta" : "Venta libre";
  const saleTypeClass = product.requiereReceta ? "showcase-pill-prescription" : "showcase-pill-free";

  const slug = getProductSlug(product);

  return (
    <article className="showcase-product-card">
      <Link href={`/productos/${slug}`} className="showcase-product-media">
        <span className={`showcase-product-pill ${saleTypeClass}`}>{saleTypeLabel}</span>
        <Image
          src={imageUrl}
          alt=""
          width={260}
          height={190}
          aria-hidden="true"
          unoptimized={isExternalImage}
        />
      </Link>

      <div className="showcase-product-copy">
        <Link href={`/productos/${slug}`}>
          <span>{product.marca}</span>
          <h3>{product.nombre}</h3>
          <p>{product.formato}</p>
        </Link>
      </div>

      <div className="showcase-product-bottom">
        <strong>{formatCLP(product.precio)}</strong>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  );
}

function WinterProductCard({ product }: { product: Product }) {
  const whatsappUrl = buildProductWhatsappUrl(product);
  const imageUrl = getProductImageUrl(product);
  const isExternalImage = imageUrl.startsWith("http");

  return (
    <article className="winter-product-card">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={`Consultar por ${product.nombre}`}>
        <span className="winter-product-media">
          <Image
            src={imageUrl}
            alt=""
            width={180}
            height={132}
            aria-hidden="true"
            unoptimized={isExternalImage}
          />
        </span>
        <span className="winter-product-info">
          <small>{product.marca}</small>
          <strong>{product.nombre}</strong>
          <span>{formatCLP(product.precio)}</span>
        </span>
      </a>
    </article>
  );
}

function WinterCareCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const firstCard = track.querySelector<HTMLElement>(".winter-product-card");
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 188;
    const columnGap = Number.parseFloat(window.getComputedStyle(track).columnGap || "12");

    track.scrollBy({
      behavior: "smooth",
      left: direction * (cardWidth + columnGap) * 2
    });
  }, []);

  if (!products.length) {
    return null;
  }

  return (
    <div className="winter-care-carousel reveal" aria-label="Productos de invierno destacados">
      <div className="winter-care-head">
        <div>
          <span>Temporada invierno</span>
          <h3>Para tener a mano</h3>
        </div>
        <div className="winter-care-actions">
          <button type="button" aria-label="Ver productos anteriores de invierno" onClick={() => scrollByCard(-1)}>
            &lsaquo;
          </button>
          <button type="button" aria-label="Ver mas productos de invierno" onClick={() => scrollByCard(1)}>
            &rsaquo;
          </button>
        </div>
      </div>

      <div className="winter-product-track" ref={trackRef}>
        {products.map((product) => (
          <WinterProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductShowcase({ config }: { config: ShowcaseConfig }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const firstCard = track.querySelector<HTMLElement>(".showcase-product-card");
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 280;
    const columnGap = Number.parseFloat(window.getComputedStyle(track).columnGap || "18");

    track.scrollBy({
      behavior: "smooth",
      left: direction * (cardWidth + columnGap)
    });
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (isAutoScrollPaused || !isPageVisible || config.products.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;

      if (isAtEnd) {
        track.scrollTo({ behavior: "smooth", left: 0 });
        return;
      }

      scrollByCard(1);
    }, AUTO_SCROLL_DELAY_MS);

    return () => window.clearInterval(intervalId);
  }, [config.products.length, isAutoScrollPaused, isPageVisible, scrollByCard]);

  if (!config.products.length) {
    return null;
  }

  return (
    <section className={`product-showcase product-showcase-${config.variant}`}>
      <div className="container">
        <div className="showcase-head reveal">
          <div>
            <span className="section-kicker">{config.eyebrow}</span>
            <h2>{config.title}</h2>
          </div>
          <p>{config.description}</p>
        </div>
      </div>

      <div
        className="showcase-carousel-shell"
        onBlurCapture={() => setIsAutoScrollPaused(false)}
        onFocusCapture={() => setIsAutoScrollPaused(true)}
        onMouseEnter={() => setIsAutoScrollPaused(true)}
        onMouseLeave={() => setIsAutoScrollPaused(false)}
      >
        <button
          className="showcase-arrow showcase-arrow-prev"
          type="button"
          aria-label={`Ver productos anteriores de ${config.title}`}
          onClick={() => scrollByCard(-1)}
        >
          &lsaquo;
        </button>

        <div className="showcase-carousel" aria-label={config.title}>
          <div className="showcase-track" ref={trackRef}>
            {config.products.map((product) => (
              <ShowcaseProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <button
          className="showcase-arrow showcase-arrow-next"
          type="button"
          aria-label={`Ver mas productos de ${config.title}`}
          onClick={() => scrollByCard(1)}
        >
          &rsaquo;
        </button>
      </div>

      {config.variant === "medicines" && (
        <div className="container winter-campaign-container">
          <a
            className="winter-campaign-banner reveal"
            href="#catalogo"
            aria-label="Ver productos para resfrio, tos y defensas en Farmacia Andes"
          >
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet="/sections/banner-invierno-andes.png"
              />
              <Image
                src="/sections/banner-invierno-andes-real-products.png"
                alt="Disfruta el invierno con cuidado Andes. Productos para resfrio, tos y defensas."
                width={1847}
                height={852}
                sizes="(max-width: 768px) calc(100vw - 32px), min(1180px, calc(100vw - 48px))"
                priority={false}
              />
            </picture>
          </a>

          <WinterCareCarousel products={config.winterProducts ?? []} />
        </div>
      )}

      {config.variant === "veterinary" && (
        <div className="container winter-campaign-container vet-campaign-container">
          <a
            className="winter-campaign-banner vet-campaign-banner reveal"
            href="#catalogo"
            aria-label="Ver productos veterinarios en Farmacia Andes"
          >
            <Image
              src="/sections/banner-veterinaria-andes.png"
              alt="Cuidado veterinario cerca de tu familia. Consulta antiparasitarios, suplementos y cuidado diario."
              width={1847}
              height={852}
              sizes="(max-width: 768px) calc(100vw - 32px), min(1180px, calc(100vw - 48px))"
              priority={false}
            />
          </a>
        </div>
      )}
    </section>
  );
}

export function ProductCarousels({ products }: ProductCarouselsProps) {
  const medicines = useMemo(() => sortShowcaseProducts(products.filter(isMedicationProduct)), [products]);
  const vitamins = useMemo(() => sortShowcaseProducts(products.filter(isVitaminOrSupplement)), [products]);
  const nutrition = useMemo(() => sortShowcaseProducts(products.filter(isNutritionProduct)), [products]);
  const veterinary = useMemo(() => sortShowcaseProducts(products.filter(isVeterinaryProduct)), [products]);
  const winterProducts = useMemo(() => sortWinterProducts(products), [products]);

  const sections = useMemo<ShowcaseConfig[]>(
    () => [
      {
        eyebrow: "Medicamentos",
        title: "Medicamentos destacados",
        description:
          "Opciones de uso frecuente, con consulta directa por disponibilidad y orientacion del equipo de Farmacia Andes.",
        products: medicines,
        winterProducts,
        variant: "medicines"
      },
      {
        eyebrow: "Cuidado familiar",
        title: "Vitaminas y suplementos",
        description:
          "Seleccion de vitaminas, minerales, omega, magnesio y suplementos para acompanar el cuidado diario.",
        products: vitamins,
        variant: "vitamins"
      },
      {
        eyebrow: "Nutricion",
        title: "Apoyo nutricional",
        description:
          "Productos nutricionales, proteinas y formulas de apoyo para distintas etapas y necesidades.",
        products: nutrition,
        variant: "nutrition"
      },
      {
        eyebrow: "Veterinaria",
        title: "Cuidado veterinario",
        description:
          "Antiparasitarios, suplementos y productos de cuidado para consultar disponibilidad en farmacia.",
        products: veterinary,
        variant: "veterinary"
      }
    ],
    [medicines, nutrition, veterinary, vitamins, winterProducts]
  );

  return (
    <>
      {sections.map((section) => (
        <ProductShowcase key={section.variant} config={section} />
      ))}
    </>
  );
}
