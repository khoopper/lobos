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
 * (12+ MP, several MB) becomes a couple hundred KB without a visible
 * quality drop, and never trips the Storage bucket's size limit. A file
 * already small and correctly sized is returned untouched.
 */
export async function prepareImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
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
