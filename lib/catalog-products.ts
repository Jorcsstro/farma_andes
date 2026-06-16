import { getProducts } from "@/lib/products";
import { getProductImageUrl } from "@/lib/product-image-overrides";
import { isBioequivalentProduct } from "@/lib/product-flags";
import { getProductSlug } from "@/lib/product-slug";
import type { Product } from "@/types/product";
import type { AndesProduct } from "@/data/productos";

export { getProductSlug as slugifyProduct } from "@/lib/product-slug";

export function mapProductToAndesProduct(product: Product): AndesProduct {
  const slug = getProductSlug(product);

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
    bioequivalente: product.bioequivalente ?? isBioequivalentProduct(product.nombre),
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
