export const SITE_PALETTES = {
  lobos: {
    name: "Identidad Lobos",
    description: "Negro, bosque y fuego; basada en el logo y la identidad de Instagram.",
    colors: {
      1: "#1b3a2d",
      2: "#0b0f0d",
      3: "#17201a",
      5: "#556057",
      7: "#e5b45f",
      8: "#f5f3eb",
    },
  },
  original: {
    name: "Original",
    description: "La combinación verde y crema que utiliza actualmente el sitio.",
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
    name: "Bosque volcánico",
    description: "Verde mineral, carbón y arena para una apariencia natural y sobria.",
    colors: {
      1: "#385344",
      2: "#1c2822",
      3: "#26332c",
      5: "#606a63",
      7: "#dfc995",
      8: "#f7f4ec",
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
