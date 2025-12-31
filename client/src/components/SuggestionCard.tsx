import { LucideIcon } from "lucide-react";

interface SuggestionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: (text: string) => void;
}

export function SuggestionCard({ icon: Icon, title, description, onClick }: SuggestionCardProps) {
  return (
    <button
      onClick={() => onClick(description)}
      className="flex flex-col items-start p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all text-left group"
    >
      <div className="p-2 rounded-lg bg-blue-600/10 text-blue-500 mb-3 group-hover:animate-wiggle wiggle-wild transition-transform">
        <Icon size={20}  />
      </div>
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
        {description}
      </p>
    </button>
  );
}