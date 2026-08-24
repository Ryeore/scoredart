"use client";

import type { GameState } from "@/lib/types";

interface Props {
  gameState: GameState;
  onUndo: () => void;
}

export default function Scoreboard({ gameState, onUndo }: Props) {
  const { players, currentPlayerIndex, currentTurnThrows, winnerIndex } = gameState;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {players.map((p, i) => {
          const isActive = i === currentPlayerIndex && winnerIndex === null;
          return (
            <div
              key={i}
              className={`flex items-center justify-between rounded-lg px-4 py-3 transition ${
                isActive ? "bg-accent/20 ring-2 ring-accent" : "bg-neutral-800"
              }`}
            >
              <span className="truncate text-sm font-medium text-neutral-200">{p.name}</span>
              <span className="text-2xl font-bold tabular-nums">{p.score}</span>
            </div>
          );
        })}
      </div>

      {winnerIndex === null && (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-neutral-900 px-4 py-2">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="flex h-9 w-14 items-center justify-center rounded-md bg-neutral-800 text-sm font-semibold text-neutral-200"
              >
                {currentTurnThrows[i]?.label ?? ""}
              </span>
            ))}
          </div>
          <button
            onClick={onUndo}
            disabled={currentTurnThrows.length === 0}
            className="rounded-md bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-300 disabled:opacity-40"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
