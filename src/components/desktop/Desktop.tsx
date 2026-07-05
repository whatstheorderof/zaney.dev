"use client";

import { useCallback, useEffect, useState } from "react";
import {
  desktopItems as initialItems,
  dockItems,
  type DesktopItem,
} from "@/lib/desktop";
import {
  defaultWallpaper,
  wallpapers,
  WALLPAPER_STORAGE_KEY,
} from "@/lib/wallpapers";
import { AboutWindow } from "./AboutWindow";
import { ContextMenu, type MenuEntry } from "./ContextMenu";
import { DesktopIcon } from "./DesktopIcon";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { WallpaperWindow } from "./WallpaperWindow";

/**
 * macOS-style arrangement: columns from the top-right corner, filling down.
 * Sized from the real viewport so columns never collide on narrow screens.
 * Only called from user actions, so `window` is safe here.
 */
function gridLayout(items: DesktopItem[]): DesktopItem[] {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const COL_W = 112; // icon width (96px) + gutter
  const ROW_H = 132; // icon + label + gutter
  const TOP = 70; // below the menu bar
  const BOTTOM = 120; // above the dock
  const RIGHT = 120; // inset of the first column from the right edge
  const rows = Math.max(1, Math.floor((h - TOP - BOTTOM) / ROW_H));
  return items.map((item, i) => ({
    ...item,
    x: (Math.max(8, w - RIGHT - Math.floor(i / rows) * COL_W) / w) * 100,
    y: ((TOP + (i % rows) * ROW_H) / h) * 100,
  }));
}

type MenuState = { x: number; y: number; itemId: string | null };

export function Desktop() {
  const [items, setItems] = useState(initialItems);
  // Bumped on every arrange: remounts icons at their new spots so the pop-in
  // entrance replays. (CSS-transitioning icon positions here hit a browser
  // bug where transitions froze at their first frame on some icons.)
  const [layoutKey, setLayoutKey] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [wallpaperOpen, setWallpaperOpen] = useState(false);
  const [wallpaperId, setWallpaperId] = useState(defaultWallpaper.id);
  const [hasOpened, setHasOpened] = useState(false);
  const [menu, setMenu] = useState<MenuState | null>(null);

  // Restore the saved wallpaper (async so SSR markup stays deterministic)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const saved = localStorage.getItem(WALLPAPER_STORAGE_KEY);
      if (saved && wallpapers.some((w) => w.id === saved)) {
        setWallpaperId(saved);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const chooseWallpaper = useCallback((id: string) => {
    setWallpaperId(id);
    localStorage.setItem(WALLPAPER_STORAGE_KEY, id);
  }, []);

  const wallpaper =
    wallpapers.find((w) => w.id === wallpaperId) ?? defaultWallpaper;

  const openItem = useCallback((item: DesktopItem) => {
    setHasOpened(true);
    if (item.action === "about") {
      setAboutOpen(true);
      return;
    }
    if (!item.url) return;
    if (item.url.startsWith("mailto:")) {
      window.location.href = item.url;
    } else {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  }, []);

  const arrange = useCallback(
    (order?: (a: DesktopItem, b: DesktopItem) => number) => {
      const next = order ? [...items].sort(order) : items;
      setItems(gridLayout(next));
      setLayoutKey((k) => k + 1);
    },
    [items]
  );

  const onContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Let the browser's own menu handle text inside windows
    if (target.closest("[data-window]")) return;
    e.preventDefault();
    // No custom menu for the dock or menu bar
    if (target.closest("[data-dock], header")) return;
    const itemId =
      target.closest("[data-icon-id]")?.getAttribute("data-icon-id") ?? null;
    if (itemId) setSelectedId(itemId);
    setMenu({ x: e.clientX, y: e.clientY, itemId });
  };

  const organizeEntries: MenuEntry[] = [
    { type: "item", label: "Clean Up", onSelect: () => arrange() },
    {
      type: "item",
      label: "Sort by Name",
      onSelect: () => arrange((a, b) => a.name.localeCompare(b.name)),
    },
    {
      type: "item",
      label: "Sort by Type",
      onSelect: () =>
        arrange(
          (a, b) =>
            a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name)
        ),
    },
  ];

  const menuTarget = menu?.itemId
    ? items.find((i) => i.id === menu.itemId)
    : undefined;
  const menuEntries: MenuEntry[] = menuTarget
    ? [
        {
          type: "item",
          label: `Open “${menuTarget.name}”`,
          onSelect: () => openItem(menuTarget),
        },
        { type: "separator" },
        ...organizeEntries,
      ]
    : [
        ...organizeEntries,
        { type: "separator" },
        {
          type: "item",
          label: "Change Wallpaper…",
          onSelect: () => setWallpaperOpen(true),
        },
        {
          type: "item",
          label: "About This Desktop",
          onSelect: () => setAboutOpen(true),
        },
      ];

  return (
    <div
      className={`wallpaper ${wallpaper.className} relative h-svh w-full select-none overflow-hidden`}
      onContextMenu={onContextMenu}
    >
      <MenuBar
        onAbout={() => setAboutOpen(true)}
        onView={(x, y) => setMenu({ x, y, itemId: null })}
      />

      {/* Desktop surface: icons + windows live in their own stacking context */}
      <div
        className="absolute inset-0 z-10"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setSelectedId(null);
        }}
      >
        {/* Faint wordmark baked into the wallpaper */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className={`text-[13vw] font-black tracking-tighter ${
              wallpaper.tone === "dark"
                ? "text-white/15"
                : "mix-blend-overlay text-white/30"
            }`}
          >
            zaney.dev
          </span>
        </div>

        {items.map((item, i) => (
          <DesktopIcon
            key={`${item.id}:${layoutKey}`}
            item={item}
            index={i}
            selected={selectedId === item.id}
            onSelect={setSelectedId}
            onOpen={openItem}
          />
        ))}

        {aboutOpen && <AboutWindow onClose={() => setAboutOpen(false)} />}
        {wallpaperOpen && (
          <WallpaperWindow
            current={wallpaperId}
            onSelect={chooseWallpaper}
            onClose={() => setWallpaperOpen(false)}
          />
        )}
      </div>

      {!hasOpened && (
        <p
          className={`pointer-events-none fixed inset-x-0 bottom-24 z-20 text-center text-xs font-medium ${
            wallpaper.tone === "dark" ? "text-white/60" : "text-neutral-700/60"
          }`}
        >
          double-click an icon to open it · organise via View or right-click
        </p>
      )}

      <Dock items={dockItems} onOpen={openItem} />

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          entries={menuEntries}
          onClose={() => setMenu(null)}
        />
      )}
    </div>
  );
}
