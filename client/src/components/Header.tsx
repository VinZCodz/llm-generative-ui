"use client";

import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import { Wallet, Circle, Landmark, AlertCircle } from "lucide-react";
import Image from 'next/image';

export function Header({ messageCount }: { messageCount: number }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const prevCount = useRef(messageCount);

  // Detect Scroll Position
  useEffect(() => {
    const chatContainer = document.getElementById("chat-scroll-area");
    if (!chatContainer) return;

    const handleScroll = () => {
      const scrolled = chatContainer.scrollTop > 200;
      setIsScrolled(scrolled);

      // If user reaches the bottom, clear the glow
      const isAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 50;
      if (isAtBottom) setHasNewMessage(false);
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect New Messages while scrolled up
  useEffect(() => {
    if (messageCount > prevCount.current && isScrolled) {
      setHasNewMessage(true);
    }
    prevCount.current = messageCount;
  }, [messageCount, isScrolled]);

  const handleWalletClick = () => {
    const chatContainer = document.getElementById("chat-scroll-area");
    if (!chatContainer) return;

    if (isScrolled) {
      chatContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
      setHasNewMessage(false);
    }
  };

  // Keyboard Shortcut Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault(); // Stop default browser refresh
        setShowConfirm(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <>
      <nav className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">

        {/* Clickable Logo Section */}
        <div className="relative group/tooltip">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group/btn"
          >
            <Image src={siteConfig.ogImage} alt="Logo" width={25} height={25} priority className="hover:animate-wiggle rounded" />
           <span className="text-lg font-bold tracking-tighter bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </button>
        </div>

        {/* Centered Brand Icon */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center group/wallet">
          <button
            onClick={handleWalletClick}
            className={`relative p-2 rounded-full transition-all active:scale-90 border 
            ${hasNewMessage
                ? "bg-blue-600/20 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-pulse"
                : "bg-zinc-900/50 border-zinc-800 hover:border-blue-500/50"
              }`}
          >
            <Landmark
              size={22}
              className={`transition-transform duration-500 ${isScrolled ? "rotate-0" : "rotate-360"
                } hover:animate-wiggle ${hasNewMessage ? "text-blue-400" : "text-blue-500"}`}
            />

            {/* Notification Dot */}
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            )}

            {/* Tool Tip */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 scale-0 group-hover/wallet:scale-100 transition-all bg-zinc-800 text-[10px] px-2 py-1 rounded border border-zinc-700 whitespace-nowrap text-white z-[60]">
              {hasNewMessage ? "New Entry Below" : isScrolled ? "Jump to Top" : "Jump to Bottom"}
            </div>
          </button>
        </div>

        {/* Right Side Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50">
            <Circle size={8} className="fill-blue-500 text-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider hidden sm:inline">AI Live</span>
          </div>
        </div>
      </nav>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-full text-red-500"><AlertCircle size={24} /></div>
              <h3 className="text-lg font-semibold text-zinc-100">Reset Chat?</h3>
            </div>
            <p className="text-zinc-400 text-sm mb-6">
              This will clear your current session with <span className="text-blue-400 font-medium">{siteConfig.name}</span>.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleReset} className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-600/20">Reset Now</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}