"use client";

import { useState } from "react";
import type { DesktopItem } from "@/lib/desktop";
import { IconArt } from "./DesktopIcon";

const BASE_SIZE = 52;
const GAP = 10;
const MAX_BOOST = 0.5;
const INFLUENCE = 130;

type Tooltip = { name: string; x: number; y: number };

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
  // Single tooltip, driven by state so only one ever shows. Anchored with
  // fixed viewport coords and rendered outside the dock, which clips
  // vertically (overflow-x-auto) and is inside a transformed container.
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

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
    <>
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="relative rounded-lg bg-neutral-800/90 px-2.5 py-1 shadow-lg shadow-black/30 backdrop-blur-sm">
            <span className="block max-w-40 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-white">
              {tooltip.name}
            </span>
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-neutral-800/90" />
          </div>
        </div>
      )}
      <div
        data-dock
        className="animate-dock-in pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center"
      >
        <div
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMouseX(e.clientX - (rect.left + rect.width / 2));
          }}
          onMouseLeave={() => {
            setMouseX(null);
            setTooltip(null);
          }}
          className="pointer-events-auto flex max-w-[calc(100vw-1rem)] items-end overflow-x-auto rounded-3xl border border-white/50 bg-white/40 px-3 py-2.5 shadow-2xl shadow-black/25 backdrop-blur-xl"
          style={{ gap: GAP }}
        >
          {items.map((item, i) => {
            const scale = scaleFor(i);
            const size = BASE_SIZE * scale;
            const showTip = (e: React.MouseEvent<HTMLButtonElement>) => {
              const r = e.currentTarget.getBoundingClientRect();
              setTooltip({ name: item.name, x: r.left + r.width / 2, y: r.top });
            };
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpen(item)}
                onMouseEnter={showTip}
                onMouseMove={showTip}
                className={`relative block shrink-0 ${
                  mouseX === null ? "transition-[width,height] duration-200" : ""
                }`}
                style={{ width: size, height: size }}
                aria-label={item.name}
              >
                <span className="block h-full w-full overflow-hidden rounded-xl ring-1 ring-black/10">
                  <IconArt item={item} className="h-full w-full" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
