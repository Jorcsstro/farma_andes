import { getProducts } from "@/lib/products";
import { getProductImageUrl } from "@/lib/product-image-overrides";
import type { Product } from "@/types/product";
import type { AndesProduct } from "@/data/productos";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function slugifyString(value: string) {
  const normalized = normalizeText(value);
  return normalized.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function slugifyProduct(product: Product) {
  const base = product.nombre ? slugifyString(product.nombre) : "producto";
  const idSafe = String(product.id).replace(/[^a-zA-Z0-9-_]/g, "-");
  return `${base}-${idSafe}`;
}

export function mapProductToAndesProduct(product: Product): AndesProduct {
  const slug = slugifyProduct(product);

  const condicionVenta = product.requiereReceta ? "Venta bajo indicación profesional" : "Venta directa";

  const advertencias = product.requiereReceta
    ? "Este producto requiere validación profesional. Consulte con el químico farmacéutico o profesional de la salud."
    : "No automedicarse. Consulte con el químico farmacéutico o profesional de la salud si tiene dudas.";

  return {
    id: product.id,
    slug,
    nombre: product.nombre,
    categoria: product.categoria,
    principioActivo: "",
    condicionVenta,
    formato: product.formato,
    contenido: product.formato || "Consultar",
    laboratorio: product.marca || "Farmacia Andes",
    precio: product.precio || undefined,
    imagen: getProductImageUrl({ id: product.id, nombre: product.nombre, imagenUrl: product.imagenUrl }),
    descripcion: product.descripcionCorta || "Producto disponible en Farmacia Andes. Confirma disponibilidad por WhatsApp.",
    indicaciones: "Consulta el uso adecuado de este producto con el químico farmacéutico o según indicación profesional.",
    advertencias,
    conservacion: "Mantener en su envase original, protegido de humedad, calor y fuera del alcance de niños.",
    relacionados: []
  };
}

export async function getCatalogProducts(): Promise<AndesProduct[]> {
  const products = await getProducts();
  return products.map(mapProductToAndesProduct);
}

export function getCatalogCategories(products: AndesProduct[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    if (p.categoria) set.add(p.categoria);
  }
  return Array.from(set.values());
}

export async function getCatalogProductBySlug(slug: string) {
  const products = await getCatalogProducts();
  return products.find((p) => p.slug === slug);
}
