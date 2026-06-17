import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AndesProductCard } from "@/components/AndesProductCard";
import { AndesWhatsappButton } from "@/components/AndesWhatsappButton";
import styles from "@/components/AndesInternal.module.css";
import {
  getRelatedMedicineProductsForEntry,
  getVademecumEntries,
  getVademecumEntryBySlug
} from "@/lib/vademecum";

type VademecumPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

function renderListBlock(title: string, items?: string[]) {
  if (!items?.length) return null;

  return (
    <div className={styles.block}>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function renderTextBlock(title: string, content?: string) {
  if (!content) return null;

  return (
    <div className={styles.block}>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}

export async function generateStaticParams() {
  const entries = await getVademecumEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: VademecumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getVademecumEntryBySlug(slug);

  if (!entry) {
    return {
      title: "Medicamento no encontrado | Farmacia Andes"
    };
  }

  return {
    title: `${entry.nombre} | Vademecum Farmacia Andes`,
    description: `${entry.nombre}: informacion consultiva, usos comunes y advertencias generales.`
  };
}

export default async function VademecumEntryPage({ params }: VademecumPageProps) {
  const { slug } = await params;
  const entry = await getVademecumEntryBySlug(slug);

  if (!entry) notFound();

  const relatedProducts = await getRelatedMedicineProductsForEntry(entry);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href="/vademecum">Vademecum</Link>
          <span>/</span>
          <span>{entry.nombre}</span>
        </nav>

        <section className={styles.hero}>
          <span className={styles.kicker}>{entry.categoriaTerapeutica ?? entry.categoria}</span>
          <h1>{entry.nombre}</h1>
          <p>{entry.descripcion}</p>
        </section>

        <section className={styles.facts} aria-label="Resumen del medicamento">
          {entry.tipo ? (
            <div className={styles.fact}>
              <span>Tipo de ficha</span>
              <strong>{entry.tipo === "medicamento-catalogo" ? "Medicamento del catalogo" : "Principio activo"}</strong>
            </div>
          ) : null}
          {entry.principioActivo ? (
            <div className={styles.fact}>
              <span>Principio activo / medicamento</span>
              <strong>{entry.principioActivo}</strong>
            </div>
          ) : null}
          {entry.categoriaTerapeutica ? (
            <div className={styles.fact}>
              <span>Categoria terapeutica</span>
              <strong>{entry.categoriaTerapeutica}</strong>
            </div>
          ) : null}
          {entry.condicionesVenta?.length ? (
            <div className={styles.fact}>
              <span>Condicion de venta</span>
              <strong>{entry.condicionesVenta.join(", ")}</strong>
            </div>
          ) : null}
          {entry.formasFarmaceuticas?.length ? (
            <div className={styles.fact}>
              <span>Formatos comunes</span>
              <strong>{entry.formasFarmaceuticas.join(", ")}</strong>
            </div>
          ) : null}
        </section>

        <section className={styles.blocks}>
          {renderListBlock("Usos comunes", entry.usosComunes)}
          {renderListBlock("Advertencias importantes", entry.advertencias)}
          {renderListBlock("Contraindicaciones generales", entry.contraindicacionesGenerales)}
          {renderListBlock("Interacciones generales", entry.interaccionesGenerales)}
          {renderTextBlock("Embarazo y lactancia", entry.embarazoLactancia)}
          {renderTextBlock("Adulto mayor", entry.adultoMayor)}
          {renderTextBlock("Ninos", entry.ninos)}
          {renderListBlock("Cuando consultar al quimico farmaceutico", entry.cuandoConsultar ?? entry.consultaFarmaceutica)}

          <div className={styles.notice}>
            <h2>Informacion educativa</h2>
            <p>
              Este contenido no reemplaza la atencion medica ni la orientacion del quimico farmaceutico. No te automediques. Consulta siempre si tienes enfermedades de base, embarazo, lactancia, uso de otros medicamentos o sintomas persistentes.
            </p>
          </div>

          {entry.fuenteRevision ? (
            <div className={styles.block}>
              <h2>Revision de contenido</h2>
              <p>
                Revisado por {entry.fuenteRevision.revisadoPor}. Ultima revision: {entry.fuenteRevision.fechaRevision}. Fuente: {entry.fuenteRevision.fuente}.
              </p>
            </div>
          ) : null}
        </section>

        <section className={styles.related}>
          <h2>Medicamentos relacionados</h2>
          <AndesWhatsappButton
            label="Consultar medicamentos relacionados por WhatsApp"
            message={`Hola Farmacia Andes, quisiera consultar medicamentos relacionados con ${entry.nombre}.`}
          />

          {relatedProducts.length ? (
            <div className={styles.grid}>
              {relatedProducts.map((product) => (
                <AndesProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>No hay medicamentos relacionados disponibles en el catalogo.</div>
          )}
        </section>
      </div>
    </main>
  );
}