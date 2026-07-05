import { allGames } from "./games";

export type DesktopIconArt =
  | { type: "screenshot"; src: string }
  | { type: "glyph"; glyph: string; className: string };

export type DesktopItem = {
  id: string;
  name: string;
  /** What the item is, used by "Sort by Type" (e.g. Puzzle, Word, Books). */
  kind: string;
  /** External url opened on double-click (or mailto:). Omitted for in-page items like the About window. */
  url?: string;
  action?: "about";
  icon: DesktopIconArt;
  /** Initial position on the desktop, in % of the viewport. */
  x: number;
  y: number;
};

const positions: Record<string, [number, number]> = {
  "zaney-sudoku": [9, 16],
  "zaney-tarot": [22, 50],
  "zaney-cube": [38, 24],
  "zaney-word": [55, 58],
  "zaney-links": [70, 17],
  "say-more": [83, 42],
  "zaney-tales": [13, 60],
  "zaney-search": [34, 64],
};

export const gameItems: DesktopItem[] = allGames.map((game) => {
  const [x, y] = positions[game.slug] ?? [50, 40];
  return {
    id: game.slug,
    name: game.name,
    kind: game.category,
    url: game.url,
    icon: { type: "screenshot" as const, src: `/screenshots/${game.slug}.png` },
    x,
    y,
  };
});

export const aboutItem: DesktopItem = {
  id: "about",
  name: "about.txt",
  kind: "Text File",
  action: "about",
  icon: { type: "glyph", glyph: "☻", className: "bg-neutral-900 text-white" },
  x: 87,
  y: 68,
};

export const mailItem: DesktopItem = {
  id: "mail",
  name: "Say hi",
  kind: "Contact",
  url: "mailto:deathbyleisure@gmail.com",
  icon: { type: "glyph", glyph: "✉", className: "bg-sky-500 text-white" },
  x: 0,
  y: 0,
};

export const desktopItems: DesktopItem[] = [...gameItems, aboutItem];

export const dockItems: DesktopItem[] = [...gameItems, aboutItem, mailItem];
