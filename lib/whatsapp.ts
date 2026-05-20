import { farmacia } from "@/data/site";
import type { Product } from "@/types/product";

export function buildProductWhatsappUrl(product: Product) {
  const message = [
    `Hola ${farmacia.nombre}, quiero consultar por este producto:`,
    `${product.nombre} - ${product.formato}`,
    `Marca: ${product.marca}`,
    `Categoría: ${product.categoria}`
  ].join("\n");

  return `https://wa.me/${farmacia.whatsapp}?text=${encodeURIComponent(message)}`;
}
