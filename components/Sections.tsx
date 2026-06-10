import Image from "next/image";
import { farmacia, horarios } from "@/data/site";
import { formatCLP } from "@/lib/format";
import { getProductImageUrl } from "@/lib/product-image-overrides";
import { buildProductWhatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

type OfertasYHorariosProps = {
  products: Product[];
};

const SEXUAL_HEALTH_TERMS = [
  "preserv",
  "lifestyles",
  "lifestyle",
  "skyn",
  "prudence",
  "lubric",
  "prolong",
  "sildenafil",
  "vimax",
  "anillo vibrador",
  "est funcion sexual",
  "orgazmax",
  "climax"
];

function normalizeSectionText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isSexualHealthProduct(product: Product) {
  const searchText = normalizeSectionText(
    [
      product.nombre,
      product.marca,
      product.categoria,
      product.descripcionCorta,
      product.formato
    ].join(" ")
  );

  return SEXUAL_HEALTH_TERMS.some((term) => searchText.includes(term));
}

function SexualHealthProductCard({ product }: { product: Product }) {
  const imageUrl = getProductImageUrl(product);
  const isExternalImage = imageUrl.startsWith("http");
  const whatsappUrl = buildProductWhatsappUrl(product);
  const hasPrice = product.precio > 0;

  return (
    <article className="sexual-product-card">
      <div className="sexual-product-media">
        <Image
          src={imageUrl}
          alt=""
          width={150}
          height={120}
          aria-hidden="true"
          unoptimized={isExternalImage}
        />
      </div>

      <div className="sexual-product-body">
        <div className="sexual-product-tags">
          <span>{product.categoria}</span>
          <span>{product.formato}</span>
        </div>

        <h4>{product.nombre}</h4>
        <strong className="sexual-product-brand">{product.marca}</strong>
        <p>{product.descripcionCorta}</p>

        <div className="sexual-product-bottom">
          <span>{product.requiereReceta ? "Requiere receta" : "Venta libre"}</span>
          <div>
            <strong>{hasPrice ? formatCLP(product.precio) : "Consultar"}</strong>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Servicios() {
  const requestUrl = `https://wa.me/${farmacia.whatsapp}?text=${encodeURIComponent(
    "Hola Farmacia Andes, quiero solicitar un producto que no encontre en la tienda."
  )}`;

  return (
    <section className="request-products-section" id="servicios">
      <div className="container request-products">
        <div className="request-products-banner request-code-banner reveal">
          <div className="request-banner-copy">
            <Image
              className="request-brand-logo"
              src="/identidad-visual/02%20Horizontal%20Color.png"
              alt="Farmacia Andes"
              width={250}
              height={90}
              priority={false}
            />

            <h2>¿No encontraste lo que buscas?</h2>
            <strong>Farmacia Andes lo revisa contigo</strong>
            <span className="request-line" aria-hidden="true" />

            <p>
              Envíanos el nombre del producto, una foto del envase o tu receta.
              Confirmamos disponibilidad, precio referencial y alternativas seguras para
              orientarte mejor.
            </p>

            <div className="request-banner-actions">
              <a className="request-whatsapp-btn" href={requestUrl} target="_blank" rel="noopener noreferrer">
                <span aria-hidden="true">w</span>
                Solicitar por WhatsApp
              </a>
              <a className="request-catalog-btn" href="#catalogo">
                Volver al catálogo
              </a>
            </div>
          </div>

          <div className="request-banner-visual" aria-hidden="true">
            <span className="request-plus request-plus-orange">+</span>
            <span className="request-plus request-plus-blue">+</span>
            <span className="request-chat-dots">
              <i />
              <i />
              <i />
            </span>

            <div className="request-rx-card">
              <b>Rx</b>
              <span />
              <span />
              <span />
            </div>

            <div className="request-phone">
              <div className="request-phone-wa">w</div>
              <div className="request-phone-panel">
                <h3>Cuéntanos qué producto necesitas</h3>
                <div>
                  <span>I</span>
                  <b>Nombre del producto</b>
                </div>
                <div>
                  <span />
                  <b>Foto del envase</b>
                </div>
                <div>
                  <span />
                  <b>Receta (opcional)</b>
                </div>
                <button type="button" tabIndex={-1}>Enviar</button>
              </div>
            </div>

            <div className="request-search-check">
              <span>✓</span>
            </div>

            <div className="request-benefits">
              <span><i />Disponibilidad</span>
              <span><i />Precio referencial</span>
              <span><i />Alternativas seguras</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OfertasYHorarios({ products }: OfertasYHorariosProps) {
  const sexualHealthProducts = products
    .filter(isSexualHealthProduct)
    .sort((a, b) => {
      if (a.destacado !== b.destacado) {
        return a.destacado ? -1 : 1;
      }

      return a.nombre.localeCompare(b.nombre, "es");
    })
    .slice(0, 3);

  return (
    <section id="ofertas">
      <div className="container offers">
        <div className="sexual-health-card reveal">
          <h3>Salud sexual</h3>

          <div className="sexual-product-list">
            {sexualHealthProducts.length > 0 ? (
              sexualHealthProducts.map((product) => (
                <SexualHealthProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="sexual-products-empty">
                <p>Pronto agregaremos productos de salud sexual en esta sección.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="side-panel reveal" id="horarios">
          <div className="hours-card">
            <span className="hours-kicker">Atención presencial</span>
            <h3>Horarios de farmacia</h3>
            <div className="hours-list">
              {horarios.map((item) => (
                <div key={item.dia}>
                  <b>{item.dia}</b>
                  <span>{item.hora}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-card">
            <h3>Consulta antes de venir</h3>
            <p>
              Envía tu consulta, receta o foto del producto. Confirmamos disponibilidad, precio
              y alternativas antes de tu visita.
            </p>
            <a
              className="btn btn-blue"
              href={`https://wa.me/${farmacia.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribir ahora
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
