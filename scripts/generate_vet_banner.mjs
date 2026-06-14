import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 1847;
const HEIGHT = 852;
const OUTPUT = "public/sections/banner-veterinaria-andes.png";

function svgBuffer(markup) {
  return Buffer.from(markup);
}

async function main() {
  await mkdir(path.dirname(OUTPUT), { recursive: true });

  const background = await sharp("public/sections/veterinaria-background.png")
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "center" })
    .modulate({ brightness: 0.98, saturation: 1.03 })
    .png()
    .toBuffer();

  const logoIcon = await sharp("public/identidad-visual/04 Isotipo.png")
    .trim({ background: "#FFFFFF", threshold: 12 })
    .resize(74, 60, { fit: "contain" })
    .png()
    .toBuffer();

  const overlay = svgBuffer(`
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leftBlue" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#061B49" stop-opacity="0.96"/>
          <stop offset="0.44" stop-color="#0B3FA5" stop-opacity="0.70"/>
          <stop offset="0.72" stop-color="#0B3FA5" stop-opacity="0.12"/>
          <stop offset="1" stop-color="#0B3FA5" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="bottomBlue" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#061B49" stop-opacity="0"/>
          <stop offset="1" stop-color="#061B49" stop-opacity="0.28"/>
        </linearGradient>
        <linearGradient id="orange" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#FF6B00"/>
          <stop offset="1" stop-color="#FF8A1F"/>
        </linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#061B49" flood-opacity="0.22"/>
        </filter>
      </defs>

      <rect width="${WIDTH}" height="${HEIGHT}" rx="34" fill="url(#leftBlue)"/>
      <rect width="${WIDTH}" height="${HEIGHT}" rx="34" fill="url(#bottomBlue)"/>
      <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" rx="34" fill="none" stroke="#CFE0F7" stroke-width="2" opacity="0.55"/>

      <rect x="72" y="116" width="334" height="86" rx="43" fill="#FFFFFF" opacity="0.96" filter="url(#shadow)"/>
      <text x="174" y="153" font-family="Nunito, Segoe UI, Arial, sans-serif" font-size="32" font-weight="900" fill="#061B49">FARMACIA</text>
      <text x="174" y="188" font-family="Nunito, Segoe UI, Arial, sans-serif" font-size="32" font-weight="900" fill="#061B49">ANDES</text>

      <text x="76" y="338" font-family="Nunito, Segoe UI, Arial, sans-serif" font-size="72" font-weight="900" fill="#FFFFFF">Cuidado</text>
      <rect x="70" y="358" width="486" height="102" rx="51" fill="url(#orange)" filter="url(#shadow)"/>
      <text x="112" y="435" font-family="Nunito, Segoe UI, Arial, sans-serif" font-size="76" font-weight="950" fill="#FFFFFF">veterinario</text>
      <text x="76" y="540" font-family="Nunito, Segoe UI, Arial, sans-serif" font-size="53" font-weight="850" fill="#FFFFFF">cerca de tu familia</text>
      <rect x="80" y="585" width="124" height="8" rx="4" fill="#FF8A1F"/>
      <text x="78" y="646" font-family="Nunito, Segoe UI, Arial, sans-serif" font-size="24" font-weight="800" fill="#EAF2FF">Consulta antiparasitarios, suplementos y cuidado diario</text>

      <g transform="translate(78 690)">
        <rect x="0" y="0" width="314" height="48" rx="24" fill="#FFFFFF" opacity="0.94"/>
        <circle cx="28" cy="24" r="7" fill="#FF6B00"/>
        <text x="48" y="31" font-family="Nunito, Segoe UI, Arial, sans-serif" font-size="18" font-weight="900" fill="#061B49">Atención por WhatsApp</text>
      </g>

      <path d="M1548 92h30v30h30v29h-30v30h-30v-30h-30v-29h30z" fill="#FF6B00" opacity="0.88"/>
      <path d="M1280 724h18v18h18v18h-18v18h-18v-18h-18v-18h18z" fill="#7DA7FF" opacity="0.40"/>
    </svg>
  `);

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: "#061B49"
    }
  })
    .composite([
      { input: background, left: 0, top: 0 },
      { input: overlay, left: 0, top: 0 },
      { input: logoIcon, left: 88, top: 128 }
    ])
    .png({ compressionLevel: 9, palette: false })
    .toFile(OUTPUT);

  console.log(`Banner generado: ${OUTPUT}`);
}

await main();
