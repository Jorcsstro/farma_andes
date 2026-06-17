import { vademecum, type VademecumEntry } from "@/data/vademecum";
import { mapProductToAndesProduct } from "@/lib/catalog-products";
import { getMedicineProducts, normalizeText } from "@/lib/medicine-products";

export function getVademecumEntries() {
  return vademecum;
}

export function getVademecumEntryBySlug(slug: string) {
  return vademecum.find((entry) => entry.slug === slug);
}

export function searchVademecumEntries(query: string) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return vademecum;

  return vademecum.filter((entry) => {
    const searchableText = [
      entry.nombre,
      entry.principioActivo,
      entry.categoria,
      entry.categoriaTerapeutica,
      entry.descripcion,
      ...(entry.usosComunes ?? []),
      ...(entry.advertencias ?? []),
      ...(entry.consultaFarmaceutica ?? []),
      ...(entry.contraindicacionesGenerales ?? []),
      ...(entry.interaccionesGenerales ?? []),
      entry.embarazoLactancia,
      entry.adultoMayor,
      entry.ninos
    ]
      .filter(Boolean)
      .join(" ");

    return normalizeText(searchableText).includes(normalizedQuery);
  });
}

export async function getRelatedMedicineProductsForEntry(entry: VademecumEntry) {
  const products = await getMedicineProducts();

  const terms = [
    entry.nombre,
    entry.principioActivo,
    ...entry.productosRelacionados
  ]
    .filter(Boolean)
    .map((term) => normalizeText(String(term)))
    .filter(Boolean);

  if (terms.length === 0) return [];

  const relatedProducts = products.filter((product) => {
    const searchableText = normalizeText(
      [
        product.id,
        product.nombre,
        product.categoria,
        product.marca,
        product.descripcionCorta,
        product.formato
      ]
        .filter(Boolean)
        .join(" ")
    );

    return terms.some((term) => searchableText.includes(term));
  });

  return relatedProducts.map(mapProductToAndesProduct).slice(0, 12);
}
