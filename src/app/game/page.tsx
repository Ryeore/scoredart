"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import DartBoard from "@/components/DartBoard";
import QuickEntry from "@/components/QuickEntry";
import Scoreboard from "@/components/Scoreboard";
import WinnerModal from "@/components/WinnerModal";

type InputMode = "board" | "quick";

export default function GamePage() {
  const router = useRouter();
  const { gameState, throwDart, undoThrow, startGame, endGame } = useGame();
  const [mode, setMode] = useState<InputMode>("board");

  useEffect(() => {
    if (!gameState) router.replace("/setup");
  }, [gameState, router]);

  if (!gameState) return null;

  const winner = gameState.winnerIndex !== null ? gameState.players[gameState.winnerIndex] : null;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <Scoreboard gameState={gameState} onUndo={undoThrow} />

      {gameState.message && (
        <p className="text-center text-sm font-semibold text-accent">{gameState.message}</p>
      )}

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
        <DartBoard onThrow={throwDart} disabled={!!winner} />
      ) : (
        <QuickEntry onThrow={throwDart} disabled={!!winner} />
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
