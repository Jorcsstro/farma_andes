import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULT_INPUT = "data/products.ts";
const DEFAULT_OUTPUT = "exports/woocommerce-products.csv";
const DEFAULT_REPORT_OUTPUT = "exports/woocommerce-image-report.csv";
const DEFAULT_META_PREFIX = "_farmacia_andes_";
const LOCAL_RASTER_EXTENSIONS = /\.(avif|jpe?g|png|webp)(\?.*)?$/i;
const LOCAL_PRODUCT_IMAGE_ROOT = "public/products";
const COMMON_IMAGE_OVERRIDES_BY_ID = {
  "prod-202": "/products/showcase/medicamentos/abrilar-jarabe-100ml.jpg",
  "prod-83": "/products/showcase/ensure-frutilla-850g.jpg",
  "prod-8922": "/products/showcase/medicamentos/aceite-ricino-puro-valma-20g.jpg",
  "prod-13055": "/products/showcase/medicamentos/ab-antisep-buc-12comp.jpg",
  "prod-13056": "/products/showcase/medicamentos/ab-antitusivo-12comp.jpg",
  "prod-16654": "/products/showcase/glucerna-vainilla-850g.jpg",
  "prod-16790": "/products/showcase/altazinc-gotas-zinc-30ml.jpg",
  "prod-23597": "/products/showcase/medicamentos/acido-valproico-200mg-30comp.jpg",
  "prod-25591": "/products/showcase/pediasure-chocolate-850g.jpg",
  "prod-25607": "/products/showcase/pediasure-vainilla-850g.jpg",
  "prod-28544": "/products/showcase/medicamentos/acido-valproico-500mg-30comp.jpg",
  "prod-29828": "/products/showcase/medicamentos/acemuk-polvo-jarabe-100ml.jpg",
  "prod-31274": "/products/showcase/medicamentos/aciclovir-200mg-24comp-mintlab.jpg",
  "prod-46155": "/products/showcase/medicamentos/acido-acetilsalicilico-100mg-100comp.jpg",
  "prod-49239": "/products/showcase/whey-chocolate-907g.jpg",
  "prod-49455": "/products/showcase/wild-protein-chocolate-bitter-45g.jpg",
  "prod-49698": "/products/showcase/magnesio-vitaday-400mg.jpg",
  "prod-49699": "/products/showcase/magnesio-vitaday-400mg.jpg",
  "prod-49971": "/products/showcase/dha-kids-omega-3-90-capsulas.jpg",
  "prod-50072": "/products/showcase/magnesio-citrato-400mg.jpg",
  "prod-50075": "/products/showcase/magnesio-citrato-400mg.jpg",
  "prod-50100": "/products/showcase/wild-protein-chocolate-bitter-45g.jpg",
  "prod-50122": "/products/showcase/magnesio-vitaday-400mg.jpg"
};

