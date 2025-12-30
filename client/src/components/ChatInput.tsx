"use client";
import { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ChatInput({ input, setInput, onSubmit, isLoading }: any) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Solid background to hide chat content behind input */}
      <div className="bg-zinc-950/80 backdrop-blur-xl px-4 py-6">
        <form
          onSubmit={onSubmit}
          className="max-w-3xl mx-auto relative flex items-end bg-white border border-zinc-200 shadow-2xl rounded-2xl p-2 transition-all focus-within:ring-2 ring-blue-500/20"
        >
          {/* Visible text and auto-growing textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter spend. Get insights. Stay liquid!"
            // Track, analyze, manage..
            className="flex-1 bg-transparent px-4 py-3 text-[14px] text-zinc-900 outline-none placeholder:text-zinc-400 resize-none max-h-30"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="mb-1 p-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 disabled:opacity-30 transition-all flex-shrink-0"
          >
            <ArrowUp size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
}
