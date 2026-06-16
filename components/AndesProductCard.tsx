import Image from "next/image";
import Link from "next/link";

import type { AndesProduct } from "@/data/productos";
import { formatCLP } from "@/lib/format";
import { buildWhatsappUrl } from "@/components/AndesWhatsappButton";
import styles from "@/components/AndesInternal.module.css";

type AndesProductCardProps = {
  product: AndesProduct;
};

export function AndesProductCard({ product }: AndesProductCardProps) {
  const isExternalImage = product.imagen.startsWith("http");
  return (
    <article className={styles.card}>
      <Link className={styles.media} href={`/productos/${product.slug}`}>
        <Image src={product.imagen} alt={product.nombre} width={260} height={190} unoptimized={isExternalImage} />
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
          <a
            className={styles.whatsappIcon}
            href={buildWhatsappUrl(`Hola Farmacia Andes, quisiera consultar disponibilidad de ${product.nombre}.`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar disponibilidad de ${product.nombre} por WhatsApp`}
          >
            <Image src="/icons/whatsapp.svg" alt="" width={18} height={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
