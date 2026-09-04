"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageUp, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSignedUploadUrl, type StorageBucket } from "@/lib/storage/actions";

export interface UploadedImage { url: string; width: number; height: number }

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => { resolve({ width: image.naturalWidth, height: image.naturalHeight }); URL.revokeObjectURL(objectUrl); };
    image.onerror = () => { reject(new Error("No se pudo leer la imagen.")); URL.revokeObjectURL(objectUrl); };
    image.src = objectUrl;
  });
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
      const { width, height } = await readImageDimensions(file);
      const ext = file.name.split(".").pop() ?? "jpg";
      const { token, path, publicUrl } = await getSignedUploadUrl(bucket, ext);
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file, { contentType: file.type });
      if (uploadError) throw uploadError;
      onChange({ url: publicUrl, width, height });
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No se pudo subir la imagen."); }
    finally { setUploading(false); }
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {label ? <span className="text-xs font-bold text-[var(--gn-palette-3)]">{label}</span> : null}
      {value ? <Image src={value.url} alt="" width={value.width} height={value.height} className={previewClassName ?? "h-28 w-full rounded-xl object-cover"} /> : <div className={previewClassName ?? "flex h-28 w-full items-center justify-center rounded-xl border border-dashed border-[#cfd6d0] bg-[#f8f9f7] text-xs text-[var(--gn-palette-5)]"}>Sin imagen</div>}
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleFile(file); }} />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#d9ded9] bg-white px-3 py-2 text-xs font-semibold text-[var(--gn-palette-3)] disabled:opacity-50">
        {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}{uploading ? "Subiendo…" : value ? "Cambiar imagen" : "Seleccionar imagen"}
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
