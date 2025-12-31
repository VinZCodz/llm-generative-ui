"use client";
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { USE_CASES } from "@/config/useCases";
import { SuggestionCard } from "@/components/SuggestionCard";
import { siteConfig } from "@/config/site";

export default function Page() {
  const [messages, setMessages] = useState([{ role: "assistant", content: `Welcome! How can I help you today?` }]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Robust Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Fires every time messages array changes

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMsg = { role: "user", content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");

    // Mock an agentic response after a delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I've processed that request. Your Drizzle database has been updated.",
        toolCall: true
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <Header messageCount={messages.length}/>

      <main id="chat-scroll-area" className="flex-1 overflow-y-auto pt-8 pb-32">
        <div className="max-w-3xl mx-auto px-4">

          {/* Show Use Cases only if there are no user messages yet */}
          {messages.length <= 1 && (
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-zinc-100 mb-2">Master your money with {siteConfig.name}</h2>
                <p className="text-zinc-500 text-sm">Click a case below or type your own expense to get started.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {USE_CASES.map((useCase, idx) => (
                  <SuggestionCard
                    key={idx}
                    {...useCase}
                    onClick={(text) => setInput(text)}
                  />
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <ChatBubble key={i} message={m} />
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-10 pb-6">
        <div className="max-w-3xl mx-auto px-4">
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleSend}
          />
        </div>
      </div>
    </div>
  );
}