"use client";

import { useState } from "react";
import { nextZ, useDraggable } from "./useDraggable";

export function AboutWindow({ onClose }: { onClose: () => void }) {
  const [z, setZ] = useState(() => nextZ());
  const { offset, handlers } = useDraggable();

  return (
    <div
      data-window
      onPointerDownCapture={() => setZ(nextZ())}
      className="animate-window-in absolute left-1/2 top-[38%] w-[min(400px,88vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white/90 shadow-2xl shadow-black/40 ring-1 ring-black/15 backdrop-blur-xl"
      style={{
        marginLeft: offset.x,
        marginTop: offset.y,
        zIndex: z,
      }}
    >
      <div
        {...handlers}
        className="flex touch-none items-center gap-2 border-b border-black/10 bg-neutral-100/90 px-3 py-2"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/10 hover:brightness-90"
        />
        <span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-black/10" />
        <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/10" />
        <span className="ml-2 font-mono text-xs text-neutral-500">
          about.txt
        </span>
      </div>
      <div className="space-y-3 px-5 py-4 text-sm leading-relaxed text-neutral-800">
        <p className="text-base font-semibold">Hey, I&apos;m Zane ☻</p>
        <p>
          I make small daily games and other experiments for the web — sudoku,
          tarot, word chains, cubes, and whatever&apos;s next.
        </p>
        <p>
          This site is my desktop. Drag things around, double-click an icon to
          jump into a game.
        </p>
        <p className="text-neutral-500">
          Say hi —{" "}
          <a
            href="mailto:deathbyleisure@gmail.com"
            className="text-sky-600 underline underline-offset-2 hover:text-sky-500"
          >
            deathbyleisure@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
