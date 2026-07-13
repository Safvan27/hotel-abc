const sharp = require("sharp");
const path = require("path");

const accent = "#0f74c5";

function svgIcon(size, radius) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${accent}"/>
  <text x="50%" y="54%" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${size * 0.55}" fill="white" text-anchor="middle" dominant-baseline="middle">A</text>
</svg>`;
}

function maskableSvg(size) {
  const fontSize = size * 0.42;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${accent}"/>
  <text x="50%" y="54%" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${fontSize}" fill="white" text-anchor="middle" dominant-baseline="middle">A</text>
</svg>`;
}

const iconsDir = path.join(__dirname, "..", "public", "icons");
const appDir = path.join(__dirname, "..", "src", "app");

async function run() {
  const sizes = [
    { file: "icon-192.png", size: 192, radius: 40 },
    { file: "icon-512.png", size: 512, radius: 108 },
    { file: "apple-touch-icon.png", size: 180, radius: 38 },
  ];
  for (const s of sizes) {
    await sharp(Buffer.from(svgIcon(s.size, s.radius))).png().toFile(path.join(iconsDir, s.file));
    console.log("wrote", s.file);
  }
  await sharp(Buffer.from(maskableSvg(512))).png().toFile(path.join(iconsDir, "maskable-512.png"));
  console.log("wrote maskable-512.png");

  await sharp(Buffer.from(svgIcon(32, 7))).png().toFile(path.join(appDir, "icon.png"));
  console.log("wrote app/icon.png");
  await sharp(Buffer.from(svgIcon(180, 38))).png().toFile(path.join(appDir, "apple-icon.png"));
  console.log("wrote app/apple-icon.png");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
