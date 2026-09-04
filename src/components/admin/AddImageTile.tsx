"use client";

import { useRef } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { useImageUpload, type UploadedImage } from "./useImageUpload";
import type { StorageBucket } from "@/lib/storage/actions";

interface AddImageTileProps {
  bucket: StorageBucket;
  onAdded: (image: UploadedImage) => void;
  className?: string;
  label?: string;
}

/** A tile that opens the file picker the moment it's clicked — unlike
 * ImageUploader, there is no intermediate empty slot to fill in afterward. */
export function AddImageTile({ bucket, onAdded, className, label = "Agregar" }: AddImageTileProps) {
  const { uploading, error, upload } = useImageUpload(bucket);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    const image = await upload(file);
    if (image) onAdded(image);
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={uploading}
        className="sr-only"
        onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleFile(file); event.target.value = ""; }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={className ?? "flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#cfd6d0] bg-[#f8f9f7] text-[11px] font-semibold text-[var(--gn-palette-5)] transition-colors hover:border-[var(--gn-palette-1)] hover:text-[var(--gn-palette-1)] disabled:opacity-60"}
      >
        {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {uploading ? "Subiendo…" : label}
      </button>
      {error ? <span className="text-[11px] text-red-600">{error}</span> : null}
    </div>
  );
}
