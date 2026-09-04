export const SITE_PALETTES = {
  lobos: {
    name: "Lobos Esmeralda",
    description: "Bosque profundo, negro y oro; la identidad principal del club.",
    colors: {
      1: "#16382c",
      2: "#07130f",
      3: "#14231c",
      5: "#596860",
      7: "#d7b56d",
      8: "#f7f3ea",
    },
  },
  original: {
    name: "Expedición Zafiro",
    description: "Azul océano, tinta y champaña; elegante y contemporánea.",
    colors: {
      1: "#174a67",
      2: "#0b1f2a",
      3: "#142c3a",
      5: "#596c77",
      7: "#dbc58f",
      8: "#f4f7f8",
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
