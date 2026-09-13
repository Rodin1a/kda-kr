import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import { Swords, Flame, Sparkles, Shield, Zap, Award } from "lucide-react";

export default function Home() {
  const popularSummoners = [
    { name: "Hide on bush", tag: "KR1", tier: "CHALLENGER", lp: "1,452", iconId: 6, winRate: "62%" },
    { name: "Chovy", tag: "KR1", tier: "CHALLENGER", lp: "1,890", iconId: 588, winRate: "68%" },
    { name: "Canyon", tag: "KR1", tier: "CHALLENGER", lp: "1,620", iconId: 548, winRate: "64%" },
    { name: "Viper", tag: "KR1", tier: "CHALLENGER", lp: "1,510", iconId: 512, winRate: "61%" },
    { name: "Keria", tag: "KR1", tier: "CHALLENGER", lp: "1,480", iconId: 520, winRate: "65%" },
    { name: "Zeus", tag: "KR1", tier: "CHALLENGER", lp: "1,390", iconId: 535, winRate: "60%" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Top Banner Gradient Background */}
      <div className="relative overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-sky-950/30 via-slate-950 to-slate-950 py-20 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Logo & Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>리그 오브 레전드 프리미엄 통합 전적 검색</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            리그 오브 레전드 전적 검색 <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              KDA.KR
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-medium">
            최근 20경기 승률, KDA, 레이더 차트 및 딜량 그래프를 한눈에 확인하세요.
          </p>

          {/* Large Hero Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <SearchInput size="large" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Popular Summoners Showcase */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-extrabold text-white tracking-tight">실시간 인기 검색 소환사</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">KR 서버 기준</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {popularSummoners.map((s) => (
              <Link
                key={`${s.name}#${s.tag}`}
                href={`/summoner/${encodeURIComponent(`${s.name}#${s.tag}`)}`}
                className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all shadow-md group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden relative shrink-0">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/16.15.1/img/profileicon/${s.iconId}.png`}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-100 group-hover:text-sky-400 transition-colors">
                      {s.name} <span className="text-xs text-slate-400 font-normal">#{s.tag}</span>
                    </div>
                    <div className="text-xs font-bold text-amber-400 mt-0.5">{s.tier}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-sky-400">{s.lp} LP</div>
                  <div className="text-[11px] font-semibold text-slate-400">{s.winRate} 승률</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Feature Highlights Cards */}
        {/* ponytail: commercial feature highlight copy focusing on key UX differentiators */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-white">지연 없는 초고속 전적 조회</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              검색 즉시 최신 라이엇 매치 데이터를 반영하여 대기시간 없이 소환사의 전적, 룬, 빌드 정보를 실시간으로 확인하세요.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-white">5축 플레이스타일 종합 분석</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              최근 20경기의 라인전, 전투 기여, 시야 점수, 오브젝트, 딜 비중을 5축 방사형 차트로 다각도 분석하여 나의 강점을 파악합니다.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-white">10인 심층 딜량 & 빌드 비교</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              매치별 상세 분석을 통해 양 팀 10인 소환사의 딜량 그래프, KDA, 아이템 빌드 순서를 직관적으로 비교할 수 있습니다.
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 font-medium">
        KDA.KR is not endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing League of Legends.
      </footer>
    </main>
  );
}
