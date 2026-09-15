import type { Point } from "../types";

export const isTapWithinSlop = (start: Point, end: Point, slop: number): boolean => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  return Math.hypot(deltaX, deltaY) <= slop;
};
