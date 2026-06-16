import type { Product } from "@/types/product";

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

export function getProductSlug(product: Pick<Product, "id" | "nombre">) {
  const base = product.nombre ? slugifyString(product.nombre) : "producto";
  const idSafe = String(product.id).replace(/[^a-zA-Z0-9-_]/g, "-");

  return `${base}-${idSafe}`;
}
