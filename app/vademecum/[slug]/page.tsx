import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AndesProductCard } from "@/components/AndesProductCard";
import { AndesWhatsappButton } from "@/components/AndesWhatsappButton";
import { getProductosParaPrincipio, getVademecumEntry, vademecum } from "@/data/vademecum";
import styles from "@/components/AndesInternal.module.css";

type VademecumPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return vademecum.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: VademecumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getVademecumEntry(slug);

  if (!entry) {
    return {
      title: "Principio activo no encontrado | Farmacia Andes"
    };
  }

  return {
    title: `${entry.nombre} | Vademecum Farmacia Andes`,
    description: `${entry.nombre}: informacion consultiva, usos comunes y advertencias generales.`
  };
}

export default async function VademecumEntryPage({ params }: VademecumPageProps) {
  const { slug } = await params;
  const entry = getVademecumEntry(slug);

  if (!entry) notFound();

  const relatedProducts = getProductosParaPrincipio(entry.slug);

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
          <span className={styles.kicker}>{entry.categoria}</span>
          <h1>{entry.nombre}</h1>
          <p>{entry.descripcion}</p>
        </section>

        <section className={styles.blocks}>
          <div className={styles.block}>
            <h2>Usos comunes</h2>
            <ul>
              {entry.usosComunes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.block}>
            <h2>Advertencias importantes</h2>
            <ul>
              {entry.advertencias.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.block}>
            <h2>Cuando consultar al quimico farmaceutico</h2>
            <ul>
              {entry.consultaFarmaceutica.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.notice}>
            <p>No te automediques. Consulta siempre con un profesional de salud antes de iniciar, suspender o combinar medicamentos.</p>
          </div>
        </section>

        <section className={styles.related}>
          <h2>Productos relacionados</h2>
          <AndesWhatsappButton
            label="Consultar productos relacionados por WhatsApp"
            message={`Hola Farmacia Andes, quisiera consultar productos relacionados con ${entry.nombre}.`}
          />
          <div className={styles.grid}>
            {relatedProducts.map((product) => (
              <AndesProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
