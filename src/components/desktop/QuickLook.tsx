"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { DesktopItem } from "@/lib/desktop";
import { IconArt } from "./DesktopIcon";

/**
 * macOS Quick Look style preview: a large screenshot with a description
 * panel beside it (desktop) or beneath it (mobile). Triggered by Space on
 * a focused/selected icon, a right-click menu entry, or the info card's
 * Preview button — mirroring the Finder split between Enter (open) and
 * Space (preview).
 */
export function QuickLook({
  item,
  onOpen,
  onClose,
}: {
  item: DesktopItem;
  onOpen: (item: DesktopItem) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-window-in relative flex w-full max-w-3xl flex-col overflow-y-auto rounded-2xl bg-white/95 shadow-2xl shadow-black/50 ring-1 ring-black/10 backdrop-blur-2xl sm:max-h-[85vh] sm:flex-row sm:overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900/70 text-sm text-white shadow-md hover:bg-neutral-900/90"
        >
          ✕
        </button>

        <div className="relative flex h-[42vh] w-full shrink-0 items-center justify-center bg-neutral-950 sm:h-[560px] sm:max-h-[85vh] sm:w-auto sm:flex-1">
          {item.icon.type === "screenshot" ? (
            <Image
              src={item.icon.src}
              alt={item.name}
              width={1280}
              height={800}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <IconArt item={item} className="h-40 w-40 rounded-3xl" />
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-black/10 p-5 sm:h-[560px] sm:max-h-[85vh] sm:w-72 sm:overflow-y-auto sm:border-l sm:border-t-0">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold text-neutral-900">{item.name}</h2>
            <span className="shrink-0 rounded-full bg-neutral-900/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-700">
              {item.kind}
            </span>
          </div>
          {item.description && (
            <p className="text-sm leading-relaxed text-neutral-600">
              {item.description}
            </p>
          )}
          {item.url && (
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="mt-auto rounded-lg bg-neutral-900 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Open
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
