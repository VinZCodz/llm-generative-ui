"use client";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatBubble({ message }: { message: { role: string; content: string } }) {
  const isBot = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("flex w-full mb-8", isBot ? "justify-start" : "justify-end")}
    >
      <div className={cn("flex max-w-[85%] gap-4", isBot ? "flex-row" : "flex-row-reverse")}>
        <div className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
          isBot ? "bg-white border-zinc-200 text-blue-600" : "bg-zinc-900 border-zinc-800 text-white"
        )}>
          {isBot ? <Bot size={20} /> : <User size={20} />}
        </div>
        <div className={cn(
          "px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm",
          isBot ? "bg-white border border-zinc-200 text-zinc-800" : "bg-blue-600 text-white shadow-blue-200"
        )}>
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}