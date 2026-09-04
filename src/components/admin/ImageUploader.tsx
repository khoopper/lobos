"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageUp, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSignedUploadUrl, type StorageBucket } from "@/lib/storage/actions";

export interface UploadedImage { url: string; width: number; height: number }

/** Long edge cap and the size budget the compressor aims for — well under
 * the `media` bucket's 8MB limit (supabase/migrations/0001_init.sql) and
 * small enough to load fast on a phone connection. */
const MAX_DIMENSION = 2400;
const TARGET_BYTES = 3 * 1024 * 1024;
const QUALITY_STEPS = [0.85, 0.75, 0.65, 0.55, 0.45];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => { resolve(image); URL.revokeObjectURL(objectUrl); };
    image.onerror = () => { reject(new Error("No se pudo leer la imagen.")); URL.revokeObjectURL(objectUrl); };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

/**
 * Downscales anything above MAX_DIMENSION and re-encodes as JPEG at the
 * highest quality that fits TARGET_BYTES — a photo straight off a phone
 * (12+ MP, HEIC-as-JPEG, several MB) becomes a couple hundred KB without a
 * visible quality drop, and never trips the Storage bucket's size limit.
 * A file already small and correctly sized is uploaded untouched.
 */
async function prepareImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  if (scale === 1 && file.size <= TARGET_BYTES) {
    return { blob: file, width, height };
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("El navegador no pudo procesar la imagen.");
  context.drawImage(image, 0, 0, width, height);

  for (const quality of QUALITY_STEPS) {
    const blob = await canvasToBlob(canvas, quality);
    if (blob && (blob.size <= TARGET_BYTES || quality === QUALITY_STEPS[QUALITY_STEPS.length - 1])) {
      return { blob, width, height };
    }
  }
  return { blob: file, width, height };
}

export interface ImageUploaderProps {
  bucket: StorageBucket;
  value?: { url: string; width: number; height: number } | null;
  onChange: (image: UploadedImage) => void;
  label?: string;
  previewClassName?: string;
}

export function ImageUploader({ bucket, value, onChange, label, previewClassName }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true); setError(null);
    try {
      const { blob, width, height } = await prepareImage(file);
      const ext = blob.type === "image/jpeg" ? "jpg" : (file.name.split(".").pop() ?? "jpg");
      const { token, path, publicUrl } = await getSignedUploadUrl(bucket, ext);
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, blob, { contentType: blob.type || "image/jpeg" });
      if (uploadError) throw uploadError;
      onChange({ url: publicUrl, width, height });
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No se pudo subir la imagen."); }
    finally { setUploading(false); }
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {label ? <span className="text-xs font-bold text-[var(--gn-palette-3)]">{label}</span> : null}
      {value ? (
        <Image src={value.url} alt="" width={value.width} height={value.height} className={previewClassName ?? "h-28 w-full rounded-xl object-cover"} />
      ) : (
        // Same sizing classes as the loaded-image preview (aspect ratio, width,
        // radius) plus the box treatment those alone don't provide — passing
        // previewClassName straight through here used to drop the "Sin imagen"
        // placeholder onto one unstyled line with no border or centering.
        <div className={`flex items-center justify-center border border-dashed border-[#cfd6d0] bg-[#f8f9f7] text-xs text-[var(--gn-palette-5)] ${previewClassName ?? "h-28 w-full rounded-xl"}`}>
          Sin imagen
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleFile(file); }} />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#d9ded9] bg-white px-3 py-2 text-xs font-semibold text-[var(--gn-palette-3)] disabled:opacity-50">
        {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}{uploading ? "Subiendo…" : value ? "Cambiar imagen" : "Seleccionar imagen"}
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
