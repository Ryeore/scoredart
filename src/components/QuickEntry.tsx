"use client";

import { useState } from "react";
import type { Throw } from "@/lib/types";

interface Props {
  onThrow: (t: Throw) => void;
  disabled?: boolean;
}

const NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);

export default function QuickEntry({ onThrow, disabled }: Props) {
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);

  function throwNumber(value: number) {
    const points = value * multiplier;
    const label = multiplier === 3 ? `T${value}` : multiplier === 2 ? `D${value}` : `${value}`;
    onThrow({ value, multiplier, points, label });
    setMultiplier(1);
  }

  function throwSpecial(value: 25 | 0, mult: 1 | 2) {
    const points = value * mult;
    const label = value === 0 ? "Miss" : mult === 2 ? "Bull" : "25";
    onThrow({ value, multiplier: mult, points, label });
    setMultiplier(1);
  }

  return (
    <div className={`flex flex-col gap-3 ${disabled ? "pointer-events-none opacity-50" : ""}`}>
      <div className="grid grid-cols-3 gap-2">
        {([1, 2, 3] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMultiplier(m)}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              multiplier === m ? "bg-accent text-white" : "bg-neutral-800 text-neutral-300"
            }`}
          >
            {m === 1 ? "Single" : m === 2 ? "Double x2" : "Triple x3"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {NUMBERS.map((n) => (
          <button
            key={n}
            onClick={() => throwNumber(n)}
            className="rounded-lg bg-neutral-800 py-3 text-base font-semibold text-neutral-100 transition active:scale-95 active:bg-accent"
          >
            {n}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => throwSpecial(25, 1)}
          className="rounded-lg bg-neutral-800 py-3 text-sm font-semibold text-neutral-100 active:scale-95 active:bg-accent"
        >
          25
        </button>
        <button
          onClick={() => throwSpecial(25, 2)}
          className="rounded-lg bg-neutral-800 py-3 text-sm font-semibold text-neutral-100 active:scale-95 active:bg-accent"
        >
          Bull (50)
        </button>
        <button
          onClick={() => throwSpecial(0, 1)}
          className="rounded-lg bg-neutral-800 py-3 text-sm font-semibold text-neutral-100 active:scale-95 active:bg-accent"
        >
          Miss
        </button>
      </div>
    </div>
  );
}
