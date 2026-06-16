import { products as fallbackProducts } from "@/data/products";
import { unstable_cache } from "next/cache";
import { getSafeImageUrl } from "@/lib/safe-image";
import { isBioequivalentProduct } from "@/lib/product-flags";
import type { Product } from "@/types/product";

type ProductRow = Record<string, unknown>;

const PRODUCTS_TABLE = process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_TABLE || "products";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const PRODUCTS_REVALIDATE_SECONDS = 300;

function getValue(row: ProductRow, keys: string[]) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) {
      return row[key];
    }
  }

  return undefined;
}

function asString(row: ProductRow, keys: string[], fallback = "") {
  const value = getValue(row, keys);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asNumber(row: ProductRow, keys: string[], fallback = 0) {
  const value = getValue(row, keys);

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function asBoolean(row: ProductRow, keys: string[], fallback = false) {
  const value = getValue(row, keys);

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    return ["1", "true", "si", "sí", "yes"].includes(value.trim().toLowerCase());
  }

  return fallback;
}

function mapProduct(row: ProductRow): Product | null {
  const id = asString(row, ["id", "product_id"]);
  const nombre = asString(row, ["nombre", "name", "descripcion", "description"]);

  if (!id || !nombre) {
    return null;
  }

  const categoria = asString(row, ["categoria", "category"], "Medicamentos");
  const rawBio = getValue(row, ["bioequivalente", "bio_equivalente", "bio_equivalent"]);
  const bioequivalente =
    rawBio !== undefined && rawBio !== null
      ? asBoolean(row, ["bioequivalente", "bio_equivalente", "bio_equivalent"])
      : isBioequivalentProduct(nombre);

  return {
    id,
    nombre,
    categoria,
    marca: asString(row, ["marca", "brand", "linea", "línea"], "Farmacia Andes"),
    descripcionCorta: asString(
      row,
      ["descripcionCorta", "descripcion_corta", "short_description"],
      "Producto disponible en Farmacia Andes. Confirma disponibilidad por WhatsApp."
    ),
    precio: asNumber(row, ["precio", "price"], 0),
    precioAnterior: asNumber(row, ["precioAnterior", "precio_anterior", "previous_price"], 0) || undefined,
    requiereReceta: asBoolean(row, ["requiereReceta", "requiere_receta", "requires_prescription"]),
    destacado: asBoolean(row, ["destacado", "featured"]),
    imagenUrl: getSafeImageUrl(asString(row, ["imagenUrl", "imagen_url", "image_url"], "/products/receta.svg")),
    formato: asString(row, ["formato", "format"], "Formato a consultar")
    ,
    bioequivalente
  };
}

async function fetchRemoteProducts(): Promise<Product[]> {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  const { data, error } = await supabase.from(PRODUCTS_TABLE).select("*").limit(1000);

  if (error || !data?.length) {
    console.warn("Using local product catalog fallback", error?.message ?? "No remote products found");
    return [];
  }

  const remoteProducts = data.map((row) => mapProduct(row)).filter((product): product is Product => product !== null);

  return remoteProducts;
}

const getCachedRemoteProducts = unstable_cache(fetchRemoteProducts, ["farmacia-andes-products", PRODUCTS_TABLE], {
  revalidate: PRODUCTS_REVALIDATE_SECONDS,
  tags: ["farmacia-andes-products"]
});

export async function getProducts(): Promise<Product[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return fallbackProducts;
  }

  try {
    const remoteProducts = await getCachedRemoteProducts();
    return remoteProducts.length ? remoteProducts : fallbackProducts;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown product loading error";
    console.warn("Using local product catalog fallback", message);
    return fallbackProducts;
  }
}
