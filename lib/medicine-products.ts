import { getProducts } from "@/lib/products";
import type { Product } from "@/types/product";

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function isMedicineProduct(product: Product) {
  const category = normalizeText(product.categoria || "");
  return category === "medicamentos" || category === "medicamento";
}

export async function getMedicineProducts() {
  const products = await getProducts();
  return products.filter(isMedicineProduct);
}
