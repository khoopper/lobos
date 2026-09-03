"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getSignedUploadUrl, type StorageBucket } from "@/lib/storage/actions";

export interface UploadedImage {
  url: string;
  width: number;
  height: number;
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      reject(new Error("No se pudo leer la imagen."));
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
}

export interface ImageUploaderProps {
  bucket: StorageBucket;
  /** Current image, shown as a preview before a new one is chosen. */
  value?: { url: string; width: number; height: number } | null;
  onChange: (image: UploadedImage) => void;
  label?: string;
  previewClassName?: string;
}

/**
 * Shared admin upload control: reads the file's real pixel dimensions client
 * side (needed for the NOT NULL image_w/image_h columns), gets a signed
 * upload URL from a role-gated Server Action, then PUTs the file straight to
 * Supabase Storage — never through a Server Action body.
 */
export function ImageUploader({ bucket, value, onChange, label, previewClassName }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const { width, height } = await readImageDimensions(file);
      const ext = file.name.split(".").pop() ?? "jpg";
      const { signedUrl, token, publicUrl } = await getSignedUploadUrl(bucket, ext);

      const supabase = createClient();
      const path = new URL(signedUrl).pathname.split(`/${bucket}/`)[1];
      const { error: uploadError } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file);
      if (uploadError) throw uploadError;

      onChange({ url: publicUrl, width, height });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label ? <span className="text-sm font-medium text-[var(--gn-palette-3)]">{label}</span> : null}
      {value ? (
        <Image
          src={value.url}
          alt=""
          width={value.width}
          height={value.height}
          className={previewClassName ?? "h-32 w-auto rounded-lg object-cover"}
        />
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
        className="text-sm text-[var(--gn-palette-5)]"
      />
      {uploading ? <span className="text-xs text-[var(--gn-palette-5)]">Subiendo…</span> : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
