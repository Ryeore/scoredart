"use client";

import type { PlayerState } from "@/lib/types";

interface Props {
  players: PlayerState[];
  onClose: () => void;
}

export default function HistoryModal({ players, onClose }: Props) {
  const maxTurns = Math.max(0, ...players.map((p) => p.turns.length));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-6">
      <div className="flex max-h-[80vh] w-full max-w-md flex-col gap-4 rounded-t-2xl bg-neutral-900 p-6 sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Throw History</h2>
          <button
            onClick={onClose}
            aria-label="Close history"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-300"
          >
            ×
          </button>
        </div>

        {maxTurns === 0 ? (
          <p className="text-sm text-neutral-400">No throws yet.</p>
        ) : (
          <div className="flex flex-col gap-4 overflow-y-auto">
            {Array.from({ length: maxTurns }).map((_, round) => (
              <div key={round} className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Round {round + 1}
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {players.map((p, pi) => {
                    const turn = p.turns[round];
                    if (!turn) return null;
                    const total = turn.throws.reduce((sum, t) => sum + t.points, 0);
                    return (
                      <div key={pi} className="rounded-lg bg-neutral-800 px-3 py-2">
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span className="truncate">{p.name}</span>
                          <span className={turn.busted ? "font-semibold text-accent" : ""}>
                            {turn.busted ? "Bust" : `-${total}`}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-neutral-200">
                            {turn.throws.map((t) => t.label).join("  ")}
                          </span>
                          <span className="text-sm font-bold tabular-nums">{turn.scoreAfter}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
