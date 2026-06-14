import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const PRODUCTS_FILE = "data/products.ts";
const IMAGE_REPORT_FILE = "exports/woocommerce-image-report-with-urls.csv";
const OUTPUT_JSON = "data/medicine-image-overrides.json";
const OUTPUT_DIR = "public/products/importadas";
const OUTPUT_REPORT = "exports/product-image-download-report.csv";
const MAX_CONCURRENCY = Number(process.env.IMAGE_DOWNLOAD_CONCURRENCY || 3);
const LIMIT = Number(getArg("--limit") || 0);

const blockedLinks = [
  "ahumada-contigo",
  "ahumada-contactanos",
  "bases-legales",
  "club-bebe",
  "convenios",
  "exchange-and-returns",
  "privacy",
  "proveedores",
  "terms",
  "use-of-cookies"
];

const stopWords = new Set([
  "ace",
  "bioequivalente",
  "blandas",
  "caja",
  "cap",
  "caps",
  "capsula",
  "capsulas",
  "cc",
  "cl",
  "comp",
  "comprimido",
  "comprimidos",
  "cont",
  "dermica",
  "dispositivo",
  "envase",
  "fco",
  "frasco",
  "generico",
  "gotas",
  "gr",
  "gramos",
  "jarabe",
  "masticable",
  "masticables",
  "mg",
  "ml",
  "oral",
  "pomo",
  "polvo",
  "recubierto",
  "recubiertos",
  "solucion",
  "suspension",
  "unidad",
  "unidades",
  "uso",
  "veterinario",
  "x"
]);

const genericBrands = new Set(["generico", "generica", "sin", "s/m", "varios"]);
const flavorWords = ["chocolate", "frutilla", "vainilla", "naranja", "limon", "menta", "berries"];
const badImageWords = ["noimage", "placeholder", "logo", "favicon", "default"];

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function normalize(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/[^a-z0-9,./%+-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getProducts(source) {
  const match = source.match(/export const products: Product\[] = (\[[\s\S]*?\]);/);

  if (!match) {
    throw new Error("No se pudo leer data/products.ts");
  }

  return JSON.parse(match[1]);
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function getMissingSkus(reportSource) {
  const lines = reportSource.trim().split(/\r?\n/);
  const header = parseCsvLine(lines[0]);
  const skuIndex = header.indexOf("SKU");
  const urlIndex = header.indexOf("URL para WooCommerce");
  const sourceIndex = header.indexOf("Fuente");
  const missing = new Set();

  for (const line of lines.slice(1)) {
    const row = parseCsvLine(line);
    const source = row[sourceIndex] || "";

    if (row[skuIndex] && !row[urlIndex] && source.includes("placeholder")) {
      missing.add(row[skuIndex]);
    }
  }

  return missing;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function slugify(value) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 76);
}

function numbersFrom(value) {
  return [...normalize(value).matchAll(/\d+(?:[,.]\d+)?/g)]
    .map((match) => match[0].replace(",", "."))
    .filter((item) => item !== "1");
}

function tokensFrom(value) {
  return normalize(value)
    .split(" ")
    .map((token) => token.replace(/^[0-9.]+$/, ""))
    .filter((token) => token.length >= 4 && !stopWords.has(token));
}

function productCoreName(product) {
  return product.nombre
    .split("(")[0]
    .replace(/^veterinario\s+/i, "")
    .replace(/\bbioequivalente\b/gi, "")
    .replace(/\bl chile\b/gi, "chile")
    .trim();
}

function queryVariants(product) {
  const core = productCoreName(product);
  const tokenQuery = unique(tokensFrom(core)).slice(0, 5).join(" ");
  const numberQuery = unique(numbersFrom(`${core} ${product.formato}`)).slice(0, 3).join(" ");
  const brand = product.marca && !genericBrands.has(normalize(product.marca)) ? product.marca : "";

  return unique([
    `${core} ${brand}`.trim(),
    core,
    `${tokenQuery} ${numberQuery} ${brand}`.trim(),
    `${tokenQuery} ${numberQuery}`.trim()
  ]).slice(0, 3);
}

function hasFlavorConflict(sourceText, candidateText) {
  const sourceFlavors = flavorWords.filter((flavor) => sourceText.includes(flavor));
  const candidateFlavors = flavorWords.filter((flavor) => candidateText.includes(flavor));

  if (!sourceFlavors.length) {
    return candidateFlavors.length > 0 && !candidateFlavors.some((flavor) => sourceText.includes(flavor));
  }

  return !sourceFlavors.every((flavor) => candidateText.includes(flavor));
}

function imageLooksUsable(imageUrl) {
  const text = normalize(decodeURIComponent(imageUrl));
  return /^https?:\/\//i.test(imageUrl) && !badImageWords.some((word) => text.includes(word));
}

function scoreCandidate(product, candidate) {
  const core = productCoreName(product);
  const sourceText = normalize(`${product.nombre} ${product.marca} ${product.formato}`);
  const candidateText = normalize(
    `${candidate.title} ${candidate.brand || ""} ${candidate.link || ""} ${candidate.imageUrl || ""}`
  );
  const productTokens = unique(tokensFrom(core));
  const brandTokens = unique(tokensFrom(product.marca || ""));
  const requiredNumbers = unique(numbersFrom(`${core} ${product.formato}`));

  if (!candidate.imageUrl || !imageLooksUsable(candidate.imageUrl)) {
    return 0;
  }

  if (hasFlavorConflict(sourceText, candidateText)) {
    return 0;
  }

  if (requiredNumbers.length && !requiredNumbers.every((number) => candidateText.includes(number))) {
    return 0;
  }

  const matchedTokens = productTokens.filter((token) => candidateText.includes(token));
  const requiredTokenCount = Math.min(productTokens.length, productTokens.length <= 2 ? 1 : 2);

  if (matchedTokens.length < requiredTokenCount) {
    return 0;
  }

  const meaningfulBrandTokens = brandTokens.filter((token) => !genericBrands.has(token));
  const matchedBrandTokens = meaningfulBrandTokens.filter((token) => candidateText.includes(token));
  const brandIsImportant =
    meaningfulBrandTokens.length > 0 &&
    (product.categoria !== "Medicamentos" || normalize(product.nombre).includes(meaningfulBrandTokens[0]));

  if (brandIsImportant && !matchedBrandTokens.length) {
    return 0;
  }

  return matchedTokens.length * 10 + matchedBrandTokens.length * 8 + requiredNumbers.length * 3;
}

async function fetchText(url, timeout = 16000) {
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/json",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"
    },
    signal: AbortSignal.timeout(timeout)
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }

  return response.text();
}

