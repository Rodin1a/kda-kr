"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, History, TrendingUp } from "lucide-react";

interface SearchInputProps {
  initialValue?: string;
  size?: "large" | "normal";
}

export default function SearchInput({ initialValue = "", size = "normal" }: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("kda_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (targetQuery?: string) => {
    let searchQuery = (targetQuery || query).trim();
    if (!searchQuery) return;

    // Default tag logic: if hash is missing, append #KR1
    if (!searchQuery.includes("#")) {
      searchQuery += "#KR1";
    }

    // Save to LocalStorage
    const updated = [searchQuery, ...recentSearches.filter((s) => s.toLowerCase() !== searchQuery.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("kda_recent_searches", JSON.stringify(updated));

    setIsOpen(false);
    router.push(`/summoner/${encodeURIComponent(searchQuery)}`);
  };

  const removeRecent = (searchItem: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== searchItem);
    setRecentSearches(updated);
    localStorage.setItem("kda_recent_searches", JSON.stringify(updated));
  };

  const isLarge = size === "large";

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="소환사명#KR1 (예: Hide on bush#KR1)"
          className={`w-full bg-slate-900/90 text-slate-100 border border-slate-700/80 rounded-2xl ${
            isLarge ? "px-6 py-4 text-lg shadow-xl" : "px-4 py-2.5 text-sm"
          } focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-500`}
        />
        <button
          type="submit"
          className={`absolute right-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center ${
            isLarge ? "px-5 py-2.5" : "px-3 py-1.5 text-sm"
          }`}
        >
          <Search className={`${isLarge ? "w-5 h-5" : "w-4 h-4"} mr-1`} />
          .GG
        </button>
      </form>

      {/* Dropdown for Recent Searches & Trending */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
          {recentSearches.length > 0 && (
            <div className="p-3 border-b border-slate-800">
              <div className="flex items-center text-xs font-semibold text-slate-400 mb-2 px-2">
                <History className="w-3.5 h-3.5 mr-1 text-sky-400" />
                최근 검색 소환사
              </div>
              <div className="space-y-1">
                {recentSearches.map((item) => (
                  <div
                    key={item}
                    onClick={() => handleSearch(item)}
                    className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/80 rounded-xl cursor-pointer text-sm text-slate-200 transition-colors group"
                  >
                    <span className="font-medium group-hover:text-sky-400 transition-colors">{item}</span>
                    <button
                      onClick={(e) => removeRecent(item, e)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Trending Recommendations */}
          <div className="p-3">
            <div className="flex items-center text-xs font-semibold text-slate-400 mb-2 px-2">
              <TrendingUp className="w-3.5 h-3.5 mr-1 text-amber-400" />
              인기 소환사
            </div>
            <div className="flex flex-wrap gap-2 px-2">
              {["Hide on bush#KR1", "Chovy#KR1", "Canyon#KR1", "Viper#KR1", "Keria#KR1"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-sky-950/80 hover:border-sky-500/50 border border-slate-700/50 rounded-xl text-xs text-slate-300 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
