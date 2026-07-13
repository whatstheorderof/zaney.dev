"use client";

import { useCallback, useEffect, useState } from "react";
import {
  desktopItems as initialItems,
  dockItems,
  ICON_SIZE_STORAGE_KEY,
  ICON_SIZES,
  type DesktopItem,
  type IconSize,
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
import { FolderView } from "./FolderView";
import { IconInfoCard } from "./IconInfoCard";
import { MenuBar } from "./MenuBar";
import { MobilePages } from "./MobilePages";
import { QuickLook } from "./QuickLook";
import { WallpaperWindow } from "./WallpaperWindow";

const GROUPED_STORAGE_KEY = "zaney-grouped";

/** iPhone-style grouping: one folder per kind; about.txt stays loose. */
function deriveFolders(items: DesktopItem[]): DesktopItem[] {
  const apps = items.filter((i) => i.action !== "about");
  const loose = items.filter((i) => i.action === "about");
  const kinds = [...new Set(apps.map((i) => i.kind))].sort();
  const folders: DesktopItem[] = kinds.map((kind) => {
    const children = apps.filter((i) => i.kind === kind);
    return {
      id: `folder:${kind}`,
      name: kind,
      kind,
      description: `${children.length} ${children.length === 1 ? "item" : "items"}`,
      action: "folder",
      icon: { type: "folder", items: children },
      x: 50,
      y: 40,
    };
  });
  return [...folders, ...loose];
}

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

  const [iconSize, setIconSize] = useState<IconSize>("medium");
  const [info, setInfo] = useState<{ id: string; x: number; y: number } | null>(
    null
  );
  const [grouped, setGrouped] = useState(false);
  const [folderItems, setFolderItems] = useState<DesktopItem[] | null>(null);
  const [openFolderKind, setOpenFolderKind] = useState<string | null>(null);
  const [quickLookId, setQuickLookId] = useState<string | null>(null);

  // Restore saved settings (async so SSR markup stays deterministic)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const savedWallpaper = localStorage.getItem(WALLPAPER_STORAGE_KEY);
      if (savedWallpaper && wallpapers.some((w) => w.id === savedWallpaper)) {
        setWallpaperId(savedWallpaper);
      }
      const savedSize = localStorage.getItem(ICON_SIZE_STORAGE_KEY);
      if (savedSize && savedSize in ICON_SIZES) {
        setIconSize(savedSize as IconSize);
      }
      if (localStorage.getItem(GROUPED_STORAGE_KEY) === "true") {
        setFolderItems(gridLayout(deriveFolders(initialItems)));
        setGrouped(true);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const chooseWallpaper = useCallback((id: string) => {
    setWallpaperId(id);
    localStorage.setItem(WALLPAPER_STORAGE_KEY, id);
  }, []);

  const chooseIconSize = useCallback((size: IconSize) => {
    setIconSize(size);
    localStorage.setItem(ICON_SIZE_STORAGE_KEY, size);
  }, []);

  const wallpaper =
    wallpapers.find((w) => w.id === wallpaperId) ?? defaultWallpaper;

  const openItem = useCallback((item: DesktopItem) => {
    setInfo(null);
    if (item.action === "folder") {
      setOpenFolderKind(item.kind);
      return;
    }
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
      setInfo(null);
      const next = order ? [...items].sort(order) : items;
      setItems(gridLayout(next));
      if (grouped) setFolderItems(gridLayout(deriveFolders(next)));
      setLayoutKey((k) => k + 1);
    },
    [items, grouped]
  );

  const toggleGrouped = useCallback(() => {
    setInfo(null);
    setOpenFolderKind(null);
    if (grouped) {
      setGrouped(false);
      localStorage.setItem(GROUPED_STORAGE_KEY, "false");
    } else {
      setFolderItems(gridLayout(deriveFolders(items)));
      setGrouped(true);
      localStorage.setItem(GROUPED_STORAGE_KEY, "true");
    }
    setLayoutKey((k) => k + 1);
  }, [grouped, items]);

  /** Single click/tap: show the info card (folders open straight away).
   * The card clamps itself to the viewport in CSS. */
  const showInfo = useCallback((item: DesktopItem, rect: DOMRect) => {
    if (item.action === "folder") return;
    setInfo({ id: item.id, x: rect.left + rect.width / 2, y: rect.top });
  }, []);

  const openQuickLook = useCallback((item: DesktopItem) => {
    if (item.action === "folder") return;
    setInfo(null);
    setQuickLookId(item.id);
  }, []);

  /** Tap flow for mobile pages and open folders: info first, then open. */
  const handleIconTap = (item: DesktopItem, rect: DOMRect) => {
    if (item.action === "folder") {
      openItem(item);
      return;
    }
    if (info?.id === item.id) openItem(item);
    else showInfo(item, rect);
  };

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
    {
      type: "item",
      label: `${grouped ? "\u2713 " : " "}Group into Folders`,
      onSelect: toggleGrouped,
    },
  ];

  const displayItems = grouped && folderItems ? folderItems : items;
  const infoItem = info
    ? items.find((i) => i.id === info.id)
    : undefined;
  const quickLookItem = quickLookId
    ? items.find((i) => i.id === quickLookId)
    : undefined;

  const menuTarget = menu?.itemId
    ? items.find((i) => i.id === menu.itemId)
    : undefined;
  const menuEntries: MenuEntry[] = menuTarget
    ? [
        ...(menuTarget.icon.type === "screenshot"
          ? [
              {
                type: "item",
                label: "Quick Look",
                onSelect: () => openQuickLook(menuTarget),
              } as MenuEntry,
            ]
          : []),
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
        ...(["small", "medium", "large"] as const).map(
          (size): MenuEntry => ({
            type: "item",
            label: `${iconSize === size ? "✓ " : " "}${
              size[0].toUpperCase() + size.slice(1)
            } Icons`,
            onSelect: () => chooseIconSize(size),
          })
        ),
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
          if (e.target === e.currentTarget) {
            setSelectedId(null);
            setInfo(null);
          }
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

        {/* Free-form desktop for pointer devices / wide screens */}
        <div className="hidden sm:block">
          {displayItems.map((item, i) => (
            <DesktopIcon
              key={`${item.id}:${layoutKey}`}
              item={item}
              index={i}
              selected={selectedId === item.id}
              tilePx={ICON_SIZES[iconSize].tile}
              onSelect={setSelectedId}
              onOpen={openItem}
              onInfo={showInfo}
              onPress={() => setInfo(null)}
              onQuickLook={openQuickLook}
            />
          ))}
        </div>

        {/* iPhone-style swipeable pages on small screens */}
        <div className="absolute inset-x-0 bottom-28 top-9 sm:hidden">
          <MobilePages
            items={displayItems}
            iconSize={iconSize}
            tone={wallpaper.tone}
            onIconTap={handleIconTap}
          />
        </div>

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
          <span className="sm:hidden">
            tap an icon to open it · swipe for more
          </span>
          <span className="hidden sm:inline">
            double-click an icon to open it · organise via View or right-click
          </span>
        </p>
      )}

      <Dock items={dockItems} onOpen={openItem} />

      {openFolderKind && (
        <FolderView
          name={openFolderKind}
          items={items.filter(
            (i) => i.kind === openFolderKind && i.action !== "about"
          )}
          onIconTap={handleIconTap}
          onClose={() => {
            setOpenFolderKind(null);
            setInfo(null);
          }}
        />
      )}

      {infoItem && info && (
        <IconInfoCard
          item={infoItem}
          x={info.x}
          y={info.y}
          onOpen={openItem}
          onClose={() => setInfo(null)}
          onPreview={openQuickLook}
        />
      )}

      {quickLookItem && (
        <QuickLook
          item={quickLookItem}
          onOpen={(item) => {
            setQuickLookId(null);
            openItem(item);
          }}
          onClose={() => setQuickLookId(null)}
        />
      )}

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
