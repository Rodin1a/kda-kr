import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AccountCache, LeagueCache, MatchCache } from "@/models/Cache";
import { SearchLog } from "@/models/UserFeature";
import {
  getAccountByRiotId,
  getSummonerByPuuid,
  getLeagueEntries,
  getMatchIdsByPuuid,
  getRawMatchDetail,
  pruneMatchData,
  generateMockProfile,
} from "@/lib/riot";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nameTag: string }> }
) {
  try {
    const { nameTag } = await params;
    const rawNameTag = decodeURIComponent(nameTag);
    // Split GameName#TagLine
    const hashIndex = rawNameTag.lastIndexOf("#");
    if (hashIndex === -1) {
      return NextResponse.json(
        { error: "올바른 소환사명#태그 형식이 아닙니다. (예: Hide on bush#KR1)" },
        { status: 400 }
      );
    }

    const gameName = rawNameTag.substring(0, hashIndex).trim();
    const tagLine = rawNameTag.substring(hashIndex + 1).trim();
    const riotIdKey = `${gameName}#${tagLine}`.toLowerCase();

    // Connect to MongoDB Atlas (if available)
    const db = await connectToDatabase();

    let puuid: string | null = null;
    let accountData: any = null;

    if (db) {
      // 1. Check Account Cache in MongoDB Atlas
      const cachedAccount = await AccountCache.findOne({ riotIdKey });
      if (cachedAccount) {
        puuid = cachedAccount.puuid;
        accountData = { puuid, gameName: cachedAccount.gameName, tagLine: cachedAccount.tagLine };
      }
    }

    // If not cached, fetch Account-V1 from Riot API
    if (!puuid) {
      const { account: liveAccount, notFound } = await getAccountByRiotId(gameName, tagLine);

      // ponytail: 라이엇에 등록되지 않은 유저는 Mock 전적으로 속이지 않고 즉시 404 반환
      if (notFound) {
        return NextResponse.json(
          {
            error: `'${gameName}#${tagLine}' 소환사를 찾을 수 없습니다. 소환사명과 태그를 확인해주세요.`,
            notFound: true,
          },
          { status: 404 }
        );
      }

      if (liveAccount) {
        puuid = liveAccount.puuid;
        accountData = liveAccount;
        if (db) {
          await AccountCache.create({
            riotIdKey,
            gameName: liveAccount.gameName,
            tagLine: liveAccount.tagLine,
            puuid,
          }).catch(() => {});
        }
      }
    }

    // ponytail: 실제 존재하는 유효한 소환사일 때만 검색 통계 로그 기록
    if (db && puuid) {
      await SearchLog.findOneAndUpdate(
        { riotId: `${gameName}#${tagLine}` },
        { $inc: { count: 1 }, $set: { gameName, tagLine, lastSearchedAt: new Date() } },
        { upsert: true }
      ).catch(() => {});
    }

    // Fallback to Mock Data ONLY IF Riot API Key is completely unconfigured
    if (!puuid || !accountData) {
      const mockData = generateMockProfile(gameName, tagLine);
      return NextResponse.json(mockData);
    }

    // 2. Check League / Summoner Cache in MongoDB Atlas
    let summonerInfo: any = null;
    let leagues: any[] = [];

    if (db) {
      const cachedLeague = await LeagueCache.findOne({ puuid });
      if (cachedLeague) {
        summonerInfo = cachedLeague.summoner;
        leagues = cachedLeague.leagues;
      }
    }

    if (!summonerInfo) {
      summonerInfo = await getSummonerByPuuid(puuid);
      if (summonerInfo) {
        leagues = await getLeagueEntries(puuid, summonerInfo.id);
        if (db) {
          await LeagueCache.create({
            puuid,
            summoner: summonerInfo,
            leagues,
          }).catch(() => {});
        }
      }
    }

    // 3. Fetch Recent Match History (with MongoDB Match Caching)
    const matchIds = await getMatchIdsByPuuid(puuid, 20);
    const matches: any[] = [];

    if (matchIds && matchIds.length > 0) {
      const batchSize = 5;
      for (let i = 0; i < matchIds.length; i += batchSize) {
        const chunk = matchIds.slice(i, i + batchSize);
        const chunkResults = await Promise.all(
          chunk.map(async (mId) => {
            if (db) {
              const cachedMatch = await MatchCache.findOne({ matchId: mId });
              if (cachedMatch) return cachedMatch.prunedData;
            }

            const rawMatch = await getRawMatchDetail(mId);
            if (!rawMatch) return null;

            const pruned = pruneMatchData(rawMatch);
            if (pruned && db) {
              await MatchCache.create({ matchId: mId, prunedData: pruned }).catch(() => {});
            }
            return pruned;
          })
        );
        matches.push(...chunkResults.filter(Boolean));
      }
    }

    // Fallback if matchIds returned empty or failed
    if (matches.length === 0) {
      const mock = generateMockProfile(gameName, tagLine);
      return NextResponse.json({
        account: accountData,
        summoner: summonerInfo || mock.summoner,
        leagues: leagues.length > 0 ? leagues : mock.leagues,
        matches: mock.matches,
        isPartialMock: true,
      });
    }

    return NextResponse.json({
      account: accountData,
      summoner: summonerInfo,
      leagues,
      matches,
      isMock: false,
    });
  } catch (error: any) {
    console.error("API /summoner error:", error);
    return NextResponse.json(
      { error: "전적 정보를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
