"use client";

import QuickEntry from "./QuickEntry";
import type { Throw } from "@/lib/types";

interface Props {
  dartNumber: number;
  onSelect: (t: Throw) => void;
  onClose: () => void;
}

export default function ThrowEditorModal({ dartNumber, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-6">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-2xl bg-neutral-900 p-6 sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Edit Dart {dartNumber}</h2>
          <button
            onClick={onClose}
            aria-label="Close editor"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-300"
          >
            ×
          </button>
        </div>
        <QuickEntry
          onThrow={(t) => {
            onSelect(t);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
