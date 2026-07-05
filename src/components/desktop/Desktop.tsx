"use client";

import { useCallback, useState } from "react";
import {
  desktopItems as initialItems,
  dockItems,
  type DesktopItem,
} from "@/lib/desktop";
import { AboutWindow } from "./AboutWindow";
import { ContextMenu, type MenuEntry } from "./ContextMenu";
import { DesktopIcon } from "./DesktopIcon";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";

/** macOS-style arrangement: columns from the top-right corner, filling down. */
function gridLayout(items: DesktopItem[]): DesktopItem[] {
  const ROWS = 4;
  return items.map((item, i) => ({
    ...item,
    x: 88 - Math.floor(i / ROWS) * 10,
    y: 12 + (i % ROWS) * 19,
  }));
}

type MenuState = { x: number; y: number; itemId: string | null };

export function Desktop() {
  const [items, setItems] = useState(initialItems);
  const [layoutKey, setLayoutKey] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [menu, setMenu] = useState<MenuState | null>(null);

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
      setItems((prev) => gridLayout(order ? [...prev].sort(order) : prev));
      setLayoutKey((k) => k + 1);
    },
    []
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
          label: "About This Desktop",
          onSelect: () => setAboutOpen(true),
        },
      ];

  return (
    <div
      className="wallpaper relative h-svh w-full select-none overflow-hidden"
      onContextMenu={onContextMenu}
    >
      <MenuBar onAbout={() => setAboutOpen(true)} />

      {/* Desktop surface: icons + windows live in their own stacking context */}
      <div
        className="absolute inset-0 z-10"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setSelectedId(null);
        }}
      >
        {/* Faint wordmark baked into the wallpaper */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-[13vw] font-black tracking-tighter text-white/30 mix-blend-overlay">
            zaney.dev
          </span>
        </div>

        {items.map((item, i) => (
          <DesktopIcon
            key={item.id}
            item={item}
            index={i}
            selected={selectedId === item.id}
            resetKey={layoutKey}
            onSelect={setSelectedId}
            onOpen={openItem}
          />
        ))}

        {aboutOpen && <AboutWindow onClose={() => setAboutOpen(false)} />}
      </div>

      {!hasOpened && (
        <p className="pointer-events-none fixed inset-x-0 bottom-24 z-20 text-center text-xs font-medium text-neutral-700/60">
          double-click an icon to open it · right-click to organise
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
