"use client";

import Image from "next/image";

interface MatchDetailAccordionProps {
  match: any;
  ddragonVersion: string;
}

export default function MatchDetailAccordion({ match, ddragonVersion }: MatchDetailAccordionProps) {
  const team100 = match.participants?.filter((p: any) => p.teamId === 100) || [];
  const team200 = match.participants?.filter((p: any) => p.teamId === 200) || [];

  const maxDamage = Math.max(
    ...(match.participants?.map((p: any) => p.totalDamageDealtToChampions || 1) || [1])
  );

  const renderTeamTable = (team: any[], teamName: string, isWin: boolean) => (
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between px-2 text-xs font-bold">
        <span className={isWin ? "text-blue-400" : "text-red-400"}>
          {teamName} ({isWin ? "승리" : "패배"})
        </span>
        <span className="text-slate-400">딜량 / 골드 / KDA</span>
      </div>

      <div className="space-y-1.5">
        {team.map((p, idx) => {
          const dmgPercent = Math.round((p.totalDamageDealtToChampions / maxDamage) * 100);
          return (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-2 flex items-center justify-between gap-3 text-xs"
            >
              {/* Champion & Name */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 border border-slate-700">
                  <Image
                    src={`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${p.championName}.png`}
                    alt={p.championName || "Champion"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="truncate">
                  <div className="font-bold text-slate-200 truncate">{p.summonerName}</div>
                  <div className="text-[10px] text-slate-400">
                    {p.kills}/{p.deaths}/{p.assists} ({p.kda})
                  </div>
                </div>
              </div>

              {/* Damage Bar Graph (DeepLoL style) */}
              <div className="w-28 shrink-0 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{(p.totalDamageDealtToChampions || 0).toLocaleString()}</span>
                  <span>{p.damageShare || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${dmgPercent}%` }}
                    className={`h-full rounded-full ${isWin ? "bg-blue-500" : "bg-red-500"}`}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="flex items-center gap-0.5 shrink-0 hidden sm:flex">
                {p.items?.map((item: number, itemIdx: number) => (
                  <div
                    key={itemIdx}
                    className="w-5 h-5 rounded bg-slate-900 border border-slate-800 overflow-hidden relative"
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
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-slate-900/95 border-t border-slate-800 rounded-b-3xl space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {renderTeamTable(team100, "블루팀", match.teams?.[0]?.win ?? false)}
        {renderTeamTable(team200, "레드팀", match.teams?.[1]?.win ?? false)}
      </div>
    </div>
  );
}
