"use client";

import { useState } from "react";
import type { DesktopItem } from "@/lib/desktop";
import { IconArt } from "./DesktopIcon";

const BASE_SIZE = 52;
const GAP = 10;
const MAX_BOOST = 0.5;
const INFLUENCE = 130;

export function Dock({
  items,
  onOpen,
}: {
  items: DesktopItem[];
  onOpen: (item: DesktopItem) => void;
}) {
  // Mouse x relative to the dock's horizontal center. Base item centers are
  // derived from index math (not the DOM) so magnification stays stable while
  // item widths change — the dock is flex-centered, so its center is fixed.
  const [mouseX, setMouseX] = useState<number | null>(null);

  const step = BASE_SIZE + GAP;
  const mid = ((items.length - 1) * step) / 2;

  const scaleFor = (index: number) => {
    if (mouseX === null) return 1;
    const center = index * step - mid;
    const distance = Math.abs(mouseX - center);
    const influence = Math.max(0, 1 - (distance / INFLUENCE) ** 2);
    return 1 + MAX_BOOST * influence;
  };

  return (
    <div className="animate-dock-in pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center">
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMouseX(e.clientX - (rect.left + rect.width / 2));
        }}
        onMouseLeave={() => setMouseX(null)}
        className="pointer-events-auto flex max-w-[calc(100vw-1rem)] items-end overflow-x-auto rounded-3xl border border-white/50 bg-white/40 px-3 py-2.5 shadow-2xl shadow-black/25 backdrop-blur-xl"
        style={{ gap: GAP }}
      >
        {items.map((item, i) => {
          const scale = scaleFor(i);
          const size = BASE_SIZE * scale;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpen(item)}
              className={`group relative block shrink-0 ${
                mouseX === null ? "transition-[width,height] duration-200" : ""
              }`}
              style={{ width: size, height: size }}
              aria-label={item.name}
            >
              <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900/85 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                {item.name}
              </span>
              <span className="block h-full w-full overflow-hidden rounded-xl ring-1 ring-black/10">
                <IconArt item={item} className="h-full w-full" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
