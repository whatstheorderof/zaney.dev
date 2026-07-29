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
    // A percentage/translate anchor (e.g. top-[38%] -translate-y-1/2) puts
    // the title bar off-screen with no way back once a window is tall
    // enough to hit its max-height — the offset is a fraction of the
    // viewport but the pull-back is a fraction of the (now large) window.
    // True flex centering has no such failure mode regardless of content
    // height, matching QuickLook/FolderView.
    <div
      className="pointer-events-none fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: z }}
    >
      <div
        data-window
        onPointerDownCapture={() => setZ(nextZ())}
        className={`animate-window-in pointer-events-auto flex max-h-[85vh] flex-col overflow-hidden rounded-xl bg-white/90 shadow-2xl shadow-black/40 ring-1 ring-black/15 backdrop-blur-xl ${className}`}
        style={{ marginLeft: offset.x, marginTop: offset.y }}
      >
        <div
          {...handlers}
          className="flex shrink-0 touch-none items-center gap-2 border-b border-black/10 bg-neutral-100/90 px-3 py-2"
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
        <div className="min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
