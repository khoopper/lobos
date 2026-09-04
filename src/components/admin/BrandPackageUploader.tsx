"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImageUp, PackageCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getBrandPackageUploadTargets } from "@/lib/storage/actions";
import { applyBrandPackage } from "@/app/admin/(protected)/settings/actions";

type BrandValues = { logoHeaderUrl: string; logoFooterUrl: string; faviconUrl: string };
type Bounds = { x: number; y: number; width: number; height: number };

function canvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("No se pudo crear el archivo PNG.")), "image/png"));
}

function sourceBounds(image: HTMLImageElement): Bounds {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("El navegador no pudo procesar la imagen.");
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 8) {
        minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      }
    }
  }
  if (maxX < minX || maxY < minY) throw new Error("El PNG no contiene un logo visible.");
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function drawMark(context: CanvasRenderingContext2D, image: HTMLImageElement, bounds: Bounds, box: { x: number; y: number; width: number; height: number }, color: string) {
  const scale = Math.min(box.width / bounds.width, box.height / bounds.height);
  const width = bounds.width * scale;
  const height = bounds.height * scale;
  const x = box.x + (box.width - width) / 2;
  const y = box.y + (box.height - height) / 2;
  const mark = document.createElement("canvas");
  mark.width = Math.max(1, Math.round(width));
  mark.height = Math.max(1, Math.round(height));
  const markContext = mark.getContext("2d");
  if (!markContext) throw new Error("El navegador no pudo procesar el logo.");
  markContext.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, mark.width, mark.height);
  markContext.globalCompositeOperation = "source-in";
  markContext.fillStyle = color;
  markContext.fillRect(0, 0, mark.width, mark.height);
  context.drawImage(mark, x, y, width, height);
}

async function makeSquare(image: HTMLImageElement, bounds: Bounds, size: number, background: string | null, color: string, scale: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("El navegador no pudo crear el icono.");
  if (background) { context.fillStyle = background; context.fillRect(0, 0, size, size); }
  const margin = size * (1 - scale) / 2;
  drawMark(context, image, bounds, { x: margin, y: margin, width: size - margin * 2, height: size - margin * 2 }, color);
  return canvasBlob(canvas);
}

async function makeOg(image: HTMLImageElement, bounds: Bounds, primary: string, accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200; canvas.height = 630;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("El navegador no pudo crear la tarjeta social.");
  const gradient = context.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, "#0b0f0d"); gradient.addColorStop(1, primary);
  context.fillStyle = gradient; context.fillRect(0, 0, 1200, 630);
  context.fillStyle = "rgba(255,255,255,.06)"; context.beginPath(); context.arc(185, 315, 155, 0, Math.PI * 2); context.fill();
  drawMark(context, image, bounds, { x: 35, y: 165, width: 300, height: 300 }, "#ffffff");
  context.fillStyle = "#ffffff"; context.font = "800 74px Montserrat, Arial, sans-serif"; context.fillText("CLUB DE LOBOS", 390, 280);
  context.fillStyle = accent; context.font = "700 31px Montserrat, Arial, sans-serif"; context.fillText("AVENTURAS · CAMPING · MONTAÑA", 394, 345);
  context.fillStyle = "rgba(255,255,255,.82)"; context.font = "400 26px Montserrat, Arial, sans-serif"; context.fillText("Amigos que viven la aventura al máximo", 394, 407);
  return canvasBlob(canvas);
}

