"use client";
import { ArrowUp } from "lucide-react";

export function ChatInput({ input, setInput, onSubmit }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#fafafa] via-[#fafafa] to-transparent">
      <form 
        onSubmit={onSubmit}
        className="max-w-3xl mx-auto relative flex items-center bg-white border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-2 focus-within:border-zinc-400 transition-all"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="How can I help you today?"
          className="flex-1 bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-zinc-400"
        />
        <button className="p-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors">
          <ArrowUp size={20} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
