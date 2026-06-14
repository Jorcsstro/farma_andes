import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 1847;
const HEIGHT = 852;
const OUTPUT = "public/sections/banner-gym-andes-products.png";

const productStage = [
  {
    file: "public/products/showcase/whey-chocolate-907g.jpg",
    left: 1164,
    top: 355,
    width: 260,
    height: 300
  },
  {
    file: "public/products/showcase/wild-protein-chocolate-bitter-45g.jpg",
    left: 1416,
    top: 472,
    width: 260,
    height: 176
  },
  {
    file: "public/products/showcase/magnesio-citrato-400mg.jpg",
    left: 1580,
    top: 332,
    width: 174,
    height: 240
  },
  {
    file: "public/products/medicamentos/prod-50183-hialovis-colageno-hidrolizado-10000-mg-600-ml.jpg",
    left: 1080,
    top: 590,
    width: 220,
    height: 178
  },
  {
    file: "public/products/showcase/dha-kids-omega-3-90-capsulas.jpg",
    left: 1324,
    top: 615,
    width: 200,
    height: 150
  },
  {
    file: "public/products/importadas/prod-50064-spirulina-500-mg-x-90-capsulas-scl-cnp-dr-simi.jpg",
    left: 1584,
    top: 612,
    width: 170,
    height: 152
  }
];

function svgBuffer(markup) {
  return Buffer.from(markup);
}

async function packshot({ file, width, height }) {
  return sharp(file)
    .trim({ background: "#FFFFFF", threshold: 16 })
    .resize(width, height, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(path.dirname(OUTPUT), { recursive: true });

  const background = await sharp("public/sections/gym-sport-background.png")
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "center" })
    .modulate({ brightness: 0.98, saturation: 1.02 })
    .png()
    .toBuffer();

  const logoIcon = await sharp("public/identidad-visual/04 Isotipo.png")
    .trim({ background: "#FFFFFF", threshold: 12 })
    .resize(68, 56, { fit: "contain" })
    .png()
    .toBuffer();

  const overlay = svgBuffer(`
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leftFade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#F7FAFF" stop-opacity="0.94"/>
          <stop offset="0.36" stop-color="#F7FAFF" stop-opacity="0.72"/>
          <stop offset="0.70" stop-color="#F7FAFF" stop-opacity="0.12"/>
          <stop offset="1" stop-color="#F7FAFF" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="bluePanel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#0B3FA5"/>
          <stop offset="0.58" stop-color="#061B49"/>
          <stop offset="1" stop-color="#031033"/>
        </linearGradient>
        <linearGradient id="orange" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#FF6B00"/>
          <stop offset="1" stop-color="#FF8A1F"/>
        </linearGradient>
        <linearGradient id="floor" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#FFFFFF"/>
          <stop offset="0.72" stop-color="#F4F8FF"/>
          <stop offset="1" stop-color="#DFEAFE"/>
        </linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="22" stdDeviation="24" flood-color="#061B49" flood-opacity="0.2"/>
        </filter>
        <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="15"/>
        </filter>
      </defs>

      <rect width="${WIDTH}" height="${HEIGHT}" rx="34" fill="url(#leftFade)"/>
      <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" rx="34" fill="none" stroke="#D7E4F7" stroke-width="2"/>

      <path d="M987 0H1847V852H1036C980 760 928 644 910 510C882 304 916 142 987 0Z" fill="url(#bluePanel)" opacity="0.94"/>
      <path d="M1014 0C934 142 906 304 934 492C958 646 1014 762 1086 852" fill="none" stroke="#FFFFFF" stroke-width="9" opacity="0.72"/>

      <rect x="70" y="116" width="315" height="82" rx="41" fill="#FFFFFF" opacity="0.95" filter="url(#shadow)"/>
      <text x="164" y="151" font-family="Inter, Arial, sans-serif" font-size="31" font-weight="950" fill="#061B49">FARMACIA</text>
      <text x="164" y="184" font-family="Inter, Arial, sans-serif" font-size="31" font-weight="950" fill="#061B49">ANDES</text>

      <text x="72" y="366" font-family="Inter, Arial, sans-serif" font-size="74" font-weight="900" fill="#061B49">Activa tu</text>
      <rect x="64" y="388" width="420" height="104" rx="52" fill="url(#orange)" filter="url(#shadow)"/>
      <text x="108" y="468" font-family="Inter, Arial, sans-serif" font-size="82" font-weight="950" font-style="italic" fill="#FFFFFF">rutina</text>
      <text x="72" y="578" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="850" fill="#061B49">con energia Andes</text>
      <rect x="76" y="622" width="128" height="8" rx="4" fill="#FF6B00"/>
      <text x="76" y="682" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800" fill="#4F5F7A">Proteinas, suplementos y apoyo nutricional</text>

      <g transform="translate(1220 132)">
        <circle cx="58" cy="58" r="58" fill="#FFFFFF" filter="url(#shadow)"/>
        <path d="M58 21c21 9 33 10 33 10v23c0 25-18 39-33 44c-15-5-33-19-33-44V31s12-1 33-10z" fill="none" stroke="#0B3FA5" stroke-width="7" stroke-linejoin="round"/>
        <path d="M54 42h10v13h13v10H64v13H54V65H41V55h13z" fill="#FF6B00"/>
      </g>
      <text x="1366" y="180" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="900" fill="#FFFFFF">Energia diaria</text>
      <text x="1366" y="235" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="900" fill="#FFFFFF">y recuperacion</text>

      <path d="M1044 520C1148 480 1278 492 1392 516C1508 540 1612 500 1722 532C1786 552 1822 582 1834 614V772H1018V606C1024 568 1032 540 1044 520Z" fill="url(#floor)" filter="url(#shadow)"/>
      <path d="M1032 620C1176 574 1325 594 1462 608C1594 622 1714 604 1834 570V772H1018V650C1022 638 1026 628 1032 620Z" fill="#FFFFFF" opacity="0.82"/>
      <ellipse cx="1242" cy="742" rx="190" ry="28" fill="#061B49" opacity="0.14" filter="url(#softBlur)"/>
      <ellipse cx="1510" cy="742" rx="218" ry="30" fill="#061B49" opacity="0.16" filter="url(#softBlur)"/>
      <text x="1090" y="792" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="750" fill="#65708A">Productos reales del catalogo. Disponibilidad segun stock.</text>
    </svg>
  `);

  const composites = [
    { input: background, left: 0, top: 0 },
    { input: overlay, left: 0, top: 0 },
    { input: logoIcon, left: 84, top: 128 }
  ];

  for (const product of productStage) {
    composites.push({
      input: await packshot(product),
      left: product.left,
      top: product.top
    });
  }

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: "#FFFFFF"
    }
  })
    .composite(composites)
    .png({ compressionLevel: 9, palette: false })
    .toFile(OUTPUT);

  console.log(`Banner generado: ${OUTPUT}`);
}

await main();
