export const SITE_PALETTES = {
  lobos: {
    name: "Identidad Lobos",
    description: "Obsidiana, piedra y oro; inspirada en el logo del club.",
    colors: {
      1: "#222522",
      2: "#090b0a",
      3: "#1b1d1b",
      5: "#626761",
      7: "#d2a74f",
      8: "#f6f2e9",
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
    name: "Ruta Terracota",
    description: "Cobre, caoba y arena; cálida, exclusiva y aventurera.",
    colors: {
      1: "#7a3f2b",
      2: "#2f1e18",
      3: "#392820",
      5: "#71635c",
      7: "#e7c79f",
      8: "#faf5ee",
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
