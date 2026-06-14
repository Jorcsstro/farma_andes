import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const BASE = "public/sections/banner-invierno-andes.png";
const OUTPUT = "public/sections/banner-invierno-andes-real-products.png";

const productImages = [
  {
    file: "public/products/importadas/prod-49348-tapsin-forte-6-comprimidos-cafeina-40-mg-paracetamol-650-mg-dr-simi.jpg",
    left: 1112,
    top: 382,
    width: 228,
    height: 166
  },
  {
    file: "public/products/medicamentos/xumadol-1g-20comp.jpg",
    left: 1322,
    top: 382,
    width: 246,
    height: 180
  },
  {
    file: "public/products/importadas/prod-25699-salbutamol-lf-inh-250-ds-chemopharma-dr-simi.jpg",
    left: 1637,
    top: 315,
    width: 166,
    height: 258
  },
  {
    file: "public/products/importadas/prod-49553-vitamina-c-1000-mg-efev-sabor-limon-20-tab-acido-ascorbico-1000-mg-dr-simi.jpg",
    left: 1086,
    top: 553,
    width: 252,
    height: 172
  },
  {
    file: "public/products/importadas/prod-6177-tocalm-jarabe-inf-15-mg-5-ml-100-ml-ambroxol-15-mg-5-ml-dr-simi.jpg",
    left: 1424,
    top: 535,
    width: 212,
    height: 194
  },
  {
    file: "public/products/medicamentos/prod-12805-geniol-sobre-dia-5-g-acido-ascorbico-50-mg-cafeina-33-mg-clorfenamina-.jpg",
    left: 1256,
    top: 560,
    width: 214,
    height: 166
  }
];

function svgBuffer(markup) {
  return Buffer.from(markup);
}

async function packshot({ file, width, height }) {
  return sharp(file)
    .trim({ background: "#FFFFFF", threshold: 18 })
    .resize(width, height, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toBuffer();
}

function stageOverlay() {
  return svgBuffer(`
    <svg width="1847" height="852" viewBox="0 0 1847 852" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blueRestore" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#073B9E"/>
          <stop offset="0.48" stop-color="#0B4EB9"/>
          <stop offset="1" stop-color="#061B49"/>
        </linearGradient>
        <linearGradient id="shelf" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#FFFFFF"/>
          <stop offset="0.62" stop-color="#F4F8FF"/>
          <stop offset="1" stop-color="#DFEAFE"/>
        </linearGradient>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#061B49" flood-opacity="0.25"/>
        </filter>
        <filter id="productShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12"/>
        </filter>
      </defs>

      <rect x="1062" y="292" width="746" height="262" rx="22" fill="url(#blueRestore)"/>
      <path d="M1082 512 C1170 474 1272 484 1365 505 C1458 526 1528 492 1620 506 C1702 518 1760 542 1810 595 L1810 742 L1048 742 L1048 574 C1056 548 1066 528 1082 512Z" fill="url(#shelf)" filter="url(#soft)"/>
      <path d="M1080 560 C1215 518 1362 536 1488 548 C1605 559 1710 560 1810 532 L1810 742 L1048 742 L1048 594 C1056 579 1065 568 1080 560Z" fill="#FFFFFF" opacity="0.74"/>
      <rect x="1050" y="718" width="768" height="22" rx="11" fill="#FFFFFF" opacity="0.55"/>

      <ellipse cx="1220" cy="710" rx="154" ry="24" fill="#061B49" opacity="0.14" filter="url(#productShadow)"/>
      <ellipse cx="1475" cy="710" rx="178" ry="24" fill="#061B49" opacity="0.16" filter="url(#productShadow)"/>
      <ellipse cx="1698" cy="705" rx="88" ry="20" fill="#061B49" opacity="0.13" filter="url(#productShadow)"/>

      <text x="1088" y="750" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" fill="#65708A">Productos reales del catálogo. Disponibilidad según stock.</text>
    </svg>
  `);
}

async function main() {
  await mkdir(path.dirname(OUTPUT), { recursive: true });

  const composites = [{ input: stageOverlay(), left: 0, top: 0 }];

  for (const image of productImages) {
    composites.push({
      input: await packshot(image),
      left: image.left,
      top: image.top
    });
  }

  await sharp(BASE)
    .composite(composites)
    .png({ compressionLevel: 9, palette: false })
    .toFile(OUTPUT);

  console.log(`Banner generado: ${OUTPUT}`);
}

await main();
