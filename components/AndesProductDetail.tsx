import Image from "next/image";

import { AndesProductCard } from "@/components/AndesProductCard";
import { AndesWhatsappButton } from "@/components/AndesWhatsappButton";
import type { AndesProduct } from "@/data/productos";
import { getProductosRelacionados } from "@/data/productos";
import { formatCLP } from "@/lib/format";
import styles from "@/components/AndesInternal.module.css";

type AndesProductDetailProps = {
  product: AndesProduct;
};

export function AndesProductDetail({ product }: AndesProductDetailProps) {
  const relatedProducts = getProductosRelacionados(product.relacionados);

  return (
    <>
      <section className={styles.detail}>
        <div className={styles.detailMedia}>
          <Image src={product.imagen} alt={product.nombre} width={360} height={300} priority />
        </div>

        <div className={styles.detailPanel}>
          <span className={styles.kicker}>{product.categoria}</span>
          <h1>{product.nombre}</h1>
          <div className={styles.facts}>
            <div className={styles.fact}>
              <span>Principio activo</span>
              <strong>{product.principioActivo || "No aplica"}</strong>
            </div>
            <div className={styles.fact}>
              <span>Presentacion</span>
              <strong>{product.formato}</strong>
            </div>
            <div className={styles.fact}>
              <span>Condicion de venta</span>
              <strong>{product.condicionVenta}</strong>
            </div>
            <div className={styles.fact}>
              <span>Precio referencial</span>
              <strong>{product.precio ? formatCLP(product.precio) : "Consultar"}</strong>
            </div>
          </div>

          <AndesWhatsappButton
            label="Consultar disponibilidad por WhatsApp"
            message={`Hola Farmacia Andes, quisiera consultar disponibilidad de ${product.nombre}.`}
          />

          <div className={styles.blocks}>
            <div className={styles.block}>
              <h2>Descripcion</h2>
              <p>{product.descripcion}</p>
            </div>
            <div className={styles.block}>
              <h2>Indicaciones generales</h2>
              <p>{product.indicaciones}</p>
            </div>
            <div className={styles.block}>
              <h2>Advertencias</h2>
              <p>{product.advertencias}</p>
            </div>
            <div className={styles.block}>
              <h2>Conservacion</h2>
              <p>{product.conservacion}</p>
            </div>
            <div className={styles.notice}>
              <p>
                Esta informacion es orientativa y no reemplaza la indicacion medica ni la consulta con el
                quimico farmaceutico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className={styles.related}>
          <h2>Productos relacionados</h2>
          <div className={styles.grid}>
            {relatedProducts.map((relatedProduct) => (
              <AndesProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
