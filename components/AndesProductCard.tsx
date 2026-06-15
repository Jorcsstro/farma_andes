import Image from "next/image";
import Link from "next/link";

import type { AndesProduct } from "@/data/productos";
import { formatCLP } from "@/lib/format";
import { AndesWhatsappButton } from "@/components/AndesWhatsappButton";
import styles from "@/components/AndesInternal.module.css";

type AndesProductCardProps = {
  product: AndesProduct;
};

export function AndesProductCard({ product }: AndesProductCardProps) {
  return (
    <article className={styles.card}>
      <Link className={styles.media} href={`/productos/${product.slug}`}>
        <Image src={product.imagen} alt={product.nombre} width={260} height={190} />
      </Link>

      <div className={styles.cardBody}>
        <span className={styles.category}>{product.categoria}</span>
        <h2>{product.nombre}</h2>
        <div className={styles.meta}>
          <span>{product.condicionVenta}</span>
          <span>{product.formato}</span>
          {product.principioActivo && <span>Principio activo: {product.principioActivo}</span>}
        </div>
        {product.precio ? <strong className={styles.price}>{formatCLP(product.precio)}</strong> : null}

        <div className={styles.actions}>
          <Link className={styles.buttonSecondary} href={`/productos/${product.slug}`}>
            Ver detalle
          </Link>
          <AndesWhatsappButton
            label="Consultar disponibilidad"
            message={`Hola Farmacia Andes, quisiera consultar disponibilidad de ${product.nombre}.`}
          />
        </div>
      </div>
    </article>
  );
}
