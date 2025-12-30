"use client";
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";

const MOCK_HISTORY = [
  { role: "assistant", content: "Welcome back! I'm Vinz, your expense agent. How can I help you today?" },
  { role: "user", content: "Track $45 for Dinner at 'The Grill'" },
  { 
    role: "assistant", 
    content: "Got it. I've recorded that expense for you.",
    toolCall: true // This triggers the little green badge we made
  },
  { role: "user", content: "What is my total so far?" },
  { role: "assistant", content: "Based on your Drizzle DB, your total for this month is **$1,240.50** across 12 transactions." }
];

export default function VinzChat() {
  const [messages, setMessages] = useState(MOCK_HISTORY);
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
      <Header />
      
      <main className="flex-1 overflow-y-auto pt-8 pb-32">
        <div className="max-w-3xl mx-auto">
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