const path = require('path');
const sharp = require(path.join(process.cwd(), 'node_modules', 'sharp'));

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <radialGradient id="glow" cx="72%" cy="28%" r="55%">
      <stop offset="0%" stop-color="#0d9488" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#0d9488" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="96" fill="#0a0a0a"/>
  <rect width="512" height="512" rx="96" fill="url(#glow)"/>

  <!-- Top-left finder -->
  <rect x="72" y="72" width="120" height="120" rx="16" fill="white"/>
  <rect x="88" y="88" width="88" height="88" rx="10" fill="#0a0a0a"/>
  <rect x="104" y="104" width="56" height="56" rx="8" fill="#0d9488"/>

  <!-- Top-right finder -->
  <rect x="320" y="72" width="120" height="120" rx="16" fill="white"/>
  <rect x="336" y="88" width="88" height="88" rx="10" fill="#0a0a0a"/>
  <rect x="352" y="104" width="56" height="56" rx="8" fill="#0d9488"/>

  <!-- Bottom-left finder -->
  <rect x="72" y="320" width="120" height="120" rx="16" fill="white"/>
  <rect x="88" y="336" width="88" height="88" rx="10" fill="#0a0a0a"/>
  <rect x="104" y="352" width="56" height="56" rx="8" fill="#0d9488"/>

  <!-- Data dots — 3x3 grid, mismas dimensiones que un finder -->
  <rect x="320" y="320" width="26" height="26" rx="5" fill="#0d9488"/>
  <rect x="364" y="320" width="26" height="26" rx="5" fill="#0d9488"/>
  <rect x="408" y="320" width="26" height="26" rx="5" fill="#0d9488" opacity="0.4"/>

  <rect x="320" y="364" width="26" height="26" rx="5" fill="#0d9488" opacity="0.4"/>
  <rect x="364" y="364" width="26" height="26" rx="5" fill="#0d9488"/>
  <rect x="408" y="364" width="26" height="26" rx="5" fill="#0d9488"/>

  <rect x="320" y="408" width="26" height="26" rx="5" fill="#0d9488"/>
  <rect x="364" y="408" width="26" height="26" rx="5" fill="#0d9488" opacity="0.4"/>
  <rect x="408" y="408" width="26" height="26" rx="5" fill="#0d9488"/>
</svg>`;

async function main() {
  const outDir = path.join(process.cwd(), 'public', 'icons');
  for (const size of sizes) {
    const outPath = path.join(outDir, `icon-${size}x${size}.png`);
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
    console.log(`✓ icon-${size}x${size}.png`);
  }
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
