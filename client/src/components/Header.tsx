import { Wallet, Circle } from "lucide-react";

export function Header() {
  return (
    <nav className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Wallet size={18} className="text-white animate-bounce" />
        </div>
        <span className="text-lg font-bold tracking-tighter bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          VinZ-XpenZ
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50">
          <Circle size={8} className="fill-green-500 text-green-500 animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider hidden sm:inline">
            AI Live
          </span>
        </div>
      </div>
    </nav>
  );
}