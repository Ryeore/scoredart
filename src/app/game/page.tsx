"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import DartBoard from "@/components/DartBoard";
import QuickEntry from "@/components/QuickEntry";
import Scoreboard from "@/components/Scoreboard";
import WinnerModal from "@/components/WinnerModal";
import HistoryModal from "@/components/HistoryModal";
import type { Throw } from "@/lib/types";

type InputMode = "board" | "quick";

export default function GamePage() {
  const router = useRouter();
  const { gameState, throwDart, undoThrow, confirmCurrentTurn, editThrow, startGame, endGame } = useGame();
  const [mode, setMode] = useState<InputMode>("board");
  const [showHistory, setShowHistory] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!gameState) router.replace("/setup");
  }, [gameState, router]);

  if (!gameState) return null;

  const winner = gameState.winnerIndex !== null ? gameState.players[gameState.winnerIndex] : null;
  const turnFull = gameState.currentTurnThrows.length >= 3;

  function handleThrow(t: Throw) {
    if (editingIndex !== null) {
      editThrow(editingIndex, t);
      setEditingIndex(null);
    } else {
      throwDart(t);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <Scoreboard
        gameState={gameState}
        onUndo={undoThrow}
        onConfirm={confirmCurrentTurn}
        editingIndex={editingIndex}
        onToggleEditThrow={(i) => setEditingIndex((prev) => (prev === i ? null : i))}
      />

      {gameState.message && (
        <p className="text-center text-sm font-semibold text-accent">{gameState.message}</p>
      )}

      <button
        onClick={() => setShowHistory(true)}
        className="rounded-lg bg-neutral-800 py-2 text-sm font-semibold text-neutral-300 transition active:scale-95"
      >
        View Throw History
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode("board")}
          className={`rounded-lg py-2 text-sm font-semibold transition ${
            mode === "board" ? "bg-accent text-white" : "bg-neutral-800 text-neutral-300"
          }`}
        >
          Dart Board
        </button>
        <button
          onClick={() => setMode("quick")}
          className={`rounded-lg py-2 text-sm font-semibold transition ${
            mode === "quick" ? "bg-accent text-white" : "bg-neutral-800 text-neutral-300"
          }`}
        >
          Quick Entry
        </button>
      </div>

      {mode === "board" ? (
        <DartBoard onThrow={handleThrow} disabled={!!winner || (turnFull && editingIndex === null)} />
      ) : (
        <QuickEntry onThrow={handleThrow} disabled={!!winner || (turnFull && editingIndex === null)} />
      )}

      {showHistory && (
        <HistoryModal players={gameState.players} onClose={() => setShowHistory(false)} />
      )}

      {winner && (
        <WinnerModal
          winnerName={winner.name}
          onRematch={() => startGame(gameState.settings)}
          onMainMenu={() => {
            endGame();
            router.push("/");
          }}
        />
      )}
    </main>
  );
}
