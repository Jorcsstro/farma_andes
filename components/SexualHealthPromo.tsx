import Image from "next/image";
import { buildProductWhatsappUrl } from "@/lib/whatsapp";
import { getProductImageUrl } from "@/lib/product-image-overrides";
import type { Product } from "@/types/product";

type SexualHealthPromoProps = {
  products: Product[];
};

const SEXUAL_HEALTH_PROMO_IDS = [
  "prod-10707",
  "prod-33152",
  "prod-9475",
  "prod-9476",
  "prod-11475",
  "prod-28054",
  "prod-47370",
  "prod-6162"
];

function SexualHealthPromoCard({ product }: { product: Product }) {
  const imageUrl = getProductImageUrl(product);
  const whatsappUrl = buildProductWhatsappUrl(product);

  return (
    <article className="sexual-health-promo-card">
      <div className="sexual-health-promo-media">
        <Image
          src={imageUrl}
          alt={product.nombre}
          width={160}
          height={125}
          aria-hidden="true"
        />
      </div>

      <div className="sexual-health-promo-info">
        <span>{product.marca}</span>
        <h4>{product.nombre}</h4>
        <p>{product.formato}</p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  );
}

export function SexualHealthPromo({ products }: SexualHealthPromoProps) {
  const promoProducts = SEXUAL_HEALTH_PROMO_IDS
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  if (promoProducts.length === 0) {
    return null;
  }

  return (
    <section className="sexual-health-promo-section" id="publicidad-salud-sexual">
      <div className="container">
        <div className="sexual-health-promo-banner reveal">
          <div className="sexual-health-promo-copy">
            <span>Salud sexual en Farmacia Andes</span>
            <h2>Productos reales y confianza para tu intimidad</h2>
            <p>
              Descubre preservativos, geles lubricantes y accesorios con imágenes reales del
              catálogo de Farmacia Andes. Compra con discreción, calidad y asesoría por WhatsApp.
            </p>
            <a
              className="btn btn-blue"
              href={buildProductWhatsappUrl(promoProducts[0])}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver productos ahora
            </a>
          </div>

          <div className="sexual-health-promo-grid">
            {promoProducts.slice(0, 4).map((product) => (
              <SexualHealthPromoCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
