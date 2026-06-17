import { vademecum, type VademecumEntry, type VademecumRevision } from "@/data/vademecum";
import { mapProductToAndesProduct } from "@/lib/catalog-products";
import { getMedicineProducts, normalizeText } from "@/lib/medicine-products";
import { getProductSlug } from "@/lib/product-slug";
import type { Product } from "@/types/product";

const generatedRevision: VademecumRevision = {
  revisadoPor: "Catalogo Farmacia Andes",
  fechaRevision: "2026-06-17",
  fuente: "Ficha generada desde productos de categoria Medicamentos"
};

function uniqueBySlug(entries: VademecumEntry[]) {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    if (seen.has(entry.slug)) return false;
    seen.add(entry.slug);
    return true;
  });
}

function buildMedicineEntry(product: Product): VademecumEntry {
  const requiereReceta = Boolean(product.requiereReceta);
  const slug = `medicamento-${getProductSlug(product)}`;
  const descripcionBase = product.descripcionCorta?.trim()
    ? product.descripcionCorta.trim()
    : "Medicamento disponible en el catalogo de Farmacia Andes. Confirma stock, condicion de venta y uso adecuado con el equipo farmaceutico.";

  return {
    id: `catalogo-${product.id}`,
    slug,
    nombre: product.nombre,
    principioActivo: product.nombre,
    categoria: "Medicamento del catalogo",
    categoriaTerapeutica: "Medicamentos disponibles",
    descripcion: descripcionBase,
    usosComunes: [
      "Consulta de disponibilidad en farmacia",
      "Orientacion sobre condicion de venta, formato y uso responsable"
    ],
    formasFarmaceuticas: product.formato ? [product.formato] : undefined,
    condicionesVenta: [requiereReceta ? "Requiere receta o validacion profesional" : "Venta directa o segun presentacion"],
    advertencias: requiereReceta
      ? [
          "Este medicamento requiere receta o validacion profesional.",
          "No usar sin indicacion de un profesional de salud.",
          "Confirma dosis, duracion y compatibilidad con otros tratamientos antes de utilizarlo."
        ]
      : [
          "No automedicarse si existen enfermedades de base, embarazo, lactancia o uso de otros medicamentos.",
          "Respeta la informacion del envase y consulta si los sintomas persisten.",
          "Confirma con el quimico farmaceutico si tienes dudas sobre su uso."
        ],
    contraindicacionesGenerales: [
      "Alergia conocida al medicamento, principio activo o componentes de la formula.",
      "Antecedentes de reacciones adversas importantes sin evaluacion profesional."
    ],
    interaccionesGenerales: [
      "Consulta antes de combinar con otros medicamentos, suplementos o tratamientos cronicos.",
      "Informa al equipo farmaceutico si usas anticoagulantes, antihipertensivos, antidiabeticos, antidepresivos u otros tratamientos permanentes."
    ],
    embarazoLactancia: "Consultar con profesional de salud antes de usar durante embarazo o lactancia.",
    adultoMayor: "Revisar uso en adulto mayor, especialmente si existe polifarmacia o enfermedades cronicas.",
    ninos: "El uso en ninos depende de edad, peso, diagnostico y presentacion. Consultar antes de administrar.",
    consultaFarmaceutica: [
      "Si necesitas confirmar stock o precio.",
      "Si no sabes si requiere receta.",
      "Si tienes enfermedades de base, embarazo, lactancia o tomas otros medicamentos."
    ],
    cuandoConsultar: [
      "Dudas sobre dosis o formato",
      "Uso junto con otros medicamentos",
      "Sintomas persistentes o intensos",
      "Reacciones adversas o alergias"
    ],
    productosRelacionados: [product.id, product.nombre, product.marca, product.formato].filter(Boolean),
    fuenteRevision: generatedRevision,
    tipo: "medicamento-catalogo",
    productoCatalogoId: product.id
  };
}

async function getGeneratedMedicineEntries() {
  const medicineProducts = await getMedicineProducts();
  return medicineProducts.map(buildMedicineEntry);
}

export async function getVademecumEntries() {
  const generatedEntries = await getGeneratedMedicineEntries();
  return uniqueBySlug([...vademecum, ...generatedEntries]);
}

export async function getVademecumEntryBySlug(slug: string) {
  const entries = await getVademecumEntries();
  return entries.find((entry) => entry.slug === slug);
}

export async function searchVademecumEntries(query: string) {
  const entries = await getVademecumEntries();
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return entries;

  return entries.filter((entry) => {
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

  if (entry.productoCatalogoId) {
    return products
      .filter((product) => product.id === entry.productoCatalogoId)
      .map(mapProductToAndesProduct);
  }

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