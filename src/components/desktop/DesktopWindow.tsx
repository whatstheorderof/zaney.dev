"use client";

import { useEffect, useState } from "react";
import { nextZ, useDraggable } from "./useDraggable";

export function DesktopWindow({
  title,
  onClose,
  children,
  className = "",
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [z, setZ] = useState(() => nextZ());
  const { offset, handlers } = useDraggable();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      data-window
      onPointerDownCapture={() => setZ(nextZ())}
      className={`animate-window-in absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white/90 shadow-2xl shadow-black/40 ring-1 ring-black/15 backdrop-blur-xl ${className}`}
      style={{ marginLeft: offset.x, marginTop: offset.y, zIndex: z }}
    >
      <div
        {...handlers}
        className="flex touch-none items-center gap-2 border-b border-black/10 bg-neutral-100/90 px-3 py-2"
      >
        <button
          type="button"
          onClick={onClose}
          // Keep the title bar's drag handler from capturing the pointer,
          // which would swallow the click
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Close"
          className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/10 hover:brightness-90"
        />
        <span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-black/10" />
        <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/10" />
        <span className="ml-2 font-mono text-xs text-neutral-500">{title}</span>
      </div>
      {children}
    </div>
  );
}
