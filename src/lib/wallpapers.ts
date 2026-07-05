export type Wallpaper = {
  id: string;
  name: string;
  className: string;
  /** Overall brightness, used to keep the wordmark and hint text readable. */
  tone: "light" | "dark";
};

export const wallpapers: Wallpaper[] = [
  { id: "graphite", name: "Graphite", className: "wallpaper-graphite", tone: "light" },
  { id: "space", name: "Deep Space", className: "wallpaper-space", tone: "dark" },
  { id: "sea", name: "Open Sea", className: "wallpaper-sea", tone: "dark" },
  { id: "aero", name: "Aero 2000", className: "wallpaper-aero", tone: "light" },
  { id: "sunset", name: "Sunset Drive", className: "wallpaper-sunset", tone: "light" },
];

export const defaultWallpaper = wallpapers[0];

export const WALLPAPER_STORAGE_KEY = "zaney-wallpaper";
