import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const PRODUCTS_FILE = "data/products.ts";
const OUTPUT_DIR = "public/products/medicamentos";
const OUTPUT_JSON = "data/medicine-image-overrides.json";
const MAX_CONCURRENCY = Number(process.env.IMAGE_DOWNLOAD_CONCURRENCY || 6);

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
  "bioequivalente",
  "blandas",
  "caja",
  "cap",
  "caps",
  "capsula",
  "capsulas",
  "comp",
  "comprimido",
  "comprimidos",
  "dermica",
  "fco",
  "frasco",
  "generico",
  "gotas",
  "jarabe",
  "masticable",
  "masticables",
  "oral",
  "pomo",
  "polvo",
  "para",
  "recubierto",
  "recubiertos",
  "solucion",
  "suspension",
  "x"
]);

const flavorWords = ["chocolate", "frutilla", "vainilla", "naranja", "limon", "menta"];
const genericStarters = new Set([
  "aciclovir",
  "acetazolamida",
  "acido",
  "amoxicilina",
  "atorvastatina",
  "azitromicina",
  "betametasona",
  "celecoxib",
  "cetirizina",
  "clonazepam",
  "clorfenamina",
  "diclofenaco",
  "fluconazol",
  "ibuprofeno",
  "ketoprofeno",
  "levocetirizina",
  "loratadina",
  "losartan",
  "metformina",
  "metronidazol",
  "omeprazol",
  "paracetamol",
  "prednisona",
  "sertralina"
]);

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/[^a-z0-9,./]+/g, " ")
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

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function slugify(value) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"
    },
    signal: AbortSignal.timeout(20000)
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }

  return response.text();
}

async function downloadFile(url, filePath) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"
    },
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, buffer);
}

function extractLinks(html) {
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

function extractProductImage(html) {
  const images = unique(
    [...html.matchAll(/https?:\/\/[^"']+\/images\/products\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*/gi)]
      .map((match) => match[0].replace(/&amp;/g, "&"))
      .filter((image) => image.includes("/dw/image/v2/") || image.includes("/on/demandware.static/"))
  );

  return images[0];
}

function isGenericMedication(productTokens) {
  return genericStarters.has(productTokens[0]);
}

function hasFlavorConflict(sourceText, candidateText) {
  const sourceFlavors = flavorWords.filter((flavor) => sourceText.includes(flavor));
  const candidateFlavors = flavorWords.filter((flavor) => candidateText.includes(flavor));

  if (!sourceFlavors.length) {
    return candidateFlavors.length > 0 && !candidateFlavors.some((flavor) => sourceText.includes(flavor));
  }

  return !sourceFlavors.every((flavor) => candidateText.includes(flavor));
}

function isSafeMatch(product, link, pageTitle) {
  const coreName = product.nombre.split("(")[0];
  const sourceText = normalize(`${product.nombre} ${product.marca} ${product.formato}`);
  const candidateText = normalize(`${decodeURIComponent(link)} ${pageTitle}`);
  const productTokens = unique(tokensFrom(coreName));
  const requiredNumbers = unique(numbersFrom(`${coreName} ${product.formato}`));

  if (hasFlavorConflict(sourceText, candidateText)) {
    return false;
  }

  if (!requiredNumbers.every((number) => candidateText.includes(number))) {
    return false;
  }

  const requiredTokenCount = Math.min(productTokens.length, productTokens.length <= 2 ? 1 : 2);
  const matchedTokenCount = productTokens.filter((token) => candidateText.includes(token)).length;

  if (matchedTokenCount < requiredTokenCount) {
    return false;
  }

  const brandTokens = unique(tokensFrom(product.marca));
  const shouldRequireBrand = isGenericMedication(productTokens) && brandTokens.length > 0;

  if (shouldRequireBrand && !brandTokens.some((token) => candidateText.includes(token))) {
    return false;
  }

  return true;
}

async function findImage(product) {
  const searchQuery = encodeURIComponent(`${product.nombre} ${product.marca}`);
  const searchUrl = `https://www.farmaciasahumada.cl/search?q=${searchQuery}`;
  const searchHtml = await fetchText(searchUrl);
  const links = extractLinks(searchHtml);

  for (const link of links.slice(0, 6)) {
    const pageHtml = await fetchText(link);
    const pageTitle = extractTitle(pageHtml);

    if (!isSafeMatch(product, link, pageTitle)) {
      continue;
    }

    const imageUrl = extractProductImage(pageHtml);

    if (imageUrl) {
      return { imageUrl, link, pageTitle };
    }
  }

  return null;
}

async function runWorker(queue, overrides, report) {
  while (queue.length) {
    const product = queue.shift();

    try {
      const match = await findImage(product);

      if (!match) {
        report.missed += 1;
        console.log(`MISS ${product.id} ${product.nombre}`);
        continue;
      }

      const extension = match.imageUrl.match(/\.(jpe?g|png|webp)/i)?.[1]?.toLowerCase() || "jpg";
      const fileName = `${product.id}-${slugify(product.nombre)}.${extension === "jpeg" ? "jpg" : extension}`;
      const localPath = `/products/medicamentos/${fileName}`;
      await downloadFile(match.imageUrl, path.join(OUTPUT_DIR, fileName));
      overrides[product.id] = localPath;
      report.saved += 1;
      console.log(`SAVE ${product.id} ${fileName}`);
    } catch (error) {
      report.errors += 1;
      console.log(`ERR ${product.id} ${error.message}`);
    }
  }
}

const source = await readFile(PRODUCTS_FILE, "utf8");
const products = getProducts(source).filter((product) => product.categoria === "Medicamentos");
const existingOverrides = JSON.parse(await readFile(OUTPUT_JSON, "utf8"));
const queue = products.filter((product) => !existingOverrides[product.id]);
const overrides = { ...existingOverrides };
const report = { errors: 0, missed: 0, saved: 0 };

await mkdir(OUTPUT_DIR, { recursive: true });
await Promise.all(
  Array.from({ length: Math.min(MAX_CONCURRENCY, queue.length) }, () => runWorker(queue, overrides, report))
);
await writeFile(OUTPUT_JSON, `${JSON.stringify(overrides, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      ...report,
      totalMedicamentos: products.length,
      totalOverrides: Object.keys(overrides).length
    },
    null,
    2
  )
);
