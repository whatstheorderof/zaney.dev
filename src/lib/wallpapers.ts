export type Wallpaper = {
  id: string;
  name: string;
  className: string;
  /** Overall brightness, used to keep the wordmark and hint text readable. */
  tone: "light" | "dark";
  /** Present for moving wallpapers: autoplaying looped video + a static poster for the picker. */
  video?: { src: string; poster: string };
};

export const wallpapers: Wallpaper[] = [
  { id: "graphite", name: "Graphite", className: "wallpaper-graphite", tone: "light" },
  { id: "space", name: "Deep Space", className: "wallpaper-space", tone: "dark" },
  { id: "sea", name: "Open Sea", className: "wallpaper-sea", tone: "dark" },
  { id: "aero", name: "Aero 2000", className: "wallpaper-aero", tone: "light" },
  { id: "sunset", name: "Sunset Drive", className: "wallpaper-sunset", tone: "light" },
  { id: "grass", name: "Fresh Cut", className: "wallpaper-grass", tone: "dark" },
  { id: "aurora", name: "Aurora", className: "wallpaper-aurora", tone: "dark" },
  { id: "candy", name: "Candy Floss", className: "wallpaper-candy", tone: "light" },
  { id: "city", name: "City Lights", className: "wallpaper-city", tone: "dark" },
  { id: "dune", name: "Sand Dune", className: "wallpaper-dune", tone: "light" },
  {
    id: "silk-drift",
    name: "Silk Drift",
    className: "wallpaper-silk-drift",
    tone: "light",
    video: {
      src: "/wallpapers/silk-drift.mp4",
      poster: "/wallpapers/poster-silk-drift.jpg",
    },
  },
  {
    id: "satin-wave",
    name: "Satin Wave",
    className: "wallpaper-satin-wave",
    tone: "light",
    video: {
      src: "/wallpapers/satin-wave.mp4",
      poster: "/wallpapers/poster-satin-wave.jpg",
    },
  },
  {
    id: "opal-flow",
    name: "Opal Flow",
    className: "wallpaper-opal-flow",
    tone: "light",
    video: {
      src: "/wallpapers/opal-flow.mp4",
      poster: "/wallpapers/poster-opal-flow.jpg",
    },
  },
  {
    id: "ink-bloom",
    name: "Ink Bloom",
    className: "wallpaper-ink-bloom",
    tone: "dark",
    video: {
      src: "/wallpapers/ink-bloom.mp4",
      poster: "/wallpapers/poster-ink-bloom.jpg",
    },
  },
  {
    id: "sherbet-haze",
    name: "Sherbet Haze",
    className: "wallpaper-sherbet-haze",
    tone: "light",
    video: {
      src: "/wallpapers/sherbet-haze.mp4",
      poster: "/wallpapers/poster-sherbet-haze.jpg",
    },
  },
  {
    id: "smoke-veil",
    name: "Smoke Veil",
    className: "wallpaper-smoke-veil",
    tone: "dark",
    video: {
      src: "/wallpapers/smoke-veil.mp4",
      poster: "/wallpapers/poster-smoke-veil.jpg",
    },
  },
];

export const defaultWallpaper = wallpapers[0];

export const WALLPAPER_STORAGE_KEY = "zaney-wallpaper";
