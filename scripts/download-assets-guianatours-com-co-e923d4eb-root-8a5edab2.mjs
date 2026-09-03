/**
 * Asset downloader for the guianatours.com.co homepage clone.
 * site-key: guianatours-com-co-e923d4eb
 * page-key: root-8a5edab2
 *
 * Downloads into public/sites/<site-key>/<page-key>/ with 4 parallel requests.
 * Safe to re-run: existing non-empty files are skipped.
 */
import fs from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

const SITE_KEY = 'guianatours-com-co-e923d4eb';
const PAGE_KEY = 'root-8a5edab2';
const ROOT = path.resolve(process.cwd(), 'public', 'sites', SITE_KEY, PAGE_KEY);
const U = 'https://guianatours.com.co/wp-content/uploads';

/** @type {{url:string, out:string}[]} */
const ASSETS = [
  // --- brand ---
  { url: `${U}/2022/06/logo-guia-natours-oso.png`, out: 'brand/logo-oso.png' },
  { url: `${U}/2021/10/1.Logotipo-EN-BLANCO.RECORTADO.png`, out: 'brand/logo-blanco.png' },
  { url: `${U}/2021/11/cropped-Frame-19-32x32.png`, out: 'brand/favicon-32.png' },
  { url: `${U}/2021/11/cropped-Frame-19-192x192.png`, out: 'brand/favicon-192.png' },
  { url: `${U}/2021/11/cropped-Frame-19-180x180.png`, out: 'brand/apple-touch-icon.png' },

  // --- hero slides ---
  { url: `${U}/2021/11/venados-chingaza.jpg`, out: 'hero/venados-chingaza.jpg' },
  { url: `${U}/2021/11/cascada-sueve.jpg`, out: 'hero/cascada-sueve.jpg' },
  { url: `${U}/2021/11/chingaza-nocturna.jpg`, out: 'hero/chingaza-nocturna.jpg' },
  { url: `${U}/2021/11/laguna-de-siecha.jpg`, out: 'hero/laguna-de-siecha.jpg' },

  // --- product cards (primary + hover image) ---
  { url: `${U}/2022/03/0-600x360.jpg`, out: 'products/farallones-sutatausa.jpg' },
  { url: `${U}/2022/03/FARA-4-de-5.jpg`, out: 'products/farallones-sutatausa-hover.jpg' },
  { url: `${U}/2021/11/SIECHA-3-de-10-600x360.jpg`, out: 'products/lagunas-de-siecha.jpg' },
  { url: `${U}/2021/11/SIECHA-5-de-10-1536x1113.jpg`, out: 'products/lagunas-de-siecha-hover.jpg' },
  { url: `${U}/2023/07/Sin-titulo-0-600x360.png`, out: 'products/tatacoa.png' },
  { url: `${U}/2023/07/Sin-titulo-1.png`, out: 'products/tatacoa-hover.png' },
  { url: `${U}/2021/11/kids-600x360.jpg`, out: 'products/chingaza-kids.jpg' },
  { url: `${U}/2021/11/KIDS-5-de-9.jpg`, out: 'products/chingaza-kids-hover.jpg' },
  { url: `${U}/2021/11/Sin-titulo-1-Recuperado-600x360.jpg`, out: 'products/camping-chingaza.jpg' },
  { url: `${U}/2021/11/valle-de-los-frailejones.jpg`, out: 'products/camping-chingaza-hover.jpg' },
  { url: `${U}/2022/08/PENAS-BLANCAS-PORTADA-WEB-600x360.png`, out: 'products/penas-blancas.png' },
  { url: `${U}/2022/08/DSC_0025-1-600x360.png`, out: 'products/penas-blancas-hover.png' },

  // --- "Guías expertos locales" ---
  { url: `${U}/2021/11/guia-natours.jpg`, out: 'guias/guia-natours.jpg' },
  { url: `${U}/2021/11/caminata-natural.jpg`, out: 'guias/caminata-natural.jpg' },

  // --- "Camping" ---
  { url: `${U}/2021/11/1024.jpg`, out: 'camping/1024.jpg' },

  // --- "Fotografías de la semana" gallery (thumb + full for lightbox link) ---
  { url: `${U}/2022/09/DSC_4263-300x200.png`, out: 'gallery/dsc-4263.png' },
  { url: `${U}/2022/03/1-300x202.jpg`, out: 'gallery/1.jpg' },
  { url: `${U}/2021/11/DSC_0452-300x200.jpg`, out: 'gallery/dsc-0452.jpg' },
  { url: `${U}/2021/11/1024-300x300.jpg`, out: 'gallery/camping.jpg' },
  { url: `${U}/2022/09/chingaza-nocturna-200x300.jpeg`, out: 'gallery/chingaza-nocturna.jpeg' },
  { url: `${U}/2022/09/chingaza.kids_-200x300.jpeg`, out: 'gallery/chingaza-kids.jpeg' },
  { url: `${U}/2022/09/farallones-300x200.jpeg`, out: 'gallery/farallones.jpeg' },
  { url: `${U}/2022/09/kids-203x300.jpeg`, out: 'gallery/kids.jpeg' },
  { url: `${U}/2022/09/siecha-300x200.jpeg`, out: 'gallery/siecha.jpeg' },
  { url: `${U}/2022/09/sueva-300x215.jpeg`, out: 'gallery/sueva.jpeg' },
  { url: `${U}/2022/09/venados-300x200.jpeg`, out: 'gallery/venados.jpeg' },

  // --- SEO / open graph ---
  { url: `${U}/2022/09/guia-natours.jpeg`, out: 'seo/og-image.jpeg' },
];

async function download({ url, out }) {
  const dest = path.join(ROOT, out);
  if (existsSync(dest) && statSync(dest).size > 0) return { out, status: 'skipped' };
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://guianatours.com.co/' },
  });
  if (!res.ok) return { out, status: `failed ${res.status}`, url };
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length === 0) return { out, status: 'failed empty', url };
  await fs.writeFile(dest, buf);
  return { out, status: 'ok', bytes: buf.length };
}

const results = [];
for (let i = 0; i < ASSETS.length; i += 4) {
  const batch = ASSETS.slice(i, i + 4);
  results.push(...(await Promise.all(batch.map((a) => download(a).catch((e) => ({ out: a.out, status: `error ${e.message}`, url: a.url }))))));
}

const failed = results.filter((r) => r.status !== 'ok' && r.status !== 'skipped');
const ok = results.filter((r) => r.status === 'ok');
console.log(`downloaded ${ok.length}, skipped ${results.length - ok.length - failed.length}, failed ${failed.length}`);
for (const f of failed) console.log(`  FAILED ${f.out} <- ${f.url} (${f.status})`);
if (failed.length) process.exitCode = 1;
