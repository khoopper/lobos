export const SITE_PALETTES = {
  lobos: {
    name: "Identidad Lobos",
    description: "Piedra, medianoche y oro viejo — la manada que viaja al amparo de la noche.",
    colors: {
      1: "#2b2f3a",
      2: "#14161d",
      3: "#20222b",
      5: "#666a75",
      7: "#c9a15a",
      8: "#f3f1ea",
    },
  },
  original: {
    name: "Original",
    description: "Verde profundo y crema; la combinación actual del sitio.",
    colors: {
      1: "#235652",
      2: "#183f3c",
      3: "#373435",
      5: "#686c6a",
      7: "#f4f2be",
      8: "#fbfaec",
    },
  },
  volcan: {
    name: "Ruta Volcánica",
    description: "Basalto, ceniza y brasa — inspirada en los volcanes de El Salvador.",
    colors: {
      1: "#3a2620",
      2: "#1c1210",
      3: "#2a1c17",
      5: "#79695f",
      7: "#e8722c",
      8: "#f7f0e6",
    },
  },
} as const;

export type SitePaletteId = keyof typeof SITE_PALETTES;
export type SitePaletteColors = (typeof SITE_PALETTES)[SitePaletteId]["colors"];
const PALETTE_KEYS = [1, 2, 3, 5, 7, 8] as const;

export function findSitePaletteId(colors: Record<keyof SitePaletteColors, string>): SitePaletteId | null {
  for (const [id, preset] of Object.entries(SITE_PALETTES) as [SitePaletteId, (typeof SITE_PALETTES)[SitePaletteId]][]) {
    if (PALETTE_KEYS.every((key) => preset.colors[key].toLowerCase() === colors[key].toLowerCase())) {
      return id;
    }
  }
  return null;
}
