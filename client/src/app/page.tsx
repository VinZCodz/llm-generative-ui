"use client";
import { useState } from "react";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";

export default function Page() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your agent. Ask me anything." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Header */}
      <nav className="w-full max-w-3xl flex justify-between items-center py-6 px-4 border-b border-zinc-100">
        <span className="font-bold tracking-tight text-zinc-900">AGENT.OS</span>
        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
      </nav>

      {/* Message List */}
      <main className="w-full max-w-3xl flex-1 pt-12 pb-32 px-4">
        {messages.map((m, i) => (
          <ChatBubble key={i} message={m} />
        ))}
      </main>

      {/* Floating Input */}
      <ChatInput input={input} setInput={setInput} onSubmit={handleSend} />
    </div>
  );
}