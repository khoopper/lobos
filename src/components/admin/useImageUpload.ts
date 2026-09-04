"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSignedUploadUrl, type StorageBucket } from "@/lib/storage/actions";
import { prepareImage } from "./prepare-image";

export interface UploadedImage { url: string; width: number; height: number }

/** Shared compress-then-upload flow behind both ImageUploader (replace an
 * existing slot) and AddImageTile (append a new one). */
export function useImageUpload(bucket: StorageBucket) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<UploadedImage | null> {
    setUploading(true);
    setError(null);
    try {
      const { blob, width, height } = await prepareImage(file);
      const ext = blob.type === "image/jpeg" ? "jpg" : (file.name.split(".").pop() ?? "jpg");
      const { token, path, publicUrl } = await getSignedUploadUrl(bucket, ext);
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, blob, { contentType: blob.type || "image/jpeg" });
      if (uploadError) throw uploadError;
      return { url: publicUrl, width, height };
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo subir la imagen.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { uploading, error, upload };
}
