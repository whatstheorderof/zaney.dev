"use client";

import { useEffect, useRef, useState } from "react";
import { ICON_SIZES, type DesktopItem, type IconSize } from "@/lib/desktop";
import { IconArt } from "./DesktopIcon";

/**
 * iPhone-style home screen for small viewports: a centred grid of icons,
 * split into horizontally swipeable pages (scroll-snap) with page dots.
 * A single tap opens — no dragging, so swiping stays conflict-free.
 */
export function MobilePages({
  items,
  iconSize,
  tone,
  onOpen,
}: {
  items: DesktopItem[];
  iconSize: IconSize;
  tone: "light" | "dark";
  onOpen: (item: DesktopItem) => void;
}) {
  const cfg = ICON_SIZES[iconSize];
  const pagerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(4);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const measure = () => {
      const h = pagerRef.current?.clientHeight;
      if (h) setRows(Math.max(2, Math.floor((h - 16) / cfg.cellH)));
    };
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [cfg.cellH]);

  const perPage = cfg.cols * rows;
  const pages: DesktopItem[][] = [];
  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }

  return (
    <div className="flex h-full flex-col">
      <div
        ref={pagerRef}
        onScroll={(e) =>
          setPage(
            Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth)
          )
        }
        className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
      >
        {pages.map((pageItems, pi) => (
          <div
            key={pi}
            className="grid w-full shrink-0 snap-center content-start justify-items-center px-3 pt-4"
            style={{
              gridTemplateColumns: `repeat(${cfg.cols}, minmax(0, 1fr))`,
              gridAutoRows: cfg.cellH,
            }}
          >
            {pageItems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpen(item)}
                className="animate-pop-in flex w-full flex-col items-center gap-1.5 px-1"
                style={{ animationDelay: `${100 + i * 40}ms` }}
              >
                <span
                  className="overflow-hidden rounded-2xl shadow-lg shadow-black/25 ring-1 ring-black/10"
                  style={{ width: cfg.tile, height: cfg.tile }}
                >
                  <IconArt item={item} className="h-full w-full" />
                </span>
                <span className="max-w-full truncate rounded-md bg-white/45 px-2 py-0.5 text-xs font-medium text-neutral-800 backdrop-blur-sm">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
      {pages.length > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-1.5 pb-1 pt-2">
          {pages.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                tone === "dark"
                  ? i === page
                    ? "bg-white/80"
                    : "bg-white/30"
                  : i === page
                    ? "bg-neutral-800/70"
                    : "bg-neutral-800/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
