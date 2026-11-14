"use client";

import { Sparkles, Search, Loader2 } from "lucide-react";

interface ImageSearchBarProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onSearch: () => void;
  isSearching: boolean;
  /** The query the AI actually searched, when it differs from the prompt */
  refinedQuery?: string | null;
}

/** AI image search input: title, prompt field, search button and the AI-refined query. */
export function ImageSearchBar({
  prompt,
  onPromptChange,
  onSearch,
  isSearching,
  refinedQuery,
}: ImageSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="shrink-0 flex flex-col gap-3 px-4 pt-4 pb-4 border-b border-border-accent-light">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        AI Image Search
      </h3>
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image you need..."
          className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border-accent-light text-white text-sm placeholder:text-foreground-faint focus:outline-none focus:border-accent transition-colors"
        />
        <button
          type="button"
          onClick={onSearch}
          disabled={isSearching || !prompt.trim()}
          className="px-3 py-2 bg-accent text-surface text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </div>
      {refinedQuery && (
        <p className="text-xs text-foreground-faint -mt-1">
          AI refined: <span className="text-foreground-subtle italic">&quot;{refinedQuery}&quot;</span>
        </p>
      )}
    </div>
  );
}