function parseArgs(argv) {
  const options = {
    input: DEFAULT_INPUT,
    output: DEFAULT_OUTPUT,
    assetBaseUrl: process.env.PUBLIC_ASSET_BASE_URL || "",
    includePlaceholderImages: false,
    limit: 0,
    metaPrefix: DEFAULT_META_PREFIX,
    reportOutput: DEFAULT_REPORT_OUTPUT
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--input" && next) {
      options.input = next;
      index += 1;
    } else if (arg === "--output" && next) {
      options.output = next;
      index += 1;
    } else if (arg === "--asset-base-url" && next) {
      options.assetBaseUrl = next;
      index += 1;
    } else if (arg === "--meta-prefix" && next) {
      options.metaPrefix = next;
      index += 1;
    } else if (arg === "--limit" && next) {
      options.limit = Number.parseInt(next, 10) || 0;
      index += 1;
    } else if (arg === "--report-output" && next) {
      options.reportOutput = next;
      index += 1;
    } else if (arg === "--include-placeholder-images") {
      options.includePlaceholderImages = true;
    } else if (arg === "--help") {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Exporta el catalogo de Farmacia Andes a CSV para el importador nativo de WooCommerce.

Uso:
  npm run export:woocommerce

Opciones:
  --input <archivo>             Fuente del catalogo. Default: ${DEFAULT_INPUT}
  --output <archivo>            CSV de salida. Default: ${DEFAULT_OUTPUT}
  --asset-base-url <url>        Base publica para imagenes locales, ej: https://farmaciaandes.cl
  --meta-prefix <prefijo>       Prefijo de post meta sanitario. Default: ${DEFAULT_META_PREFIX}
  --limit <numero>              Exporta solo los primeros N productos para prueba.
  --report-output <archivo>     Reporte de cobertura de imagenes. Default: ${DEFAULT_REPORT_OUTPUT}
  --include-placeholder-images  Incluye placeholders SVG locales si tienen URL publica.
`);
}

function readProducts(inputPath) {
  const source = fs.readFileSync(inputPath, "utf8");
  const match = source.match(/export const products:\s*Product\[]\s*=\s*(\[[\s\S]*?\]);/);

  if (!match) {
    throw new Error(`No pude encontrar "export const products: Product[] = [...]" en ${inputPath}`);
  }

  return JSON.parse(match[1]);
}

function readImageOverrides() {
  const overridePath = path.resolve("data/medicine-image-overrides.json");

  if (!fs.existsSync(overridePath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(overridePath, "utf8"));
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return walkFiles(entryPath);
    }

    return entry.isFile() ? [entryPath] : [];
  });
}

function toPublicPath(filePath) {
  return `/${path.relative("public", filePath).replaceAll(path.sep, "/")}`;
}

function scanLocalProductImages() {
  const productImageRoot = path.resolve(LOCAL_PRODUCT_IMAGE_ROOT);
  const imagesByProductId = {};

  for (const filePath of walkFiles(productImageRoot)) {
    if (!LOCAL_RASTER_EXTENSIONS.test(filePath)) {
      continue;
    }

    const filename = path.basename(filePath).toLowerCase();
    const idMatch = filename.match(/^(prod-\d+)(?:-|\.|_)/);

    if (!idMatch) {
      continue;
    }

    const productId = idMatch[1];

    if (!imagesByProductId[productId]) {
      imagesByProductId[productId] = toPublicPath(filePath);
    }
  }

  return imagesByProductId;
}

function clean(value) {
  return String(value ?? "").trim();
}

function csvEscape(value) {
  const text = clean(value);

  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function toCsv(rows) {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\n") + "\n";
}

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

function normalizeImageUrl(imageUrl, { assetBaseUrl, includePlaceholderImages }) {
  const value = clean(imageUrl);

  if (!value) {
    return "";
  }

  if (/^https:\/\//i.test(value)) {
    return value;
  }

  if (!value.startsWith("/") || !assetBaseUrl) {
    return "";
  }

  if (!includePlaceholderImages && !LOCAL_RASTER_EXTENSIONS.test(value)) {
    return "";
  }

  return `${stripTrailingSlash(assetBaseUrl)}${value}`;
}

function getCondition(product) {
  return product.requiereReceta ? "Venta con receta médica" : "Venta libre";
}

function getTags(product) {
  return [
    product.marca,
    product.requiereReceta ? "Requiere receta" : "Venta libre",
    product.destacado ? "Destacado" : ""
  ]
    .map(clean)
    .filter(Boolean)
    .join(", ");
}

function getDescription(product) {
  return [
    `<p>${clean(product.descripcionCorta)}</p>`,
    "<p>Disponibilidad y precio sujetos a confirmación de stock en farmacia.</p>"
  ]
    .map(clean)
    .filter(Boolean)
    .join("");
}

function resolveLocalProductImage(product, imageSources) {
  return (
    imageSources.localImagesById[product.id] ||
    imageSources.generatedOverrides[product.id] ||
    COMMON_IMAGE_OVERRIDES_BY_ID[product.id] ||
    product.imagenUrl ||
    ""
  );
}

function productToWooRow(product, imageSources, options) {
  const localImagePath = resolveLocalProductImage(product, imageSources);
  const imageUrl = normalizeImageUrl(localImagePath, options);
  const regularPrice = Number(product.precio) > 0 ? String(product.precio) : "";
  const metaPrefix = options.metaPrefix;

  return {
    Type: "simple",
    SKU: product.id,
    Name: product.nombre,
    Published: "1",
    "Is featured?": product.destacado ? "1" : "0",
    "Visibility in catalog": "visible",
    "Short description": product.descripcionCorta,
    Description: getDescription(product),
    "Regular price": regularPrice,
    "Sale price": "",
    "Tax status": "taxable",
    "In stock?": "1",
    Stock: "",
    "Backorders allowed?": "0",
    "Sold individually?": "0",
    Categories: product.categoria,
    Tags: getTags(product),
    Images: imageUrl,
    [`Meta: ${metaPrefix}registro_isp`]: "",
    [`Meta: ${metaPrefix}principio_activo`]: "",
    [`Meta: ${metaPrefix}condicion_venta`]: getCondition(product),
    [`Meta: ${metaPrefix}requiere_receta`]: product.requiereReceta ? "yes" : "no",
    "Attribute 1 name": "Marca",
    "Attribute 1 value(s)": product.marca,
    "Attribute 1 visible": "1",
    "Attribute 1 global": "0",
    "Attribute 2 name": "Formato",
    "Attribute 2 value(s)": product.formato,
    "Attribute 2 visible": "1",
    "Attribute 2 global": "0"
  };
}

function getImageSourceLabel(product, imageSources) {
  if (imageSources.localImagesById[product.id]) return "archivo_local_por_sku";
  if (imageSources.generatedOverrides[product.id]) return "override_json";
  if (COMMON_IMAGE_OVERRIDES_BY_ID[product.id]) return "override_comun";
  if (LOCAL_RASTER_EXTENSIONS.test(clean(product.imagenUrl))) return "imagen_producto";
  if (clean(product.imagenUrl)) return "placeholder_o_no_importable";
  return "sin_imagen";
}

function writeImageReport(products, imageSources, options) {
  const rows = [
    ["SKU", "Nombre", "Categoria", "Imagen local", "URL para WooCommerce", "Fuente"]
  ];

  for (const product of products) {
    const localImagePath = resolveLocalProductImage(product, imageSources);
    rows.push([
      product.id,
      product.nombre,
      product.categoria,
      localImagePath,
      normalizeImageUrl(localImagePath, options),
      getImageSourceLabel(product, imageSources)
    ]);
  }

  const reportPath = path.resolve(options.reportOutput);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, toCsv(rows), "utf8");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(options.input);
  const outputPath = path.resolve(options.output);
  const products = readProducts(inputPath);
  const imageSources = {
    generatedOverrides: readImageOverrides(),
    localImagesById: scanLocalProductImages()
  };
  const selectedProducts = options.limit > 0 ? products.slice(0, options.limit) : products;
  const records = selectedProducts.map((product) => productToWooRow(product, imageSources, options));
  const headers = Object.keys(records[0] ?? productToWooRow({}, imageSources, options));
  const rows = [headers, ...records.map((record) => headers.map((header) => record[header]))];

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, toCsv(rows), "utf8");
  writeImageReport(selectedProducts, imageSources, options);

  const imageCount = records.filter((record) => record.Images).length;
  const localMatchCount = selectedProducts.filter((product) => {
    const localImagePath = resolveLocalProductImage(product, imageSources);
    return LOCAL_RASTER_EXTENSIONS.test(localImagePath);
  }).length;
  console.log(`CSV generado: ${options.output}`);
  console.log(`Reporte de imagenes: ${options.reportOutput}`);
  console.log(`Productos exportados: ${records.length}`);
  console.log(`Productos con imagen real encontrada: ${localMatchCount}`);
  console.log(`Productos con imagen publica: ${imageCount}`);

  if (!options.assetBaseUrl) {
    console.log("Nota: no se incluyeron imagenes locales porque falta --asset-base-url o PUBLIC_ASSET_BASE_URL.");
  }
}

main();
