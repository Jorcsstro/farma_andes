import type { Product } from "@/types/product";
import generatedMedicineImageOverrides from "@/data/medicine-image-overrides.json";
import { getSafeImageUrl } from "@/lib/safe-image";

const generatedImageOverrides = generatedMedicineImageOverrides as Record<string, string>;

const productImageUrls = {
  abAntisep: "/products/showcase/medicamentos/ab-antisep-buc-12comp.jpg",
  abAntitusivo: "/products/showcase/medicamentos/ab-antitusivo-12comp.jpg",
  abrilar: "/products/showcase/medicamentos/abrilar-jarabe-100ml.jpg",
  acemuk: "/products/showcase/medicamentos/acemuk-polvo-jarabe-100ml.jpg",
  acetazolamida: "/products/showcase/medicamentos/acetazolamida-250mg-20comp.jpg",
  aciclovir200: "/products/showcase/medicamentos/aciclovir-200mg-24comp-mintlab.jpg",
  aciclovir400: "/products/showcase/medicamentos/aciclovir-400mg-35comp.jpg",
  aciclovirCrema: "/products/showcase/medicamentos/aciclovir-crema-5g.jpg",
  aciclovirCremaChile: "/products/showcase/medicamentos/aciclovir-crema-chile-5g.jpg",
  acidoAcetilsalicilico: "/products/showcase/medicamentos/acido-acetilsalicilico-100mg-100comp.jpg",
  acidoMefenamico: "/products/showcase/medicamentos/acido-mefenamico-500mg-10comp.jpg",
  acidoValproico200: "/products/showcase/medicamentos/acido-valproico-200mg-30comp.jpg",
  acidoValproico250: "/products/showcase/medicamentos/acido-valproico-250mg-20comp.jpg",
  acidoValproico500: "/products/showcase/medicamentos/acido-valproico-500mg-30comp.jpg",
  acifin: "/products/showcase/medicamentos/acifin-10comp-masticables.jpg",
  aartam: "/products/showcase/medicamentos/aartam-metronidazol-500mg-20comp.jpg",
  aceiteRicino: "/products/showcase/medicamentos/aceite-ricino-puro-valma-20g.jpg",
  altazinc: "/products/showcase/altazinc-gotas-zinc-30ml.jpg",
  dhaKids: "/products/showcase/dha-kids-omega-3-90-capsulas.jpg",
  ensure: "/products/showcase/ensure-vainilla-850g.jpg",
  ensureAdvance: "/products/showcase/ensure-advance-vainilla-900g.jpg",
  ensureFrutilla: "/products/showcase/ensure-frutilla-850g.jpg",
  glucerna: "/products/showcase/glucerna-vainilla-850g.jpg",
  magnesioCitrato: "/products/showcase/magnesio-citrato-400mg.jpg",
  magnesioVitaday: "/products/showcase/magnesio-vitaday-400mg.jpg",
  pediasureChocolate: "/products/showcase/pediasure-chocolate-850g.jpg",
  pediasureVainilla: "/products/showcase/pediasure-vainilla-850g.jpg",
  wheyChocolate: "/products/showcase/whey-chocolate-907g.jpg",
  wildProtein: "/products/showcase/wild-protein-chocolate-bitter-45g.jpg"
};

const imageOverridesById: Record<string, string> = {
  "prod-202": productImageUrls.abrilar,
  "prod-8922": productImageUrls.aceiteRicino,
  "prod-13055": productImageUrls.abAntisep,
  "prod-13056": productImageUrls.abAntitusivo,
  "prod-83": productImageUrls.ensureFrutilla,
  "prod-23597": productImageUrls.acidoValproico200,
  "prod-28544": productImageUrls.acidoValproico500,
  "prod-29828": productImageUrls.acemuk,
  "prod-31274": productImageUrls.aciclovir200,
  "prod-16654": productImageUrls.glucerna,
  "prod-16790": productImageUrls.altazinc,
  "prod-25591": productImageUrls.pediasureChocolate,
  "prod-25607": productImageUrls.pediasureVainilla,
  "prod-46155": productImageUrls.acidoAcetilsalicilico,
  "prod-49239": productImageUrls.wheyChocolate,
  "prod-49455": productImageUrls.wildProtein,
  "prod-49698": productImageUrls.magnesioVitaday,
  "prod-49699": productImageUrls.magnesioVitaday,
  "prod-49971": productImageUrls.dhaKids,
  "prod-50072": productImageUrls.magnesioCitrato,
  "prod-50075": productImageUrls.magnesioCitrato,
  "prod-50100": productImageUrls.wildProtein,
  "prod-50122": productImageUrls.magnesioVitaday
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getProductImageUrl(product: Pick<Product, "id" | "nombre" | "imagenUrl">) {
  const imageById = imageOverridesById[product.id];

  if (imageById) {
    return imageById;
  }

  const generatedImageById = generatedImageOverrides[product.id];

  if (generatedImageById) {
    return generatedImageById;
  }

  const name = normalizeText(product.nombre);

  if (name.includes("ab antisep")) return productImageUrls.abAntisep;
  if (name.includes("ab antitusivo")) return productImageUrls.abAntitusivo;
  if (name.includes("abrilar")) return productImageUrls.abrilar;
  if (name.includes("aceite ricino")) return productImageUrls.aceiteRicino;
  if (name.includes("acemuk")) return productImageUrls.acemuk;
  if (name.includes("aciclovir 200")) return productImageUrls.aciclovir200;
  if (name.includes("valproico 500")) return productImageUrls.acidoValproico500;
  if (name.includes("valproico 200")) return productImageUrls.acidoValproico200;
  if (name.includes("ensure") && name.includes("frutilla")) return productImageUrls.ensureFrutilla;
  if (name.includes("ensure")) return productImageUrls.ensure;
  if (name.includes("glucerna")) return productImageUrls.glucerna;
  if (name.includes("pediasure") && name.includes("chocolate")) return productImageUrls.pediasureChocolate;
  if (name.includes("pediasure")) return productImageUrls.pediasureVainilla;
  if (name.includes("wild protein")) return productImageUrls.wildProtein;
  if (name.includes("dha kids")) return productImageUrls.dhaKids;
  if (name.includes("altazinc")) return productImageUrls.altazinc;
  if (name.includes("citrato de magnesio")) return productImageUrls.magnesioCitrato;
  if (name.includes("magnesio")) return productImageUrls.magnesioVitaday;

  return getSafeImageUrl(product.imagenUrl);
}