async function fetchJson(url, timeout = 16000) {
  const text = await fetchText(url, timeout);
  return JSON.parse(text);
}

async function downloadFile(url, filePath) {
  const response = await fetch(url, {
    headers: {
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"
    },
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const buffer = Buffer.from(await response.arrayBuffer());

  if (!contentType.startsWith("image/") || buffer.byteLength < 1500) {
    throw new Error(`Imagen no valida: ${contentType || "sin content-type"} ${buffer.byteLength} bytes`);
  }

  await writeFile(filePath, buffer);
}

function extractAhumadaLinks(html) {
  return unique(
    [...html.matchAll(/https:\/\/www\.farmaciasahumada\.cl\/[^"']+\.html/g)]
      .map((match) => match[0])
      .filter((link) => !blockedLinks.some((blocked) => link.includes(blocked)))
  );
}

function extractTitle(html) {
  const title =
    html.match(/<meta property="og:title" content="([^"]+)"/i)?.[1] ||
    html.match(/<title>([^<]+)<\/title>/i)?.[1] ||
    "";

  return title.replace(/&amp;/g, "&");
}

function extractAhumadaImage(html) {
  const images = unique(
    [...html.matchAll(/https?:\/\/[^"']+\/images\/products\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*/gi)]
      .map((match) => match[0].replace(/&amp;/g, "&"))
      .filter((image) => image.includes("/dw/image/v2/") || image.includes("/on/demandware.static/"))
  );

  return images[0];
}

async function searchAhumada(product) {
  const candidates = [];

  for (const query of queryVariants(product)) {
    const searchHtml = await fetchText(`https://www.farmaciasahumada.cl/search?q=${encodeURIComponent(query)}`);
    const links = extractAhumadaLinks(searchHtml).slice(0, 5);

    for (const link of links) {
      const pageHtml = await fetchText(link);
      const title = extractTitle(pageHtml);
      const imageUrl = extractAhumadaImage(pageHtml);
      candidates.push({ source: "Farmacias Ahumada", title, imageUrl, link });
    }

    if (candidates.length) {
      break;
    }
  }

  return candidates;
}

async function searchDrSimi(product) {
  const candidates = [];

  for (const query of queryVariants(product)) {
    const url = `https://www.drsimi.cl/api/catalog_system/pub/products/search/${encodeURIComponent(query)}?_from=0&_to=7`;
    const items = await fetchJson(url);

    for (const item of Array.isArray(items) ? items : []) {
      const imageUrl = item.items?.[0]?.images?.[0]?.imageUrl;
      candidates.push({
        source: "Dr. Simi",
        title: item.productName || item.productTitle || "",
        brand: item.brand || "",
        imageUrl,
        link: item.link || ""
      });
    }

    if (candidates.length) {
      break;
    }
  }

  return candidates;
}

async function findImage(product) {
  const providers = [searchDrSimi, searchAhumada];
  const candidates = [];

  for (const provider of providers) {
    try {
      candidates.push(...(await provider(product)));
    } catch (error) {
      candidates.push({
        source: provider.name.replace(/^search/, ""),
        title: "",
        imageUrl: "",
        link: "",
        error: error.message
      });
    }
  }

  const scored = candidates
    .map((candidate) => ({ ...candidate, score: scoreCandidate(product, candidate) }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0] || null;
}

function getExtension(imageUrl) {
  const extension = imageUrl.match(/\.(jpe?g|png|webp)(?:[?#]|$)/i)?.[1]?.toLowerCase() || "jpg";
  return extension === "jpeg" ? "jpg" : extension;
}

async function runWorker(queue, overrides, rows, report) {
  while (queue.length) {
    const product = queue.shift();

    try {
      const match = await findImage(product);

      if (!match) {
        report.missed += 1;
        rows.push([product.id, product.nombre, product.categoria, "", "", "", "", "sin coincidencia segura"]);
        console.log(`MISS ${product.id} ${product.nombre}`);
        continue;
      }

      const extension = getExtension(match.imageUrl);
      const fileName = `${product.id}-${slugify(product.nombre)}-${slugify(match.source)}.${extension}`;
      const localPath = `/products/importadas/${fileName}`;

      await downloadFile(match.imageUrl, path.join(OUTPUT_DIR, fileName));

      overrides[product.id] = localPath;
      report.saved += 1;
      rows.push([
        product.id,
        product.nombre,
        product.categoria,
        match.source,
        localPath,
        match.imageUrl,
        match.title,
        "descargada"
      ]);
      console.log(`SAVE ${product.id} ${match.source} ${fileName}`);
    } catch (error) {
      report.errors += 1;
      rows.push([product.id, product.nombre, product.categoria, "", "", "", "", `error: ${error.message}`]);
      console.log(`ERR ${product.id} ${error.message}`);
    }
  }
}

const [productSource, reportSource, existingOverrideSource] = await Promise.all([
  readFile(PRODUCTS_FILE, "utf8"),
  readFile(IMAGE_REPORT_FILE, "utf8"),
  readFile(OUTPUT_JSON, "utf8")
]);

const products = getProducts(productSource);
const missingSkus = getMissingSkus(reportSource);
const existingOverrides = JSON.parse(existingOverrideSource);
const queue = products.filter((product) => missingSkus.has(product.id) && !existingOverrides[product.id]);
const selectedQueue = LIMIT > 0 ? queue.slice(0, LIMIT) : queue;
const selectedCount = selectedQueue.length;
const overrides = { ...existingOverrides };
const rows = [["SKU", "Nombre", "Categoria", "Fuente", "Imagen local", "URL fuente", "Producto fuente", "Estado"]];
const report = { errors: 0, missed: 0, saved: 0 };

await mkdir(OUTPUT_DIR, { recursive: true });
await mkdir(path.dirname(OUTPUT_REPORT), { recursive: true });

await Promise.all(
  Array.from({ length: Math.min(MAX_CONCURRENCY, selectedQueue.length) }, () =>
    runWorker(selectedQueue, overrides, rows, report)
  )
);

await writeFile(OUTPUT_JSON, `${JSON.stringify(overrides, null, 2)}\n`);
await writeFile(OUTPUT_REPORT, `${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`);

console.log(
  JSON.stringify(
    {
      ...report,
      productosSinImagenAntes: missingSkus.size,
      revisadosEnEstaCorrida: selectedCount,
      totalOverrides: Object.keys(overrides).length,
      reporte: OUTPUT_REPORT
    },
    null,
    2
  )
);
