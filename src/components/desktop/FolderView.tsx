"use client";

import { useEffect } from "react";
import type { DesktopItem } from "@/lib/desktop";
import { IconArt } from "./DesktopIcon";

/** iPhone-style opened folder: a glass panel with the folder's icons. */
export function FolderView({
  name,
  items,
  onIconTap,
  onClose,
}: {
  name: string;
  items: DesktopItem[];
  onIconTap: (item: DesktopItem, rect: DOMRect) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/25 backdrop-blur-[2px]"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-window-in w-[min(430px,92vw)] rounded-3xl bg-neutral-600/40 p-5 shadow-2xl shadow-black/40 ring-1 ring-white/25 backdrop-blur-2xl">
        <p className="mb-4 text-center text-sm font-semibold text-white/90">
          {name}
        </p>
        <div className="grid grid-cols-3 gap-x-2 gap-y-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={(e) =>
                onIconTap(item, e.currentTarget.getBoundingClientRect())
              }
              className="flex flex-col items-center gap-1.5"
            >
              <span className="h-16 w-16 overflow-hidden rounded-2xl shadow-lg shadow-black/25 ring-1 ring-black/10">
                <IconArt item={item} className="h-full w-full" />
              </span>
              <span className="max-w-full truncate text-xs font-medium text-white/90">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
