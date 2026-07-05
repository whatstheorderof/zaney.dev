"use client";

import { useCallback, useRef, useState } from "react";

const DRAG_THRESHOLD = 4;

type DragState = {
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
  moved: boolean;
};

/**
 * Pointer-event based dragging. Returns a px offset to apply as a transform,
 * plus handlers to spread on the draggable element. Taps (presses that never
 * exceed the drag threshold) are reported through `onTap`. Changing `resetKey`
 * snaps the offset back to zero (used when the desktop re-arranges icons).
 */
export function useDraggable(onTap?: () => void, resetKey?: unknown) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const state = useRef<DragState | null>(null);

  const [lastResetKey, setLastResetKey] = useState(resetKey);
  if (lastResetKey !== resetKey) {
    setLastResetKey(resetKey);
    setOffset({ x: 0, y: 0 });
  }

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Pointer may no longer be active (or is synthetic); drag still works
        // as long as the pointer stays over the element.
      }
      state.current = {
        startX: e.clientX,
        startY: e.clientY,
        baseX: offset.x,
        baseY: offset.y,
        moved: false,
      };
    },
    [offset]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const s = state.current;
    if (!s) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (!s.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      s.moved = true;
      setDragging(true);
    }
    if (s.moved) setOffset({ x: s.baseX + dx, y: s.baseY + dy });
  }, []);

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLElement>, cancelled: boolean) => {
      const s = state.current;
      if (!s) return;
      state.current = null;
      setDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Capture may never have been acquired; nothing to release.
      }
      if (!s.moved && !cancelled) onTap?.();
    },
    [onTap]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => endDrag(e, false),
    [endDrag]
  );
  const onPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLElement>) => endDrag(e, true),
    [endDrag]
  );

  return {
    offset,
    dragging,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  };
}

let zTop = 5;
/** Shared z-order counter so the last-touched icon/window sits on top. */
export function nextZ() {
  return ++zTop;
}
