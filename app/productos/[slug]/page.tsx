import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AndesProductDetail } from "@/components/AndesProductDetail";
import { getCatalogProducts, getCatalogProductBySlug } from "@/lib/catalog-products";
import styles from "@/components/AndesInternal.module.css";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Farmacia Andes"
    };
  }

  return {
    title: `${product.nombre} | Farmacia Andes`,
    description: `${product.nombre}: consulta disponibilidad, formato y precio referencial en Farmacia Andes.`
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href="/productos">Productos</Link>
          <span>/</span>
          <span>{product.nombre}</span>
        </nav>

        <AndesProductDetail product={product} />
      </div>
    </main>
  );
}
