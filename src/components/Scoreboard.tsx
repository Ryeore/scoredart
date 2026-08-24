"use client";

import type { GameState } from "@/lib/types";

interface Props {
  gameState: GameState;
  onUndo: () => void;
  onConfirm: () => void;
  onEditThrow: (index: number) => void;
}

export default function Scoreboard({ gameState, onUndo, onConfirm, onEditThrow }: Props) {
  const { players, currentPlayerIndex, currentTurnThrows, winnerIndex } = gameState;
  const pendingSum = currentTurnThrows.reduce((sum, t) => sum + t.points, 0);

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
              <span className="flex items-baseline gap-2">
                {isActive && currentTurnThrows.length > 0 && (
                  <span className="text-xs text-neutral-400">→ {p.score - pendingSum}</span>
                )}
                <span className="text-2xl font-bold tabular-nums">{p.score}</span>
              </span>
            </div>
          );
        })}
      </div>

      {winnerIndex === null && (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-neutral-900 px-4 py-2">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => {
              const t = currentTurnThrows[i];
              return (
                <button
                  key={i}
                  onClick={() => t && onEditThrow(i)}
                  disabled={!t}
                  className="flex h-9 w-14 items-center justify-center rounded-md bg-neutral-800 text-sm font-semibold text-neutral-200 transition disabled:opacity-60 enabled:hover:ring-2 enabled:hover:ring-accent"
                >
                  {t?.label ?? ""}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onUndo}
              disabled={currentTurnThrows.length === 0}
              className="rounded-md bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-300 disabled:opacity-40"
            >
              Undo
            </button>
            <button
              onClick={onConfirm}
              disabled={currentTurnThrows.length === 0}
              className="rounded-md bg-accent px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