async function createFiles(file: File, primary: string, accent: string) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img); img.onerror = () => reject(new Error("No se pudo leer el PNG.")); img.src = objectUrl;
    });
    const bounds = sourceBounds(image);
    const variants: Array<[string, Promise<Blob>]> = [
      ["logo-white-640.png", makeSquare(image, bounds, 640, null, "#ffffff", 0.8)],
      ["logo-white-1024.png", makeSquare(image, bounds, 1024, null, "#ffffff", 0.8)],
      ["logo-black-640.png", makeSquare(image, bounds, 640, null, "#111713", 0.8)],
      ["favicon-16.png", makeSquare(image, bounds, 16, "#f5f3eb", "#0b0f0d", 0.72)],
      ["favicon-32.png", makeSquare(image, bounds, 32, "#f5f3eb", "#0b0f0d", 0.72)],
      ["favicon-48.png", makeSquare(image, bounds, 48, "#f5f3eb", "#0b0f0d", 0.72)],
      ["apple-touch-icon.png", makeSquare(image, bounds, 180, primary, "#ffffff", 0.68)],
      ["icon-192.png", makeSquare(image, bounds, 192, primary, "#ffffff", 0.68)],
      ["icon-512.png", makeSquare(image, bounds, 512, primary, "#ffffff", 0.68)],
      ["icon-maskable-512.png", makeSquare(image, bounds, 512, primary, "#ffffff", 0.56)],
      ["og-image.png", makeOg(image, bounds, primary, accent)],
    ];
    const entries = await Promise.all(variants.map(async ([name, promise]) => [name, await promise] as const));
    return new Map<string, Blob>(entries);
  } finally { URL.revokeObjectURL(objectUrl); }
}

export function BrandPackageUploader({ currentLogo, primary, accent, onApplied }: { currentLogo: string | null; primary: string; accent: string; onApplied: (values: BrandValues) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const preview = useMemo(() => file ? URL.createObjectURL(file) : null, [file]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  async function apply() {
    if (!file) return;
    setBusy(true); setStatus("Generando 11 formatos…");
    try {
      const files = await createFiles(file, primary, accent);
      const targets = await getBrandPackageUploadTargets();
      const supabase = createClient();
      setStatus("Subiendo el paquete de marca…");
      await Promise.all(targets.map(async (target) => {
        const blob = files.get(target.filename);
        if (!blob) throw new Error(`Falta ${target.filename}.`);
        const { error } = await supabase.storage.from("site-assets").uploadToSignedUrl(target.path, target.token, blob, { contentType: "image/png" });
        if (error) throw error;
      }));
      const byName = Object.fromEntries(targets.map((target) => [target.filename, target.publicUrl]));
      const values = { logoHeaderUrl: byName["logo-white-640.png"], logoFooterUrl: byName["logo-white-1024.png"], faviconUrl: byName["favicon-32.png"] };
      setStatus("Publicando el paquete…");
      const result = await applyBrandPackage(values);
      if (result.error) throw new Error(result.error);
      onApplied(values); setStatus("Paquete aplicado: logos, favicons, iconos y tarjeta social."); setFile(null);
    } catch (error) { setStatus(error instanceof Error ? error.message : "No se pudo aplicar el paquete."); }
    finally { setBusy(false); }
  }

  return (
    <div className="grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
      <div className="flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-[var(--gn-palette-2)] p-4">
        <Image src={preview ?? currentLogo ?? "/brand/lobos/logo-white-640.png"} alt="Vista previa del logo" width={640} height={640} unoptimized={Boolean(preview)} className="h-full w-full object-contain" />
      </div>
      <div>
        <div className="flex items-center gap-2"><PackageCheck className="h-5 w-5 text-[var(--gn-palette-1)]" /><h3 className="font-bold text-[var(--gn-palette-3)]">Carga única de marca</h3></div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--gn-palette-5)]">Selecciona un PNG transparente. El sistema genera y publica automáticamente logos claro/oscuro, favicons, iconos móviles y la imagen para compartir en redes.</p>
        <input ref={inputRef} type="file" accept="image/png" className="sr-only" onChange={(event) => { const selected = event.target.files?.[0] ?? null; setFile(selected); setStatus(null); }} />
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-[#d9ded9] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--gn-palette-3)]"><ImageUp className="h-4 w-4" />Seleccionar PNG</button>
          <button type="button" onClick={apply} disabled={!file || busy} className="gn-button disabled:cursor-not-allowed disabled:opacity-45">{busy ? "Procesando…" : "Generar y aplicar todo"}</button>
        </div>
        {file ? <p className="mt-2 text-xs text-[var(--gn-palette-5)]">{file.name} · {(file.size / 1024).toFixed(0)} KB</p> : null}
        {status ? <p className="mt-2 text-xs font-medium text-[var(--gn-palette-1)]" role="status">{status}</p> : null}
      </div>
    </div>
  );
}
