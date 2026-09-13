"use client";

import Link from "next/link";
import SearchInput from "./SearchInput";
import { Swords, Flame, Trophy, Award } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Swords className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              KDA<span className="text-sky-400">.KR</span>
            </span>
          </div>
        </Link>

        {/* Header Search Input */}
        <div className="flex-1 max-w-md hidden md:block">
          <SearchInput size="normal" />
        </div>

        {/* Quick Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold text-slate-300">
          <Link
            href="/"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-800 hover:text-sky-400 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>전적 검색</span>
          </Link>
          <button
            onClick={() => alert("준비 중인 서비스입니다.")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-800 hover:text-sky-400 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-sky-400" />
            <span>랭킹</span>
          </button>
          <button
            onClick={() => alert("준비 중인 서비스입니다.")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-800 hover:text-sky-400 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>챔피언 티어</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
