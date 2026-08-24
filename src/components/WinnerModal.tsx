"use client";

interface Props {
  winnerName: string;
  onRematch: () => void;
  onMainMenu: () => void;
}

export default function WinnerModal({ winnerName, onRematch, onMainMenu }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl bg-neutral-900 p-8 text-center">
        <div>
          <p className="text-sm text-neutral-400">Winner</p>
          <h2 className="text-3xl font-bold">{winnerName}</h2>
        </div>
        <div className="flex w-full flex-col gap-3">
          <button
            onClick={onRematch}
            className="rounded-full bg-accent py-3 text-base font-semibold text-white active:scale-95"
          >
            Rematch
          </button>
          <button
            onClick={onMainMenu}
            className="rounded-full bg-neutral-800 py-3 text-base font-semibold text-neutral-200 active:scale-95"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
