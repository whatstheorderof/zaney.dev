"use client";

import type { DesktopItem } from "@/lib/desktop";

/** Grey glass card shown on single click/tap, before an item is opened. */
export function IconInfoCard({
  item,
  x,
  y,
  onOpen,
}: {
  item: DesktopItem;
  x: number;
  y: number;
  onOpen: (item: DesktopItem) => void;
}) {
  return (
    <div
      className="animate-menu-in pointer-events-none fixed z-50"
      style={{ left: x, top: y - 12, transform: "translate(-50%, -100%)" }}
    >
      <div className="pointer-events-auto relative w-64 rounded-2xl bg-neutral-600/40 px-4 py-3 text-white shadow-2xl shadow-black/40 ring-1 ring-white/25 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold">{item.name}</p>
          <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/80">
            {item.kind}
          </span>
        </div>
        {item.description && (
          <p className="mt-1 text-xs leading-relaxed text-white/85">
            {item.description}
          </p>
        )}
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="mt-2.5 w-full rounded-lg bg-white/90 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-white"
        >
          Open
        </button>
        <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-neutral-600/60" />
      </div>
    </div>
  );
}
