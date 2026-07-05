"use client";

import { useEffect, useRef } from "react";

export type MenuEntry =
  | { type: "item"; label: string; onSelect: () => void }
  | { type: "separator" };

const MENU_WIDTH = 208;

export function ContextMenu({
  x,
  y,
  entries,
  onClose,
}: {
  x: number;
  y: number;
  entries: MenuEntry[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", onClose);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", onClose);
    };
  }, [onClose]);

  // Keep the menu inside the viewport
  const itemCount = entries.filter((e) => e.type === "item").length;
  const approxHeight = itemCount * 26 + (entries.length - itemCount) * 9 + 10;
  const left = Math.min(x, window.innerWidth - MENU_WIDTH - 8);
  const top = Math.min(y, window.innerHeight - approxHeight - 8);

  return (
    <div
      ref={ref}
      onContextMenu={(e) => e.preventDefault()}
      className="animate-menu-in fixed z-[60] rounded-lg border border-white/40 bg-white/80 p-1 text-[13px] text-neutral-900 shadow-2xl shadow-black/30 ring-1 ring-black/10 backdrop-blur-xl"
      style={{ left, top, width: MENU_WIDTH }}
    >
      {entries.map((entry, i) =>
        entry.type === "separator" ? (
          <div key={i} className="mx-2 my-1 h-px bg-black/10" />
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => {
              onClose();
              entry.onSelect();
            }}
            className="block w-full rounded-md px-2.5 py-1 text-left hover:bg-sky-500 hover:text-white"
          >
            {entry.label}
          </button>
        )
      )}
    </div>
  );
}
