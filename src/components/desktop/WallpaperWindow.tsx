"use client";

import Image from "next/image";
import { wallpapers } from "@/lib/wallpapers";
import { DesktopWindow } from "./DesktopWindow";

export function WallpaperWindow({
  current,
  onSelect,
  onClose,
}: {
  current: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <DesktopWindow
      title="wallpapers"
      onClose={onClose}
      className="w-[min(430px,92vw)]"
    >
      <div className="grid grid-cols-2 gap-3 px-4 py-4">
        {wallpapers.map((wp) => (
          <button
            key={wp.id}
            type="button"
            onClick={() => onSelect(wp.id)}
            className="group text-left"
          >
            <span
              className={`relative block aspect-video w-full overflow-hidden rounded-lg ring-2 transition ${
                current === wp.id
                  ? "ring-sky-500"
                  : "ring-black/10 group-hover:ring-black/30"
              } ${wp.className}`}
            >
              {wp.video && (
                <Image
                  src={wp.video.poster}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              )}
              <span
                className={`absolute inset-0 flex items-center justify-center text-[11px] font-black tracking-tighter ${
                  wp.tone === "dark"
                    ? "text-white/40"
                    : "mix-blend-overlay text-white/70"
                }`}
              >
                zaney.dev
              </span>
              {wp.video && (
                <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/55 text-[8px] text-white">
                  ▶
                </span>
              )}
            </span>
            <span className="mt-1 block text-xs font-medium text-neutral-700">
              {wp.name}
            </span>
          </button>
        ))}
      </div>
    </DesktopWindow>
  );
}
