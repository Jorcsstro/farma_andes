import { readFile, writeFile } from "node:fs/promises";

const overridesPath = "data/medicine-image-overrides.json";

const commonMedicineImages = {
  "prod-1726": "/products/medicamentos/kitadol-500mg-24comp.jpg",
  "prod-1730": "/products/medicamentos/kitadol-gotas-100mg-15ml.jpg",
  "prod-30895": "/products/medicamentos/paracetamol-chile-500mg-16comp.jpg",
  "prod-32852": "/products/medicamentos/paracetamol-andromaco-500mg-16comp.jpg",
  "prod-9694": "/products/medicamentos/paracetamol-valma-gotas-15ml.jpg",
  "prod-31685": "/products/medicamentos/paracetamol-mintlab-80mg-20comp.jpg",
  "prod-28186": "/products/medicamentos/xumadol-1g-20comp.jpg",
  "prod-49576": "/products/medicamentos/tapsin-infantil-160mg-16comp.jpg",
  "prod-50180": "/products/medicamentos/panadol-extra-advance-500-65mg-12comp.jpg",
  "prod-17296": "/products/medicamentos/panadol-advance-500mg-12comp.jpg",
  "prod-30730": "/products/medicamentos/algiafin-paracetamol-120mg-5ml-60ml.jpg",
  "prod-49997": "/products/medicamentos/alividol-opko-1000mg-20comp.webp",
  "prod-31115": "/products/medicamentos/geniol-flu-jarabe-100ml-mintlab.jpg",
  "prod-13821": "/products/medicamentos/geniol-flu-dn-20comp-mintlab.jpg",
  "prod-31361": "/products/medicamentos/lactulosa-mintlab-65-200ml.webp",
  "prod-49247": "/products/medicamentos/lactulosa-chile-667-200ml.webp",
  "prod-40197": "/products/medicamentos/ibuprofeno-ascend-200mg-20comp.jpg",
  "prod-31332": "/products/medicamentos/ibuprofeno-opko-200mg-100ml.jpg",
  "prod-49172": "/products/medicamentos/ibucalm-600mg-10caps.jpg",
  "prod-49232": "/products/medicamentos/omeprazol-curaespring-20mg-30caps.webp",
  "prod-32303": "/products/medicamentos/levocetirizina-seven-5mg-30comp.jpg",
  "prod-31357": "/products/medicamentos/salbutamol-mintlab-100mcg-200dosis.jpg",
  "prod-30922": "/products/medicamentos/losartan-lchile-50mg-30comp.jpg",
  "prod-36250": "/products/medicamentos/metformina-andromaco-850mg-30comp.jpg",
  "prod-30751": "/products/medicamentos/metformina-opko-850mg-30comp.webp",
  "prod-39314": "/products/medicamentos/metformina-lchile-850mg-60comp.jpg",
  "prod-31438": "/products/medicamentos/atorvastatina-lchile-20mg-30comp.jpg",
  "prod-50179": "/products/medicamentos/atorvastatina-lchile-40mg-30comp.jpg",
  "prod-30904": "/products/medicamentos/azitromicina-lchile-500mg-6comp.jpg",
  "prod-31042": "/products/medicamentos/azitromicina-mintlab-500mg-3comp.jpg",
  "prod-36490": "/products/medicamentos/fluconazol-lchile-150mg-2caps.webp",
  "prod-15417": "/products/medicamentos/fluconazol-iphsa-150mg-4caps.jpg",
  "prod-34487": "/products/medicamentos/diclofenaco-lchile-gotas-15-20ml.jpg",
  "prod-49305": "/products/medicamentos/diclofenaco-curaespring-100mg-8comp.jpeg",
  "prod-40211": "/products/medicamentos/ibupirac-lc-400mg-10caps.jpg",
  "prod-36008": "/products/medicamentos/finagrip-10comp-iphsa.webp",
  "prod-49318": "/products/medicamentos/prednisona-pasteur-20mg-20comp.webp"
};

const existingOverrides = JSON.parse((await readFile(overridesPath, "utf8")).replace(/^\uFEFF/, ""));
const nextOverrides = Object.fromEntries(
  Object.entries({ ...existingOverrides, ...commonMedicineImages }).sort(([a], [b]) => a.localeCompare(b))
);

await writeFile(overridesPath, `${JSON.stringify(nextOverrides, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      added: Object.keys(commonMedicineImages).length,
      totalOverrides: Object.keys(nextOverrides).length
    },
    null,
    2
  )
);
