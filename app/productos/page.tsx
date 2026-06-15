import type { Metadata } from "next";

import { AndesCatalog } from "@/components/AndesCatalog";
import { categoriasProductos, productos } from "@/data/productos";
import styles from "@/components/AndesInternal.module.css";

export const metadata: Metadata = {
  title: "Nuestros productos | Farmacia Andes",
  description: "Consulta productos disponibles y comunicate con Farmacia Andes para confirmar stock."
};

export default function ProductosPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.kicker}>Catalogo consultivo</span>
          <h1>Nuestros productos</h1>
          <p>Consulta productos disponibles y comunicate con Farmacia Andes para confirmar stock.</p>
        </section>

        <AndesCatalog products={productos} categories={categoriasProductos} />
      </div>
    </main>
  );
}
