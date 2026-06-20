import { AndesHome, type HomeProduct } from "@/components/AndesHome";
import { getProducts } from "@/lib/products";
import type { Product } from "@/types/product";

function normalizeProductText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toHomeProduct(product: Product): HomeProduct {
  return {
    id: product.id,
    nombre: product.nombre,
    categoria: product.categoria,
    marca: product.marca,
    precio: product.precio,
    precioAnterior: product.precioAnterior,
    requiereReceta: product.requiereReceta,
    destacado: product.destacado,
    imagenUrl: product.imagenUrl,
    formato: product.formato,
    searchText: normalizeProductText(
      [
        product.nombre,
        product.categoria,
        product.marca,
        product.formato,
        product.precioAnterior ? "oferta" : "",
        product.destacado ? "destacado oferta" : ""
      ].join(" ")
    )
  };
}

export default async function Home() {
  const products = await getProducts();

  return <AndesHome products={products.map(toHomeProduct)} />;
}
