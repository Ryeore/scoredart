"use client";

import { useMemo } from "react";
import { SECTOR_ORDER, RINGS, describeAnnularSector } from "@/lib/dartboardMath";

export const BOARD_SIZE = 400;
export const BOARD_CENTER = BOARD_SIZE / 2;
export const BOARD_RADIUS = 170;

const R = BOARD_RADIUS;

interface Sector {
  key: string;
  d: string;
  fill: string;
}

function buildSectors(): Sector[] {
  const sectors: Sector[] = [];

  SECTOR_ORDER.forEach((value, i) => {
    const start = i * 18 - 9;
    const end = i * 18 + 9;
    const dark = i % 2 === 0;
    const singleFill = dark ? "#0e1116" : "#e9e4d8";
    const wideFill = dark ? "#c8102e" : "#0b6e4f";

    sectors.push({
      key: `single-inner-${value}`,
      fill: singleFill,
      d: describeAnnularSector(BOARD_CENTER, BOARD_CENTER, R * RINGS.bullOuter, R * RINGS.tripleInner, start, end),
    });
    sectors.push({
      key: `triple-${value}`,
      fill: wideFill,
      d: describeAnnularSector(BOARD_CENTER, BOARD_CENTER, R * RINGS.tripleInner, R * RINGS.tripleOuter, start, end),
    });
    sectors.push({
      key: `single-outer-${value}`,
      fill: singleFill,
      d: describeAnnularSector(BOARD_CENTER, BOARD_CENTER, R * RINGS.tripleOuter, R * RINGS.doubleInner, start, end),
    });
    sectors.push({
      key: `double-${value}`,
      fill: wideFill,
      d: describeAnnularSector(BOARD_CENTER, BOARD_CENTER, R * RINGS.doubleInner, R * RINGS.doubleOuter, start, end),
    });
  });

  return sectors;
}

function labelPosition(index: number) {
  const angle = ((index * 18 - 90) * Math.PI) / 180;
  const labelRadius = R + 14;
  return {
    x: BOARD_CENTER + labelRadius * Math.cos(angle),
    y: BOARD_CENTER + labelRadius * Math.sin(angle),
  };
}

/** Pure visual board artwork, shared between the main board and the magnifier. */
export function BoardArt() {
  const sectors = useMemo(() => buildSectors(), []);

  return (
    <g>
      <circle cx={BOARD_CENTER} cy={BOARD_CENTER} r={R + 6} fill="#050505" />
      {sectors.map((s) => (
        <path key={s.key} d={s.d} fill={s.fill} stroke="#050505" strokeWidth={0.6} />
      ))}
      <circle cx={BOARD_CENTER} cy={BOARD_CENTER} r={R * RINGS.bullOuter} fill="#0b6e4f" stroke="#050505" strokeWidth={0.6} />
      <circle cx={BOARD_CENTER} cy={BOARD_CENTER} r={R * RINGS.bullInner} fill="#c8102e" stroke="#050505" strokeWidth={0.6} />
      {SECTOR_ORDER.map((value, i) => {
        const { x, y } = labelPosition(i);
        return (
          <text
            key={`label-${value}-${i}`}
            x={x}
            y={y}
            fill="#ededed"
            fontSize={14}
            fontWeight={600}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {value}
          </text>
        );
      })}
    </g>
  );
}
