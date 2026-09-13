"use client";

import { useState } from "react";
import Image from "next/image";
import { RefreshCw, Star, Trophy, Sparkles } from "lucide-react";
import RadarStatChart from "./RadarStatChart";

interface SummonerProfileProps {
  account: { gameName: string; tagLine: string; puuid: string };
  summoner: { profileIconId: number; summonerLevel: number };
  leagues: Array<{
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }>;
  matches: any[];
  ddragonVersion: string;
  isMock?: boolean;
}

export default function SummonerProfile({
  account,
  summoner,
  leagues,
  matches,
  ddragonVersion,
  isMock,
}: SummonerProfileProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Parse Solo & Flex Rank
  const soloRank = leagues.find((l) => l.queueType === "RANKED_SOLO_5x5");
  const flexRank = leagues.find((l) => l.queueType === "RANKED_FLEX_SR");

  // Calculate 20-match aggregate stats
  const totalGames = matches.length;
  const wins = matches.filter((m) => {
    const p = m.participants?.find((part: any) => part.puuid === account.puuid || part.summonerName === account.gameName);
    return p ? p.win : false;
  }).length;
  const losses = totalGames - wins;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  // Calculate KDA
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalVision = 0;
  let totalDamageShare = 0;
  let totalKP = 0;

  // Most Played Champions map
  const champMap: Record<number, { name: string; id: number; wins: number; games: number; kills: number; deaths: number; assists: number }> = {};

  matches.forEach((m) => {
    const p = m.participants?.find((part: any) => part.puuid === account.puuid || part.summonerName === account.gameName);
    if (p) {
      totalKills += p.kills || 0;
      totalDeaths += p.deaths || 0;
      totalAssists += p.assists || 0;
      totalVision += p.visionScore || 0;
      totalDamageShare += p.damageShare || 20;
      totalKP += p.killParticipation || 50;

      if (!champMap[p.championId]) {
        champMap[p.championId] = {
          id: p.championId,
          name: p.championName,
          wins: 0,
          games: 0,
          kills: 0,
          deaths: 0,
          assists: 0,
        };
      }
      champMap[p.championId].games += 1;
      if (p.win) champMap[p.championId].wins += 1;
      champMap[p.championId].kills += p.kills || 0;
      champMap[p.championId].deaths += p.deaths || 0;
      champMap[p.championId].assists += p.assists || 0;
    }
  });

  const avgKDA = totalDeaths === 0 ? (totalKills + totalAssists).toFixed(2) : ((totalKills + totalAssists) / totalDeaths).toFixed(2);
  const avgVision = totalGames > 0 ? Math.round(totalVision / totalGames) : 0;
  const avgDamageShare = totalGames > 0 ? Math.round(totalDamageShare / totalGames) : 0;
  const avgKP = totalGames > 0 ? Math.round(totalKP / totalGames) : 0;

  // Top 3 Most Played Champions
  const topChampions = Object.values(champMap)
    .sort((a, b) => b.games - a.games)
    .slice(0, 3);

  // Playstyle radar scores
  const radarScores = {
    lane: Math.min(100, Math.max(40, winRate + 15)),
    teamfight: Math.min(100, Math.max(40, avgKP + 10)),
    vision: Math.min(100, Math.max(30, avgVision * 3)),
    objective: Math.min(100, Math.max(40, winRate + 10)),
    damage: Math.min(100, Math.max(40, avgDamageShare * 3)),
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch(`/api/summoner/${encodeURIComponent(`${account.gameName}#${account.tagLine}`)}/refresh`, {
        method: "POST",
      });
      window.location.reload();
    } catch (e) {
      alert("갱신 실패");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Profile Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {isMock && (
          <div className="absolute top-3 right-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>데모/시뮬레이션 전적 데이터</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Summoner Icon & Name */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-sky-500/40 shadow-lg shadow-sky-500/10 relative">
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/profileicon/${summoner.profileIconId || 588}.png`}
                  alt="Profile Icon"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                {summoner.summonerLevel}
              </span>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {account.gameName}
                  <span className="text-slate-400 text-lg font-bold ml-1">#{account.tagLine}</span>
                </h1>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-1.5 rounded-xl transition-colors ${isFavorite ? "text-amber-400 bg-amber-400/10" : "text-slate-500 hover:text-amber-400 hover:bg-slate-800"
                    }`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-sky-600/20"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span>전적 갱신</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tier Cards (Solo Rank & Flex Rank) */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Solo Rank */}
            <div className="flex-1 md:w-44 bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">솔로 랭크</div>
                <div className="text-sm font-extrabold text-white">
                  {soloRank ? `${soloRank.tier} ${soloRank.rank}` : "Unranked"}
                </div>
                {soloRank && (
                  <div className="text-xs text-slate-400 font-medium">
                    <span className="text-sky-400 font-semibold">{soloRank.leaguePoints} LP</span> ({soloRank.wins}승 {soloRank.losses}패)
                  </div>
                )}
              </div>
            </div>

            {/* Flex Rank */}
            <div className="flex-1 md:w-44 bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">자유 랭크</div>
                <div className="text-sm font-extrabold text-white">
                  {flexRank ? `${flexRank.tier} ${flexRank.rank}` : "Unranked"}
                </div>
                {flexRank && (
                  <div className="text-xs text-slate-400 font-medium">
                    <span className="text-indigo-400 font-semibold">{flexRank.leaguePoints} LP</span> ({flexRank.wins}승 {flexRank.losses}패)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Stats & Your.GG Radar Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 20-Match Overview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">최근 {totalGames}경기 데이터 분석</span>
            <span className="text-xs font-bold text-sky-400">{wins}승 {losses}패 ({winRate}%)</span>
          </div>

          <div className="flex items-center justify-around my-2">
            <div className="text-center">
              <div className="text-2xl font-black text-white">{avgKDA} <span className="text-xs font-bold text-slate-400">:1</span></div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">평균 KDA</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-2xl font-black text-amber-400">{avgKP}%</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">킬 관여율 (KP)</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-2xl font-black text-sky-400">{avgDamageShare}%</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">팀 딜량 비중</div>
            </div>
          </div>

          {/* Winrate Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="h-2.5 w-full bg-red-500/30 rounded-full overflow-hidden flex">
              <div style={{ width: `${winRate}%` }} className="bg-blue-500 h-full rounded-full transition-all" />
            </div>
          </div>
        </div>

        {/* Most Played Champions TOP 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3 mb-3">
            선호 챔피언 TOP 3
          </div>

          <div className="space-y-3">
            {topChampions.map((c) => {
              const cWinrate = Math.round((c.wins / c.games) * 100);
              const cKda = c.deaths === 0 ? (c.kills + c.assists).toFixed(2) : ((c.kills + c.assists) / c.deaths).toFixed(2);
              return (
                <div key={c.id} className="flex items-center justify-between bg-slate-950/60 border border-slate-800 p-2.5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-slate-700">
                      <Image
                        src={`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${c.name}.png`}
                        alt={c.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{c.name}</div>
                      <div className="text-xs text-slate-400 font-medium">
                        {c.games}판 ({c.wins}승 {c.games - c.wins}패)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-sky-400">{cKda} KDA</div>
                    <div className={`text-xs font-bold ${cWinrate >= 60 ? "text-amber-400" : "text-slate-300"}`}>
                      {cWinrate}% 승률
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Your.GG Style Radar Graph */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 mb-1">
            플레이 스타일
          </div>
          <RadarStatChart stats={radarScores} />
        </div>
      </div>
    </div>
  );
}
