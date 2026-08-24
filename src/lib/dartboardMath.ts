import type { Throw } from "./types";

/** Clockwise sector order starting at top (value 20). */
export const SECTOR_ORDER = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
];

// Radii as a fraction of the outer double-ring radius, based on standard
// dartboard measurements (double outer ring radius = 170mm).
export const RINGS = {
  bullInner: 6.35 / 170,
  bullOuter: 16 / 170,
  tripleInner: 99 / 170,
  tripleOuter: 107 / 170,
  doubleInner: 162 / 170,
  doubleOuter: 1,
};

export interface BoardHit {
  value: number;
  multiplier: 1 | 2 | 3;
}

/** angle in degrees, 0 = top (value 20 sector center), clockwise positive */
export function angleFromCenter(dx: number, dy: number): number {
  const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return (deg + 360) % 360;
}

/**
 * Given a click position relative to the board center and the outer
 * double-ring pixel radius, return the segment that was hit.
 */
export function getHitFromPoint(dx: number, dy: number, outerRadiusPx: number): BoardHit {
  const r = Math.sqrt(dx * dx + dy * dy) / outerRadiusPx;

  if (r > RINGS.doubleOuter) {
    return { value: 0, multiplier: 1 };
  }
  if (r <= RINGS.bullInner) {
    return { value: 25, multiplier: 2 };
  }
  if (r <= RINGS.bullOuter) {
    return { value: 25, multiplier: 1 };
  }

  const angle = angleFromCenter(dx, dy);
  const shifted = (angle + 9) % 360;
  const index = Math.floor(shifted / 18) % 20;
  const value = SECTOR_ORDER[index];

  if (r <= RINGS.tripleInner) return { value, multiplier: 1 };
  if (r <= RINGS.tripleOuter) return { value, multiplier: 3 };
  if (r <= RINGS.doubleInner) return { value, multiplier: 1 };
  return { value, multiplier: 2 };
}

export function hitToThrow(hit: BoardHit): Throw {
  const points = hit.value * hit.multiplier;
  let label: string;
  if (hit.value === 0) label = "Miss";
  else if (hit.value === 25) label = hit.multiplier === 2 ? "Bull" : "25";
  else label = hit.multiplier === 3 ? `T${hit.value}` : hit.multiplier === 2 ? `D${hit.value}` : `${hit.value}`;

  return { value: hit.value, multiplier: hit.multiplier, points, label };
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

/** SVG path for an annular sector (a ring slice) between two angles. */
export function describeAnnularSector(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngle: number,
  endAngle: number
): string {
  const p1 = polar(cx, cy, rOuter, startAngle);
  const p2 = polar(cx, cy, rOuter, endAngle);
  const p3 = polar(cx, cy, rInner, endAngle);
  const p4 = polar(cx, cy, rInner, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  if (rInner <= 0) {
    return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
  }

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    "Z",
  ].join(" ");
}
