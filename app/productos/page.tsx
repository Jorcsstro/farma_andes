import type { Metadata } from "next";

import { AndesCatalog } from "@/components/AndesCatalog";
import { getCatalogProducts, getCatalogCategories } from "@/lib/catalog-products";
import styles from "@/components/AndesInternal.module.css";

export const metadata: Metadata = {
  title: "Nuestros productos | Farmacia Andes",
  description:
    "Consulta productos disponibles y comunicate con Farmacia Andes para confirmar stock.",
};

type ProductosPageProps = {
  searchParams?: Promise<{
    categoria?: string | string[];
  }>;
};

export default async function ProductosPage({
  searchParams,
}: ProductosPageProps) {
  const params = searchParams ? await searchParams : {};

  const categoriaParam = Array.isArray(params.categoria)
    ? params.categoria[0]
    : params.categoria;

  const categoriaSeleccionada = categoriaParam ?? "todos";
  const products = await getCatalogProducts();
  const categories = getCatalogCategories(products);
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.kicker}>Catálogo consultivo</span>
          <h1>Nuestros productos</h1>
          <p>
            Consulta productos disponibles y comunícate con Farmacia Andes para
            confirmar stock.
          </p>
        </section>

        <AndesCatalog
          products={products}
          categories={categories}
          initialCategory={categoriaSeleccionada}
        />
      </div>
    </main>
  );
}