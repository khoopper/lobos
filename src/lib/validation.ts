import { z } from "zod";

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const assetUrlSchema = z.string().min(1).refine(
  (value) => value.startsWith("/") || isHttpUrl(value),
  "Usa una ruta del sitio o una URL http(s) válida.",
);

export const optionalAssetUrlSchema = assetUrlSchema.nullable();

export const linkTargetSchema = z.string().min(1).refine(
  (value) => value.startsWith("/") || value.startsWith("#") || value.startsWith("tel:") || value.startsWith("mailto:") || isHttpUrl(value),
  "Usa una ruta, ancla, teléfono, correo o URL válida.",
);

export const optionalHttpUrlSchema = z.string().refine(
  (value) => value === "" || isHttpUrl(value),
  "La URL debe comenzar con http:// o https://.",
);
