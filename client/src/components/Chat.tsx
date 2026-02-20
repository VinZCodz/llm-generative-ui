"use client";
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { SuggestionCard } from "@/components/SuggestionCard";
import { fetchEventSource } from '@microsoft/fetch-event-source';

export default function Chat() {
    const [messages, setMessages] = useState<StreamMessage[]>([{ id: crypto.randomUUID(), type: "ai", payload: { text: `Welcome! How can I help you today?` } }]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Fires every time messages array changes

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { id: crypto.randomUUID(), type: "user", payload: { text: input } }])
        setInput("");

        const threadId = '1'; //TODO: need robust dynamic implementation. 
        await fetchSSE(input, threadId);
    };

    const fetchSSE = async (input: string, threadId: string) => {
        await fetchEventSource('http://127.0.0.1:3001/chat/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify({ input, threadId }),
            async onopen(response) {
                if (response.ok) return; // Connection success
                console.error("Server error:", response.status);
            },
            onmessage(msg) {
                updateServerMessages(JSON.parse(msg.data));
            },
            onerror(err) {
                console.error("Stream failed:", err);
                throw err; // Re-throws to trigger auto-retry logic
            }
        });
    }

    //TODO: Optimize this logic.
    const updateServerMessages = (message: StreamMessage) => {
        switch (message.type) {
            case 'ai':
                setMessages(prev => {
                    const lastMessage = prev.at(-1);

                    if (lastMessage && lastMessage.type === 'ai') {
                        const clonedMsgs = [...prev];
                        clonedMsgs[clonedMsgs.length - 1] = {
                            ...lastMessage,
                            payload: {
                                text: lastMessage.payload.text + message.payload.text
                            }
                        }
                        return clonedMsgs;
                    }
                    else
                        return [...prev, { id: crypto.randomUUID(), type: message.type, payload: message.payload }]
                });
                break;
            case 'toolCall:start':
                setMessages(prev => [...prev, { id: crypto.randomUUID(), type: message.type, payload: message.payload }]);
                break;
            case 'tool':
                setMessages(prev => [...prev, { id: crypto.randomUUID(), type: message.type, payload: message.payload }]);
                break;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-zinc-950">
            <Header messageCount={messages.length} />

            <main id="chat-scroll-area" className="flex-1 overflow-y-auto pt-8 pb-32">
                <div className="max-w-3xl mx-auto px-4">
                    <SuggestionCard messageCount={messages.length} onClick={(text) => setInput(text)} />

                    {messages!.map((m, i) => (
                        <ChatBubble key={m.id} message={m} />
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