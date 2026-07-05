"use client";

import { useEffect, useState } from "react";

export function MenuBar({
  onAbout,
  onView,
}: {
  onAbout: () => void;
  /** Opens the organise menu anchored at (x, y) — the mobile-friendly path. */
  onView: (x: number, y: number) => void;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const raf = requestAnimationFrame(update);
    const timer = setInterval(update, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-7 items-center gap-5 border-b border-white/30 bg-white/35 px-3 text-[13px] text-neutral-900 backdrop-blur-md">
      <span className="font-semibold tracking-tight">☻ zaney.dev</span>
      <button
        type="button"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onView(rect.left, rect.bottom + 6);
        }}
        className="hover:text-neutral-600"
      >
        View
      </button>
      <button
        type="button"
        onClick={onAbout}
        className="hidden hover:text-neutral-600 sm:block"
      >
        About
      </button>
      <a
        href="mailto:deathbyleisure@gmail.com"
        className="hidden hover:text-neutral-600 sm:block"
      >
        Contact
      </a>
      <span className="ml-auto tabular-nums text-neutral-800">
        {now?.toLocaleString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </span>
    </header>
  );
}
