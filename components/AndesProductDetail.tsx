"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { buildWhatsappUrl } from "@/components/AndesWhatsappButton";
import type { AndesProduct } from "@/data/productos";
import { getProductosRelacionados } from "@/data/productos";
import { formatCLP } from "@/lib/format";
import styles from "@/components/AndesInternal.module.css";

type AndesProductDetailProps = {
  product: AndesProduct;
};

const tabs = [
  { id: "descripcion", label: "Descripcion" },
  { id: "indicaciones", label: "Indicaciones" },
  { id: "advertencias", label: "Advertencias" },
  { id: "conservacion", label: "Conservacion" }
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AndesProductDetail({ product }: AndesProductDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>("descripcion");
  const relatedProducts = getProductosRelacionados(product.relacionados);

  const tabContent = useMemo(
    () => ({
      descripcion: {
        text: product.descripcion,
        points: [
          `Formato: ${product.formato}.`,
          product.contenido ? `Contenido: ${product.contenido}.` : "Contenido a confirmar en farmacia.",
          "Apto para consulta de disponibilidad por WhatsApp."
        ]
      },
      indicaciones: {
        text: product.indicaciones,
        points: [
          "Usar segun indicacion del envase o profesional de salud.",
          "Confirma si corresponde a tu necesidad antes de utilizarlo.",
          "Consulta al quimico farmaceutico si tienes dudas."
        ]
      },
      advertencias: {
        text: product.advertencias,
        points: [
          "No combines tratamientos sin orientacion profesional.",
          "Suspende y consulta si presentas reacciones no esperadas.",
          "Mantener fuera del alcance de ninos."
        ]
      },
      conservacion: {
        text: product.conservacion,
        points: [
          "Mantener en su envase original.",
          "Evitar humedad, calor y luz directa.",
          "Revisar fecha de vencimiento antes de usar."
        ]
      }
    }),
    [product]
  );

  const currentContent = tabContent[activeTab];

  return (
    <>
      <section className={styles.productDetailHero}>
        <div className={styles.productDetailImage}>
          {(() => {
            const isExternalImage = product.imagen.startsWith("http");
            return (
              <Image src={product.imagen} alt={product.nombre} width={520} height={390} priority unoptimized={isExternalImage} />
            );
          })()}
        </div>

        <div className={styles.productSummary}>
          <div className={styles.productTitleRow}>
            <h1>{product.nombre}</h1>
            <span className={styles.saleBadge}>{product.condicionVenta}</span>
          </div>

          <dl className={styles.productSpecs}>
            <div>
              <dt>Principio activo:</dt>
              <dd>{product.principioActivo || "No aplica"}</dd>
            </div>
            <div>
              <dt>Formato:</dt>
              <dd>{product.formato}</dd>
            </div>
            <div>
              <dt>Contenido:</dt>
              <dd>{product.contenido || "Consultar"}</dd>
            </div>
            <div>
              <dt>Laboratorio:</dt>
              <dd>{product.laboratorio || "Farmacia Andes"}</dd>
            </div>
          </dl>

          <strong className={styles.productDetailPrice}>{product.precio ? formatCLP(product.precio) : "Consultar"}</strong>

          <a
            className={styles.productWhatsapp}
            href={buildWhatsappUrl(`Hola Farmacia Andes, quisiera consultar disponibilidad de ${product.nombre}.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar disponibilidad
            <Image src="/icons/whatsapp.svg" alt="" width={24} height={24} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className={styles.productTabs}>
        <div className={styles.tabList} role="tablist" aria-label="Informacion del producto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? styles.tabActive : styles.tabButton}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.tabPanel} role="tabpanel">
          <p>{currentContent.text}</p>
          <ul>
            {currentContent.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className={styles.productWarning}>
          <strong>Importante:</strong> Esta informacion es orientativa y no reemplaza la indicacion medica.
          Consulta siempre a su quimico farmaceutico.
        </div>
      </section>

      {relatedProducts.length ? (
        <section className={styles.relatedCompact}>
          <div className={styles.relatedHeader}>
            <h2>Productos relacionados</h2>
            <Link href="/productos">Ver todos</Link>
          </div>

          <div className={styles.relatedCompactGrid}>
            {relatedProducts.map((relatedProduct) => (
              <article className={styles.relatedCompactCard} key={relatedProduct.id}>
                <Link className={styles.relatedCompactImage} href={`/productos/${relatedProduct.slug}`}>
                  <Image src={relatedProduct.imagen} alt={relatedProduct.nombre} width={120} height={110} unoptimized={relatedProduct.imagen.startsWith("http")} />
                </Link>
                <div>
                  <h3>{relatedProduct.nombre}</h3>
                  <span>{relatedProduct.contenido || relatedProduct.formato}</span>
                  <strong>{relatedProduct.precio ? formatCLP(relatedProduct.precio) : "Consultar"}</strong>
                </div>
                <a
                  className={styles.relatedWhatsapp}
                  href={buildWhatsappUrl(`Hola Farmacia Andes, quisiera consultar disponibilidad de ${relatedProduct.nombre}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Consultar ${relatedProduct.nombre} por WhatsApp`}
                >
                  <Image src="/icons/whatsapp.svg" alt="" width={20} height={20} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
