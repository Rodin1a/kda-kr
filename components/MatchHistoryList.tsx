"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Swords, Shield, Eye, Flame } from "lucide-react";
import MatchDetailAccordion from "./MatchDetailAccordion";

interface MatchHistoryListProps {
  matches: any[];
  currentPuuid: string;
  currentSummonerName: string;
  ddragonVersion: string;
}

export default function MatchHistoryList({
  matches,
  currentPuuid,
  currentSummonerName,
  ddragonVersion,
}: MatchHistoryListProps) {
  const [filterQueue, setFilterQueue] = useState<number | "ALL">("ALL");
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    if (filterQueue === "ALL") return true;
    return m.queueId === filterQueue;
  });

  const toggleExpand = (matchId: string) => {
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);
  };

  return (
    <div className="space-y-4">
      {/* Queue Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setFilterQueue("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filterQueue === "ALL"
              ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
              : "bg-slate-950/60 text-slate-400 hover:text-white"
            }`}
        >
          전체 매치 ({matches.length})
        </button>
        <button
          onClick={() => setFilterQueue(420)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filterQueue === 420
              ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
              : "bg-slate-950/60 text-slate-400 hover:text-white"
            }`}
        >
          솔로랭크
        </button>
        <button
          onClick={() => setFilterQueue(440)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filterQueue === 440
              ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
              : "bg-slate-950/60 text-slate-400 hover:text-white"
            }`}
        >
          자유랭크
        </button>
        <button
          onClick={() => setFilterQueue(450)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filterQueue === 450
              ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
              : "bg-slate-950/60 text-slate-400 hover:text-white"
            }`}
        >
          칼바람 나락
        </button>
      </div>

      {/* Match Cards List */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 font-medium">
            해당 조건의 최근 전적 기록이 없습니다.
          </div>
        ) : (
          filteredMatches.map((m) => {
            const isExpanded = expandedMatchId === m.matchId;
            const p =
              m.participants?.find(
                (part: any) =>
                  part.puuid === currentPuuid ||
                  part.summonerName?.toLowerCase() === currentSummonerName.toLowerCase() ||
                  part.riotIdGameName?.toLowerCase() === currentSummonerName.toLowerCase()
              ) || m.participants?.[0];

            if (!p) return null;

            const isWin = p.win;
            const durationMin = Math.floor((m.gameDuration || 0) / 60);
            const durationSec = (m.gameDuration || 0) % 60;

            const cardBorder = isWin
              ? "border-l-4 border-l-blue-500 border-slate-800 bg-blue-950/10 hover:bg-blue-950/20"
              : "border-l-4 border-l-red-500 border-slate-800 bg-red-950/10 hover:bg-red-950/20";

            return (
              <div
                key={m.matchId}
                className={`bg-slate-900 rounded-3xl border shadow-lg transition-all overflow-hidden ${isExpanded ? "rounded-b-none border-slate-700" : ""
                  }`}
              >
                <div
                  onClick={() => toggleExpand(m.matchId)}
                  className={`p-4 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer ${cardBorder}`}
                >
                  {/* Left Info: Mode, Duration, Win/Loss */}
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    <div className="space-y-0.5 min-w-[70px]">
                      <div className="text-xs font-bold text-slate-300">{m.queueName || "일반"}</div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {durationMin}분 {durationSec}초
                      </div>
                      <div
                        className={`text-xs font-black tracking-wider uppercase ${isWin ? "text-blue-400" : "text-red-400"
                          }`}
                      >
                        {isWin ? "승리" : "패배"}
                      </div>
                    </div>

                    {/* Champion & Summoner Spells */}
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden relative border-2 border-slate-700 shrink-0">
                        <Image
                          src={`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${p.championName}.png`}
                          alt={p.championName || "Champion"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <span className="absolute bottom-0 right-0 bg-slate-950/90 text-white text-[9px] font-extrabold px-1 rounded-tl">
                          {p.champLevel}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="w-5 h-5 bg-slate-950 rounded border border-slate-800 overflow-hidden relative">
                          <Image
                            src={`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/spell/${p.summoner1Id === 4 ? "SummonerFlash" : "SummonerFlash"
                              }.png`}
                            alt="Spell 1"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="w-5 h-5 bg-slate-950 rounded border border-slate-800 overflow-hidden relative">
                          <Image
                            src={`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/spell/${p.summoner2Id === 12 ? "SummonerTeleport" : "SummonerDot"
                              }.png`}
                            alt="Spell 2"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Stats: KDA, KP%, Damage Share */}
                  <div className="flex items-center justify-around w-full md:w-auto gap-6 border-y md:border-y-0 md:border-x border-slate-800/80 py-2 md:py-0 md:px-6">
                    <div className="text-center">
                      <div className="text-base font-black text-white">
                        {p.kills} / <span className="text-red-400">{p.deaths}</span> / {p.assists}
                      </div>
                      <div className="text-xs font-bold text-sky-400 mt-0.5">{p.kda} KDA</div>
                    </div>

                    <div className="text-center text-xs font-medium text-slate-400">
                      <div>
                        킬관여 <span className="font-bold text-amber-400">{p.killParticipation || 50}%</span>
                      </div>
                      <div>
                        CS <span className="font-bold text-slate-200">{p.totalMinionsKilled}</span> (
                        {((p.totalMinionsKilled || 0) / (durationMin || 1)).toFixed(1)})
                      </div>
                    </div>
                  </div>

                  {/* Right Info: Item Build & 10 Players Summary */}
                  <div className="flex items-center justify-between w-full md:w-auto gap-4">
                    {/* Item Grid (7 items) */}
                    <div className="grid grid-cols-4 gap-1">
                      {p.items?.map((item: number, itemIdx: number) => (
                        <div
                          key={itemIdx}
                          className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden relative"
                        >
                          {item > 0 && (
                            <Image
                              src={`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/item/${item}.png`}
                              alt="Item"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Expand Chevron Toggle */}
                    <button className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Accordion Detail */}
                {isExpanded && <MatchDetailAccordion match={m} ddragonVersion={ddragonVersion} />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
