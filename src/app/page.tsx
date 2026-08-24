import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">ScoreDart</h1>
        <p className="mt-2 text-sm text-neutral-400">Dart match score tracker</p>
      </div>
      <Link
        href="/setup"
        className="rounded-full bg-accent px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-accent/30 transition active:scale-95"
      >
        Start Game
      </Link>
    </main>
  );
}
