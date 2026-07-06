"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { DesktopItem } from "@/lib/desktop";
import { nextZ, useDraggable } from "./useDraggable";

const DOUBLE_TAP_MS = 400;

export function IconArt({
  item,
  className,
}: {
  item: DesktopItem;
  className: string;
}) {
  if (item.icon.type === "screenshot") {
    return (
      <Image
        src={item.icon.src}
        alt={item.name}
        width={128}
        height={128}
        draggable={false}
        className={`${className} object-cover object-top`}
      />
    );
  }
  return (
    <div
      className={`${className} flex items-center justify-center text-3xl leading-none ${item.icon.className}`}
    >
      {item.icon.glyph}
    </div>
  );
}

export function DesktopIcon({
  item,
  index,
  selected,
  tilePx = 64,
  onSelect,
  onOpen,
}: {
  item: DesktopItem;
  index: number;
  selected: boolean;
  /** Icon tile size in px, from the user's icon-size setting. */
  tilePx?: number;
  onSelect: (id: string) => void;
  onOpen: (item: DesktopItem) => void;
}) {
  const [z, setZ] = useState(1);
  const lastTap = useRef(0);

  const { offset, dragging, handlers } = useDraggable(() => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      lastTap.current = 0;
      onOpen(item);
    } else {
      lastTap.current = now;
    }
    onSelect(item.id);
  });

  return (
    <div
      {...handlers}
      data-icon-id={item.id}
      onPointerDownCapture={() => {
        setZ(nextZ());
        onSelect(item.id);
      }}
      className="absolute flex w-24 touch-none flex-col items-center"
      style={{
        // Clamp so initial positions never hang off narrow viewports
        left: `min(${item.x}%, calc(100% - 6.5rem))`,
        top: `${item.y}%`,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        zIndex: z,
      }}
    >
      <div
        className="animate-pop-in"
        style={{ animationDelay: `${150 + index * 90}ms` }}
      >
        <div
          className="flex flex-col items-center gap-1.5"
          style={{
            animation: "icon-float 5.5s ease-in-out infinite",
            animationDelay: `${-index * 0.9}s`,
            animationPlayState: dragging ? "paused" : "running",
          }}
        >
        <div
          style={{ width: tilePx, height: tilePx }}
          className={`overflow-hidden rounded-2xl shadow-lg shadow-black/25 ring-1 transition-transform duration-200 ${
            selected ? "ring-2 ring-white/90" : "ring-black/10"
          } ${dragging ? "scale-105 opacity-80" : ""}`}
        >
          <IconArt item={item} className="h-full w-full" />
        </div>
        <span
          className={`max-w-full rounded-md px-2 py-0.5 text-center text-xs font-medium backdrop-blur-sm ${
            selected
              ? "bg-sky-600/90 text-white"
              : "bg-white/45 text-neutral-800"
          }`}
        >
          {item.name}
        </span>
        </div>
      </div>
    </div>
  );
}
