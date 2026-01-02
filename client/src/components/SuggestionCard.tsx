"use client";

import { USE_CASES } from "@/config/useCases";
import { siteConfig } from "@/config/site";
import Image from 'next/image';

interface SuggestionCardProps {
  messageCount: number;
  onClick: (text: string) => void;
}

export function SuggestionCard({ messageCount, onClick }: SuggestionCardProps) {
  if (messageCount > 1) return null;

  return (
    <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center animate-pulse">
          <Image src={siteConfig.ogImage} alt="Logo" width={100} height={100} priority />
        </div>
        <h2 className="text-xl font-bold text-zinc-100 mb-2">
          Master your money with {siteConfig.name}
        </h2>
        <p className="text-zinc-500 text-sm">
          Click a case below or type your own expense to get started.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {USE_CASES.map((useCase, idx) => {
          const Icon = useCase.icon;

          return (
            <button
              key={idx}
              onClick={() => onClick(useCase.description)}
              className="flex flex-col items-start p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all text-left group"
            >
              <div className="p-2 rounded-lg bg-blue-600/10 text-blue-500 mb-3 group-hover:animate-wiggle wiggle-wild transition-transform">
                <Icon size={20} />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                {useCase.title}
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                {useCase.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}