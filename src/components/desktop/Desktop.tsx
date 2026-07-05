"use client";

import { useCallback, useState } from "react";
import { desktopItems, dockItems, type DesktopItem } from "@/lib/desktop";
import { AboutWindow } from "./AboutWindow";
import { DesktopIcon } from "./DesktopIcon";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";

export function Desktop() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

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

  return (
    <div className="wallpaper relative h-svh w-full select-none overflow-hidden">
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

        {desktopItems.map((item, i) => (
          <DesktopIcon
            key={item.id}
            item={item}
            index={i}
            selected={selectedId === item.id}
            onSelect={setSelectedId}
            onOpen={openItem}
          />
        ))}

        {aboutOpen && <AboutWindow onClose={() => setAboutOpen(false)} />}
      </div>

      {!hasOpened && (
        <p className="pointer-events-none fixed inset-x-0 bottom-24 z-20 text-center text-xs font-medium text-neutral-700/60">
          double-click an icon to open it
        </p>
      )}

      <Dock items={dockItems} onOpen={openItem} />
    </div>
  );
}
