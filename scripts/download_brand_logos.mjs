import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUTPUT_DIR = "public/brands";

const brands = [
  { name: "Eucerin", slug: "eucerin", domain: "eucerin.com", preferFallback: true },
  { name: "NIVEA", slug: "nivea", domain: "nivea.com" },
  { name: "La Roche-Posay", slug: "la-roche-posay", domain: "laroche-posay.com", preferFallback: true },
  { name: "Vichy", slug: "vichy", domain: "vichy.com" },
  { name: "CeraVe", slug: "cerave", domain: "cerave.com", preferFallback: true },
  { name: "ISDIN", slug: "isdin", domain: "isdin.com", preferFallback: true },
  { name: "Banana Boat", slug: "banana-boat", domain: "bananaboat.com", preferFallback: true },
  { name: "Dove", slug: "dove", domain: "dove.com" },
  { name: "Rexona", slug: "rexona", domain: "rexona.com", preferFallback: true },
  { name: "Colgate", slug: "colgate", domain: "colgate.com", preferFallback: true },
  { name: "Vitis", slug: "vitis", domain: "vitis.es", preferFallback: true },
  { name: "Petrizzio", slug: "petrizzio", domain: "petrizzio.cl", preferFallback: true },
  { name: "Pantene", slug: "pantene", domain: "pantene.com", preferFallback: true },
  { name: "Cicatricure", slug: "cicatricure", domain: "cicatricure.com", preferFallback: true },
  { name: "Bepanthol", slug: "bepanthol", domain: "bepanthol.com", preferFallback: true },
  { name: "Aquafresh", slug: "aquafresh", domain: "aquafresh.com", preferFallback: true }
];

function fallbackSvg(name) {
  const fontSize = name.length > 11 ? 26 : 32;

  return Buffer.from(`
    <svg width="260" height="96" viewBox="0 0 260 96" xmlns="http://www.w3.org/2000/svg">
      <rect width="260" height="96" rx="20" fill="#FFFFFF"/>
      <rect x="1" y="1" width="258" height="94" rx="19" fill="none" stroke="#E5EAF5"/>
      <text x="130" y="56" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="900" fill="#061B49">${name}</text>
    </svg>
  `);
}

async function fetchLogo(domain) {
  const urls = [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=256`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"
        },
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      const buffer = Buffer.from(await response.arrayBuffer());

      if (!contentType.startsWith("image/") || buffer.byteLength < 500) {
        continue;
      }

      return { buffer, source: url };
    } catch {
      // Try next source.
    }
  }

  return null;
}

async function normalizeLogo(input, output) {
  const image = sharp(input).resize(260, 96, {
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 0 }
  });

  await image.png().toFile(output);
}

await mkdir(OUTPUT_DIR, { recursive: true });

const manifest = [];

for (const brand of brands) {
  const output = path.join(OUTPUT_DIR, `${brand.slug}.png`);
  const downloaded = brand.preferFallback ? null : await fetchLogo(brand.domain);
  const source = downloaded?.source ?? "fallback-svg";
  const input = downloaded?.buffer ?? fallbackSvg(brand.name);

  await normalizeLogo(input, output);
  manifest.push({ ...brand, src: `/brands/${brand.slug}.png`, source });
  console.log(`${downloaded ? "OK" : "FALLBACK"} ${brand.name} -> ${output}`);
}

await writeFile(path.join(OUTPUT_DIR, "brand-logos.json"), `${JSON.stringify(manifest, null, 2)}\n`);
