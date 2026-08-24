"use client";

import { useRef, useState } from "react";
import { BoardArt, BOARD_SIZE, BOARD_CENTER, BOARD_RADIUS } from "./BoardArt";
import { getHitFromPoint, hitToThrow } from "@/lib/dartboardMath";
import type { Throw } from "@/lib/types";

const ZOOM = 3;
const MAGNIFIER_PX = 160;

interface Props {
  onThrow: (t: Throw) => void;
  disabled?: boolean;
}

function clientToSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: BOARD_CENTER, y: BOARD_CENTER };
  const point = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
  return { x: point.x, y: point.y };
}

export default function DartBoard({ onThrow, disabled }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgPoint, setSvgPoint] = useState<{ x: number; y: number } | null>(null);
  const [clientPoint, setClientPoint] = useState<{ x: number; y: number } | null>(null);
  const [pressing, setPressing] = useState(false);

  function updatePosition(clientX: number, clientY: number) {
    if (!svgRef.current) return;
    setSvgPoint(clientToSvgPoint(svgRef.current, clientX, clientY));
    setClientPoint({ x: clientX, y: clientY });
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (disabled) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setPressing(true);
    updatePosition(e.clientX, e.clientY);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!pressing) return;
    updatePosition(e.clientX, e.clientY);
  }

  function commitThrow() {
    if (svgPoint) {
      const hit = getHitFromPoint(svgPoint.x - BOARD_CENTER, svgPoint.y - BOARD_CENTER, BOARD_RADIUS);
      onThrow(hitToThrow(hit));
    }
    setPressing(false);
    setSvgPoint(null);
    setClientPoint(null);
  }

  function cancelThrow() {
    setPressing(false);
    setSvgPoint(null);
    setClientPoint(null);
  }

  const magnifierViewSize = (BOARD_RADIUS * 2.3) / ZOOM;

  return (
    <div className="relative mx-auto w-full max-w-[420px] select-none touch-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
        className={`w-full ${disabled ? "opacity-50" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={commitThrow}
        onPointerCancel={cancelThrow}
      >
        <BoardArt />
        {svgPoint && (
          <circle cx={svgPoint.x} cy={svgPoint.y} r={4} fill="#fff" stroke="#000" strokeWidth={1} />
        )}
      </svg>

      {pressing && svgPoint && clientPoint && (
        <div
          className="pointer-events-none fixed z-50 overflow-hidden rounded-full border-4 border-white shadow-2xl"
          style={{
            width: MAGNIFIER_PX,
            height: MAGNIFIER_PX,
            left: clientPoint.x - MAGNIFIER_PX / 2,
            top: clientPoint.y - MAGNIFIER_PX - 50,
          }}
        >
          <svg
            viewBox={`${svgPoint.x - magnifierViewSize / 2} ${svgPoint.y - magnifierViewSize / 2} ${magnifierViewSize} ${magnifierViewSize}`}
            width={MAGNIFIER_PX}
            height={MAGNIFIER_PX}
          >
            <BoardArt />
            <line x1={svgPoint.x - 10} y1={svgPoint.y} x2={svgPoint.x + 10} y2={svgPoint.y} stroke="#fff" strokeWidth={1} />
            <line x1={svgPoint.x} y1={svgPoint.y - 10} x2={svgPoint.x} y2={svgPoint.y + 10} stroke="#fff" strokeWidth={1} />
          </svg>
        </div>
      )}
    </div>
  );
}
