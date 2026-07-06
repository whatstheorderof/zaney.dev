"use client";

import type { DesktopItem } from "@/lib/desktop";
import { useDraggable } from "./useDraggable";

/**
 * Grey glass card shown on single click/tap, before an item is opened.
 * Draggable, closable, and clamped to the viewport in CSS so it stays
 * on screen even when the window resizes (e.g. entering fullscreen).
 */
export function IconInfoCard({
  item,
  x,
  y,
  onOpen,
  onClose,
}: {
  item: DesktopItem;
  x: number;
  y: number;
  onOpen: (item: DesktopItem) => void;
  onClose: () => void;
}) {
  const { offset, handlers } = useDraggable();

  return (
    <div
      // Explicit width here: translate(-50%) resolves against this element,
      // and without a set width a fixed div shrink-to-fits at the viewport
      // edge, which would skew the centering math.
      className="fixed z-50 w-64"
      style={{
        left: `min(max(${x}px, 148px), calc(100vw - 148px))`,
        top: `max(${y - 12}px, 170px)`,
        // The centering translate lives here, away from any animation:
        // keyframes with fill-mode would override an animated transform.
        transform: `translate(calc(-50% + ${offset.x}px), calc(-100% + ${offset.y}px))`,
      }}
    >
      <div className="animate-menu-in">
        <div
          {...handlers}
          className="relative w-full touch-none rounded-2xl bg-neutral-600/40 px-4 py-3 text-white shadow-2xl shadow-black/40 ring-1 ring-white/25 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-sm font-semibold">
              {item.name}
            </p>
            <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/80">
              {item.kind}
            </span>
            <button
              type="button"
              onClick={onClose}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Close"
              className="-mr-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] leading-none text-white/80 hover:bg-white/30"
            >
              ✕
            </button>
          </div>
          {item.description && (
            <p className="mt-1 text-xs leading-relaxed text-white/85">
              {item.description}
            </p>
          )}
          <button
            type="button"
            onClick={() => onOpen(item)}
            onPointerDown={(e) => e.stopPropagation()}
            className="mt-2.5 w-full rounded-lg bg-white/90 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-white"
          >
            Open
          </button>
          <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-neutral-600/60" />
        </div>
      </div>
    </div>
  );
}
