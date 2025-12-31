import { motion } from "framer-motion";
import { Bot, User, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export function ChatBubble({ message }: { message: any }) {
  const isBot = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex w-full mb-8 px-4", isBot ? "justify-start" : "justify-end")}
    >
      <div className={cn("flex max-w-[85%] md:max-w-[75%] gap-3", isBot ? "flex-row" : "flex-row-reverse")}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 border",
          isBot ? "bg-zinc-900 border-zinc-800 text-blue-400" : "bg-blue-600 border-blue-500 text-white"
        )}>
          {isBot ? <Bot size={16} className="animate-pulse hover:animate-wiggle"/> : <User size={16} className="hover:animate-wiggle"/>}
        </div>

        <div className="space-y-2">
          <div className={cn(
            "px-4 py-3 rounded-2xl shadow-2xl text-[15px] leading-relaxed break-words overflow-hidden",
            isBot ? "bg-zinc-900 border border-zinc-800 text-zinc-200" : "bg-blue-600 text-white"
          )}>
            <div className={cn("prose prose-sm max-w-none", isBot ? "prose-invert" : "text-white")}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>

          {/* Agentic Tool Indicator (only for assistant) */}
          {isBot && message.toolCall && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800 w-fit">
              <CheckCircle2 size={12} className="text-green-500" />
              <span className="text-[11px] font-mono text-zinc-500">Drizzle: upsert_expense_v1</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}