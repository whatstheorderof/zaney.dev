"use client";

import { DesktopWindow } from "./DesktopWindow";

export function AboutWindow({ onClose }: { onClose: () => void }) {
  return (
    <DesktopWindow title="about.txt" onClose={onClose} className="w-[min(400px,88vw)]">
      <div className="space-y-3 px-5 py-4 text-sm leading-relaxed text-neutral-800">
        <p className="text-base font-semibold">Hey, I&apos;m Zane ☻</p>
        <p>
          I make small daily games and other experiments for the web — sudoku,
          tarot, word chains, cubes, and whatever&apos;s next.
        </p>
        <p>
          This site is my desktop. Drag things around, double-click an icon to
          jump into a game, tool or project.
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
    </DesktopWindow>
  );
}
