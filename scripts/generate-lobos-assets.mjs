import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public", "brand", "lobos", "source", "logo-master.png");
const output = path.join(root, "public", "brand", "lobos");

const FOREST = "#1b3a2d";
const DARK = "#0b0f0d";
const CREAM = "#f5f3eb";

await fs.mkdir(output, { recursive: true });

const trimmed = sharp(source).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } });

async function coloredMark(width, height, color) {
  const alpha = await trimmed
    .clone()
    .resize({ width, height, fit: "inside" })
    .ensureAlpha()
    .extractChannel("alpha")
    .png()
    .toBuffer();
  const metadata = await sharp(alpha).metadata();
  return sharp({
    create: {
      width: metadata.width,
      height: metadata.height,
      channels: 3,
      background: color,
    },
  })
    .joinChannel(alpha)
    .png()
    .toBuffer();
}

async function transparentLogo(filename, size, color) {
  const mark = await coloredMark(Math.round(size * 0.8), Math.round(size * 0.8), color);
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: mark, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(output, filename));
}

async function squareIcon(filename, size, background, color, scale = 0.68) {
  const mark = await coloredMark(Math.round(size * scale), Math.round(size * scale), color);
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: mark, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(output, filename));
}

await Promise.all([
  transparentLogo("logo-black-640.png", 640, "#111713"),
  transparentLogo("logo-white-640.png", 640, "#ffffff"),
  transparentLogo("logo-white-1024.png", 1024, "#ffffff"),
  squareIcon("favicon-16.png", 16, CREAM, DARK, 0.72),
  squareIcon("favicon-32.png", 32, CREAM, DARK, 0.72),
  squareIcon("favicon-48.png", 48, CREAM, DARK, 0.72),
  squareIcon("apple-touch-icon.png", 180, FOREST, "#ffffff"),
  squareIcon("icon-192.png", 192, FOREST, "#ffffff"),
  squareIcon("icon-512.png", 512, FOREST, "#ffffff"),
  squareIcon("icon-maskable-512.png", 512, FOREST, "#ffffff", 0.56),
]);

const ogLogo = await coloredMark(300, 300, "#ffffff");
const ogText = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${DARK}"/>
        <stop offset="1" stop-color="${FOREST}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <circle cx="185" cy="315" r="155" fill="#ffffff" fill-opacity=".06"/>
    <text x="390" y="280" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="74" font-weight="800" letter-spacing="2">CLUB DE LOBOS</text>
    <text x="394" y="345" fill="#e5b45f" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="600">AVENTURAS · CAMPING · MONTAÑA</text>
    <text x="394" y="407" fill="#ffffff" fill-opacity=".82" font-family="Arial, Helvetica, sans-serif" font-size="26">Amigos que viven la aventura al máximo</text>
  </svg>`);
await sharp(ogText)
  .composite([{ input: ogLogo, left: 35, top: 165 }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(output, "og-image.png"));

const heroOutput = path.join(output, "hero");
await fs.mkdir(heroOutput, { recursive: true });
const heroSources = [
  ["uyuni-2026.jpg", "uyuni-2026.webp"],
  ["aventura-amigos.jpg", "aventura-amigos.webp"],
  ["machu-picchu.jpg", "machu-picchu.webp"],
  ["santa-ana.jpg", "santa-ana.webp"],
];
for (const [sourceName, outputName] of heroSources) {
  const input = path.join(output, "instagram", sourceName);
  const background = await sharp(input)
    .resize(1600, 900, { fit: "cover" })
    .blur(24)
    .modulate({ brightness: 0.55, saturation: 0.8 })
    .toBuffer();
  const poster = await sharp(input).resize({ height: 900, fit: "inside" }).toBuffer();
  const posterMeta = await sharp(poster).metadata();
  const overlay = Buffer.from(`
    <svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="shade"><stop offset="0" stop-color="#050806" stop-opacity=".82"/><stop offset=".55" stop-color="#050806" stop-opacity=".42"/><stop offset="1" stop-color="#050806" stop-opacity=".08"/></linearGradient></defs>
      <rect width="1600" height="900" fill="url(#shade)"/>
    </svg>`);
  await sharp(background)
    .composite([
      { input: poster, left: 1600 - posterMeta.width, top: 0 },
      { input: overlay, left: 0, top: 0 },
    ])
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(heroOutput, outputName));
}

console.log(`Paquete de marca generado en ${output}`);
