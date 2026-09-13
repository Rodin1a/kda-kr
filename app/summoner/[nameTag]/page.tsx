import Link from "next/link";
import Header from "@/components/Header";
import SummonerProfile from "@/components/SummonerProfile";
import MatchHistoryList from "@/components/MatchHistoryList";
import SearchInput from "@/components/SearchInput";
import { getLatestDDragonVersion } from "@/lib/riot";
import { AlertCircle, UserX } from "lucide-react";

interface SummonerPageProps {
  params: Promise<{
    nameTag: string;
  }>;
}

export default async function SummonerPage({ params }: SummonerPageProps) {
  const { nameTag } = await params;
  const rawNameTag = decodeURIComponent(nameTag);
  const ddragonVersion = await getLatestDDragonVersion();

  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

  let data: any = null;
  let errorMsg: string | null = null;
  let isNotFound = false;

  try {
    const res = await fetch(`${baseUrl}/api/summoner/${encodeURIComponent(rawNameTag)}`, {
      cache: "no-store",
    });

    if (res.ok) {
      data = await res.json();
    } else {
      const errData = await res.json().catch(() => ({}));
      errorMsg = errData.error || "소환사 전적 정보를 불러오지 못했습니다.";
      if (res.status === 404 || errData.notFound) {
        isNotFound = true;
      }
    }
  } catch (e) {
    console.warn("Direct API fetch fallback trigger:", e);
  }

  // ponytail: 라이엇에 등록되지 않은 소환사는 Mock으로 속이지 않고 정확한 미등록 안내 화면 노출
  if (isNotFound) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
        <Header />
        <main className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-xl shadow-red-500/10">
            <UserX className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight">등록되지 않은 소환사입니다</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              <span className="text-sky-400 font-bold">{rawNameTag}</span> 님을 라이엇 시스템에서 찾을 수 없습니다. <br />
              소환사명과 태그(예: <span className="text-slate-300 font-semibold">#KR1</span>)가 올바른지 확인해주세요.
            </p>
          </div>
          <div className="pt-2 max-w-md mx-auto">
            <SearchInput size="normal" initialValue={rawNameTag} />
          </div>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            >
              메인 홈으로 이동
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Fallback to mock profile ONLY if API failed unexpectedly (e.g. key unconfigured) and NOT 404
  if (!data) {
    const { generateMockProfile } = await import("@/lib/riot");
    const hashIdx = rawNameTag.lastIndexOf("#");
    const gameName = hashIdx !== -1 ? rawNameTag.substring(0, hashIdx) : rawNameTag;
    const tagLine = hashIdx !== -1 ? rawNameTag.substring(hashIdx + 1) : "KR1";
    data = generateMockProfile(gameName, tagLine);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg} (시뮬레이션 전적 데이터로 표시합니다)</span>
          </div>
        )}

        {/* Profile Header & Stats */}
        <SummonerProfile
          account={data.account}
          summoner={data.summoner}
          leagues={data.leagues}
          matches={data.matches}
          ddragonVersion={ddragonVersion}
          isMock={data.isMock || data.isPartialMock}
        />

        {/* Match History List */}
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center justify-between">
            <span>최근 경기 기록 ({data.matches?.length || 0})</span>
            {/* <span className="text-xs font-medium text-slate-400">Match-v5 API / MongoDB Atlas</span> */}
          </h2>

          <MatchHistoryList
            matches={data.matches || []}
            currentPuuid={data.account?.puuid || ""}
            currentSummonerName={data.account?.gameName || ""}
            ddragonVersion={ddragonVersion}
          />
        </div>
      </main>
    </div>
  );
}
