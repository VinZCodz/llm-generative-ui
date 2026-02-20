import { memo } from "react";
import { motion } from "framer-motion";
import { Bot, User, Toolbox, CheckCircle2, CheckCheckIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export const ChatBubble = memo(({ message }: { message: StreamMessage }) => {
  const { type, payload } = message;
  const isIncoming = type === "ai" || type === "toolCall:start" || type === "tool";
  const isConversation = type === "ai" || type === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex w-full mb-8 px-4", isIncoming ? "justify-start" : "justify-end")}
    >
      <div className={cn("flex max-w-[85%] md:max-w-[75%] gap-3", isIncoming ? "flex-row" : "flex-row-reverse")}>

        {(isConversation) && payload.text.length > 0 && (
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 border",
            isIncoming ? "bg-zinc-900 border-zinc-800 text-blue-400" : "bg-blue-600 border-blue-500 text-white"
          )}>
            {type === "ai" ? <Bot size={16} className="animate-pulse hover:animate-wiggle" /> : <User size={16} className="hover:animate-wiggle" />}
          </div>)}

        <div className="space-y-2">
          {type === "user" && (
            <div className="px-4 py-3 rounded-2xl shadow-2xl text-[15px] leading-relaxed break-words overflow-hidden bg-blue-600 text-white">
              <div className="prose prose-sm max-w-none text-white">
                <ReactMarkdown>{payload.text}</ReactMarkdown>
              </div>
            </div>
          )}

          {type === "ai" && payload.text.length > 0 && (
            <div className="px-4 py-3 rounded-2xl shadow-2xl text-[15px] leading-relaxed break-words overflow-hidden bg-zinc-900 border border-zinc-800 text-zinc-200">
              <div className="prose prose-sm max-w-none prose-invert">
                <ReactMarkdown>{payload.text}</ReactMarkdown>
              </div>
            </div>
          )}

          {type === "toolCall:start" && (
            <div className="flex flex-col p-3 rounded-xl ml-11 bg-purple-900/10 border border-purple-500/30 w-fit min-w-[220px]">

              <div className="flex items-center gap-2 mb-1">
                <Toolbox size={12} className="text-purple-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-bold">Tool Call:</span>
                <span className="text-xs font-mono text-zinc-400">{payload.name}</span>
              </div>

              <div className="items-center gap-2">
                {Object.keys(payload.args).length !== 0 && (
                  <div className="items-center gap-1.5 px-2 py-0.5 rounded-md">
                    <div className="prose prose-invert prose-purple text-[11px] font-mono leading-tight bg-black/20 p-2 rounded border border-zinc-800/50">
                      <ReactMarkdown
                        components={{
                          strong: ({ node, ...props }) => <span className="text-purple-400 font-bold" {...props} />,
                          p: ({ node, ...props }) => <p className="text-zinc-400 m-0" {...props} />
                        }}
                      >
                        {Object.entries(payload.args)
                          .map(([key, val]) => `**${key}**: ${String(val)}`)
                          .join('  \n')}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {type === 'tool' && (
            <div className="flex flex-col p-3 rounded-xl ml-11 bg-green-900/10 border border-green-500/30 w-fit min-w-[220px]">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={12} className="text-green-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 font-bold">Tool Result:</span>
              </div>

              <div className="space-y-2">
                {Array.isArray(payload.result) ?
                  (
                    <div className="flex items-center px-2 py-1 rounded-md bg-green-500/20 border border-green-400/50 w-fit">
                      <span className="text-[11px] font-mono text-green-300 font-bold flex items-center">
                        Returned {payload.result.length} Rows
                      </span>
                    </div>
                  ) :
                  (
                    <div className="prose prose-invert prose-green text-[11px] font-mono leading-tight bg-black/20 p-2 rounded border border-zinc-800/50">
                      <ReactMarkdown>
                        {typeof payload.result === 'object'
                          ? JSON.stringify(payload.result, null, 2)
                          : String(payload.result)}
                      </ReactMarkdown>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ChatBubble.displayName = "ChatBubble";
