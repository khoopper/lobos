import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");

const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const root = process.cwd();
const instagramUrl = "https://www.instagram.com/lobos_sv/";
const asset = (name) => `/brand/lobos/instagram/${name}`;
const hero = (name) => `/brand/lobos/hero/${name}`;

async function rows(table) {
  const { data, error } = await supabase.from(table).select("*");
  if (error) throw error;
  return data;
}

const bookings = await rows("bookings");
if (bookings.length) throw new Error("Hay reservas existentes; se canceló la sustitución para no romper sus referencias.");

const backupTables = ["site_settings", "nav_links", "hero_slides", "tours", "content_blocks", "gallery_items", "reviews"];
const backup = Object.fromEntries(await Promise.all(backupTables.map(async (table) => [table, await rows(table)])));
const backupDir = path.join(root, "docs", "backups");
await fs.mkdir(backupDir, { recursive: true });
await fs.writeFile(path.join(backupDir, "before-club-de-lobos.json"), JSON.stringify({ createdAt: new Date().toISOString(), data: backup }, null, 2));

const settings = {
  logo_header_url: "/brand/lobos/logo-white-640.png",
  logo_footer_url: "/brand/lobos/logo-white-1024.png",
  favicon_url: "/brand/lobos/favicon-32.png",
  phone_label: "+503 7952-8033 / +503 7554-6785",
  phone_href: "tel:+50379528033",
  email: "",
  address: "El Salvador",
  social_facebook_url: null,
  social_instagram_url: instagramUrl,
  social_youtube_url: null,
  palette_1: "#1b3a2d",
  palette_2: "#0b0f0d",
  palette_3: "#17201a",
  palette_5: "#556057",
  palette_7: "#e5b45f",
  palette_8: "#f5f3eb",
  footer_registro: "El Salvador · Aventuras, camping y montaña",
  footer_copyright: `© ${new Date().getFullYear()} Club de Lobos.`,
  footer_credit_label: "",
  footer_credit_href: null,
};
const settingsResult = await supabase.from("site_settings").update(settings).eq("id", 1);
if (settingsResult.error) throw settingsResult.error;

const replacements = ["nav_links", "hero_slides", "tours", "gallery_items", "reviews"];
for (const table of replacements) {
  const result = await supabase.from(table).delete().not("id", "is", null);
  if (result.error) throw result.error;
}

const navLinks = [
  { label: "Inicio", href: "/", sort_order: 0 },
  { label: "Próxima aventura", href: "/#proximas-aventuras", sort_order: 1 },
  { label: "Destinos", href: "/#destinos", sort_order: 2 },
  { label: "La manada", href: "/#nosotros", sort_order: 3 },
  { label: "Galería", href: "/#galeria", sort_order: 4 },
  { label: "Instagram", href: instagramUrl, sort_order: 5 },
];
const navResult = await supabase.from("nav_links").insert(navLinks);
if (navResult.error) throw navResult.error;

const heroSlides = [
  { image_url: hero("uyuni-2026.webp"), image_w: 1600, image_h: 900, heading: "Rumbo a Uyuni", description: "Cinco días de aventura desde La Paz hasta el Salar de Uyuni para cerrar 2026 con la manada.", button_label: "Ver próxima salida", href: "/#proximas-aventuras", sort_order: 0 },
  { image_url: hero("aventura-amigos.webp"), image_w: 1600, image_h: 900, heading: "La aventura se vive en manada", description: "Amigos, montaña, camping y nuevas historias por contar. Eso es Club de Lobos.", button_label: "Conoce el club", href: "/#nosotros", sort_order: 1 },
  { image_url: hero("machu-picchu.webp"), image_w: 1600, image_h: 900, heading: "Machu Picchu · 2,430 msnm", description: "Rutas que nos llevan más lejos y nos recuerdan por qué amamos explorar.", button_label: "Explora los destinos", href: "/#destinos", sort_order: 2 },
  { image_url: hero("santa-ana.webp"), image_w: 1600, image_h: 900, heading: "Ruta de los Andes", description: "Volcanes, bosque y caminos para vivir El Salvador al máximo.", button_label: "Mira la galería", href: "/#galeria", sort_order: 3 },
];
const heroResult = await supabase.from("hero_slides").insert(heroSlides);
if (heroResult.error) throw heroResult.error;

const toursResult = await supabase.from("tours").insert({
  slug: "rumbo-a-uyuni-2026", title: "Rumbo a Uyuni · Bolivia", price: "Consultar", currency_symbol: "",
  departure_start: "2026-12-25", departure_end: "2026-12-30", image_url: asset("uyuni-2026.jpg"), image_w: 512, image_h: 640,
  hover_image_url: asset("peru-destinos.jpg"), hover_image_w: 480, hover_image_h: 640, button_label: "Solicitar información", sort_order: 0, is_published: true,
});
if (toursResult.error) throw toursResult.error;

const blocks = [
  { key: "guias", data: { heading: "Aventuras que nos conectan", buttonLabel: "Mira la próxima salida", buttonHref: "/#proximas-aventuras", images: [{ src: asset("aventura-amigos.jpg"), width: 480, height: 640 }, { src: asset("roble-negro.jpg"), width: 480, height: 640 }] } },
  { key: "camping", data: { heading: "Somos Club de Lobos", body: "Somos un club de amigos que nos encanta la aventura: trapacerros, viajes, camping y vivir cada experiencia al máximo.", buttonLabel: "Únete a la conversación", buttonHref: instagramUrl, image: { src: asset("senderismo.jpg"), width: 360, height: 640 } } },
  { key: "fotografias", data: { heading: "Historias de la manada", body: "Momentos, rutas y paisajes compartidos por Club de Lobos." } },
];
for (const block of blocks) {
  const result = await supabase.from("content_blocks").upsert(block, { onConflict: "key" });
  if (result.error) throw result.error;
}

const gallerySources = [
  ["bolas-de-fuego.jpg", "Bolas de Fuego · Nejapa"], ["peru-destinos.jpg", "Destinos de Perú"], ["machu-picchu.jpg", "Machu Picchu"],
  ["uyuni-2026.jpg", "Rumbo a Uyuni"], ["aventura-amigos.jpg", "La aventura se vive en manada"], ["roble-negro.jpg", "Reserva del Roble Negro"],
  ["bosque-lya.jpg", "Bosque Lya"], ["senderismo.jpg", "Senderismo con amigos"], ["perseverancia.jpg", "Cada paso cuenta"],
  ["berlin-alegria.jpg", "Travesía de Berlín"], ["santa-ana.jpg", "Volcán de Santa Ana"], ["aventura-conductor.jpg", "Camino a la aventura"],
];
const galleryItems = await Promise.all(gallerySources.map(async ([filename, title], sort_order) => {
  const metadata = await sharp(path.join(root, "public", "brand", "lobos", "instagram", filename)).metadata();
  return { image_url: asset(filename), image_w: metadata.width, image_h: metadata.height, title, sort_order, is_published: true };
}));
const galleryResult = await supabase.from("gallery_items").insert(galleryItems);
if (galleryResult.error) throw galleryResult.error;

console.log(JSON.stringify({ backup: path.join(backupDir, "before-club-de-lobos.json"), nav: navLinks.length, hero: heroSlides.length, tours: 1, gallery: galleryItems.length, reviews: 0 }, null, 2));
