import Image from "next/image";
import { formatCLP } from "@/lib/format";
import { buildProductWhatsappUrl } from "@/lib/whatsapp";
import type { Product, StockEstado } from "@/types/product";

const stockCopy: Record<StockEstado, { label: string; className: string }> = {
  disponible: { label: "Disponible", className: "stock-available" },
  consultar: { label: "Consultar stock", className: "stock-check" },
  agotado: { label: "Agotado", className: "stock-out" }
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const stock = stockCopy[product.stockEstado];
  const whatsappUrl = buildProductWhatsappUrl(product);
  const hasPrice = product.precio > 0;

  return (
    <article className="product-card">
      <div className="product-media">
        <Image src={product.imagenUrl} alt="" width={220} height={170} aria-hidden="true" />
        {product.destacado && (
          <span className="floating-badge">{product.precioAnterior ? "Oferta" : "Destacado"}</span>
        )}
      </div>

      <div className="product-body">
        <div className="product-meta">
          <span>{product.categoria}</span>
          <span>{product.formato}</span>
        </div>

        <h3>{product.nombre}</h3>
        <p className="product-brand">{product.marca}</p>
        <p className="product-description">{product.descripcionCorta}</p>

        <div className="product-tags" aria-label="Etiquetas del producto">
          <span className="tag tag-stock">
            <i className={stock.className} aria-hidden="true" />
            {stock.label}
          </span>
          <span className={`tag ${product.requiereReceta ? "tag-prescription" : "tag-free"}`}>
            {product.requiereReceta ? "Requiere receta" : "Venta libre"}
          </span>
          {product.precioAnterior && <span className="tag tag-offer">Oferta</span>}
        </div>

        <div className="product-bottom">
          <div>
            {hasPrice && product.precioAnterior && (
              <span className="old-price">{formatCLP(product.precioAnterior)}</span>
            )}
            <strong className="product-price">{hasPrice ? formatCLP(product.precio) : "Consultar"}</strong>
          </div>
          <a className="btn btn-product" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
