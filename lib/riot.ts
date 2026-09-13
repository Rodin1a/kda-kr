// ponytail: Riot API Client & Data Dragon ko_KR Metadata Helper
const RIOT_API_KEY = process.env.RIOT_API_KEY;

// Region Host Mapping
const REGIONAL_HOST = "asia.api.riotgames.com"; // Account-V1, Match-V5
const PLATFORM_HOST = "kr.api.riotgames.com";   // Summoner-V4, League-V4

// Cache for Data Dragon Latest Version
let cachedDDragonVersion = "16.15.1";

export async function getLatestDDragonVersion(): Promise<string> {
  try {
    const res = await fetch("https://ddragon.leagueoflegends.com/api/versions.json", {
      next: { revalidate: 86400 }, // Cache version for 24 hours
    });
    if (res.ok) {
      const versions: string[] = await res.json();
      if (versions && versions.length > 0) {
        cachedDDragonVersion = versions[0];
      }
    }
  } catch (e) {
    console.warn("Failed to fetch latest DDragon version, using fallback:", e);
  }
  return cachedDDragonVersion;
}

// Queue ID Mapping for Korean Queue Names
export const QUEUE_MAP: Record<number, string> = {
  420: "솔랭",
  440: "자유랭크",
  430: "일반",
  450: "무작위 총력전",
  1700: "아레나",
  1900: "URF",
};

// Generic Riot API Fetcher
async function fetchRiotAPI<T>(host: string, endpoint: string): Promise<T | null> {
  if (!RIOT_API_KEY || RIOT_API_KEY.includes("xxxx")) {
    return null;
  }

  const url = `https://${host}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "X-Riot-Token": RIOT_API_KEY,
    },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    console.error(`Riot API Error [${res.status}]: ${url}`);
    return null;
  }

  return res.json();
}

export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface RiotSummoner {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface RiotLeagueEntry {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

// ponytail: Fetch Account by Riot ID. Distinguishes 404 Not Found from errors/missing keys
export async function getAccountByRiotId(
  gameName: string,
  tagLine: string
): Promise<{ account: RiotAccount | null; notFound: boolean }> {
  if (!RIOT_API_KEY || RIOT_API_KEY.includes("xxxx")) {
    return { account: null, notFound: false };
  }
  const encodedName = encodeURIComponent(gameName);
  const encodedTag = encodeURIComponent(tagLine);
  const res = await fetch(
    `https://${REGIONAL_HOST}/riot/account/v1/accounts/by-riot-id/${encodedName}/${encodedTag}`,
    {
      headers: { "X-Riot-Token": RIOT_API_KEY },
    }
  );

  if (res.status === 404) return { account: null, notFound: true };
  if (!res.ok) return { account: null, notFound: false };

  const account = await res.json();
  return { account, notFound: false };
}

// Fetch Summoner by PUUID
export async function getSummonerByPuuid(puuid: string): Promise<RiotSummoner | null> {
  return fetchRiotAPI<RiotSummoner>(PLATFORM_HOST, `/lol/summoner/v4/summoners/by-puuid/${puuid}`);
}

// Fetch League Entries by PUUID or Summoner ID
export async function getLeagueEntries(puuid: string, summonerId?: string): Promise<RiotLeagueEntry[]> {
  const entriesByPuuid = await fetchRiotAPI<RiotLeagueEntry[]>(PLATFORM_HOST, `/lol/league/v4/entries/by-puuid/${puuid}`);
  if (entriesByPuuid && Array.isArray(entriesByPuuid)) return entriesByPuuid;

  if (summonerId) {
    const entriesBySummoner = await fetchRiotAPI<RiotLeagueEntry[]>(PLATFORM_HOST, `/lol/league/v4/entries/by-summoner/${summonerId}`);
    if (entriesBySummoner && Array.isArray(entriesBySummoner)) return entriesBySummoner;
  }

  return [];
}

// Fetch Match IDs
export async function getMatchIdsByPuuid(puuid: string, count = 20): Promise<string[]> {
  const ids = await fetchRiotAPI<string[]>(REGIONAL_HOST, `/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`);
  return ids || [];
}

// Fetch Match Detail
export async function getRawMatchDetail(matchId: string): Promise<any | null> {
  return fetchRiotAPI<any>(REGIONAL_HOST, `/lol/match/v5/matches/${matchId}`);
}

// Data Pruning Helper: Compress raw Riot Match JSON down to ~15KB for MongoDB cache efficiency
export function pruneMatchData(rawMatch: any) {
  if (!rawMatch || !rawMatch.info) return null;

  const info = rawMatch.info;
  const teams = info.teams.map((t: any) => ({
    teamId: t.teamId,
    win: t.win,
    bans: t.bans || [],
    objectives: {
      baron: t.objectives?.baron?.kills || 0,
      dragon: t.objectives?.dragon?.kills || 0,
      tower: t.objectives?.tower?.kills || 0,
    },
  }));

  const participants = info.participants.map((p: any) => ({
    puuid: p.puuid,
    summonerName: p.summonerName || p.riotIdGameName || "Summoner",
    riotIdGameName: p.riotIdGameName,
    riotIdTagline: p.riotIdTagline,
    championId: p.championId,
    championName: p.championName,
    champLevel: p.champLevel,
    teamId: p.teamId,
    win: p.win,
    kills: p.kills,
    deaths: p.deaths,
    assists: p.assists,
    kda: p.deaths === 0 ? (p.kills + p.assists).toFixed(2) : ((p.kills + p.assists) / p.deaths).toFixed(2),
    totalDamageDealtToChampions: p.totalDamageDealtToChampions,
    totalDamageTaken: p.totalDamageTaken,
    goldEarned: p.goldEarned,
    totalMinionsKilled: p.totalMinionsKilled + (p.neutralMinionsKilled || 0),
    visionScore: p.visionScore,
    items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],
    primaryRune: p.perks?.styles?.[0]?.selections?.[0]?.perk || 0,
    secondaryRuneStyle: p.perks?.styles?.[1]?.style || 0,
    summoner1Id: p.summoner1Id,
    summoner2Id: p.summoner2Id,
  }));

  // Calculate team total kills & damage for KP% and Damage Share%
  const teamStats: Record<number, { kills: number; damage: number }> = {};
  participants.forEach((p: any) => {
    if (!teamStats[p.teamId]) teamStats[p.teamId] = { kills: 0, damage: 0 };
    teamStats[p.teamId].kills += p.kills;
    teamStats[p.teamId].damage += p.totalDamageDealtToChampions;
  });

  const enrichedParticipants = participants.map((p: any) => {
    const tStats = teamStats[p.teamId] || { kills: 1, damage: 1 };
    const killParticipation = tStats.kills > 0 ? Math.round(((p.kills + p.assists) / tStats.kills) * 100) : 0;
    const damageShare = tStats.damage > 0 ? Math.round((p.totalDamageDealtToChampions / tStats.damage) * 100) : 0;
    return {
      ...p,
      killParticipation,
      damageShare,
    };
  });

  return {
    matchId: rawMatch.metadata.matchId,
    gameCreation: info.gameCreation,
    gameDuration: info.gameDuration, // seconds
    gameMode: info.gameMode,
    queueId: info.queueId,
    queueName: QUEUE_MAP[info.queueId] || info.gameMode,
    teams,
    participants: enrichedParticipants,
  };
}

// ponytail: Mock Data Generator when Riot API key is unconfigured or rate limited
export function generateMockProfile(gameName: string, tagLine: string) {
  const mockPuuid = `mock-puuid-${gameName}-${tagLine}`;
  const mockSummoner: RiotSummoner = {
    id: `mock-summoner-${gameName}`,
    accountId: `mock-account-${gameName}`,
    puuid: mockPuuid,
    profileIconId: 588, // Poro icon
    revisionDate: Date.now(),
    summonerLevel: 324,
  };

  const mockLeagues: RiotLeagueEntry[] = [
    {
      leagueId: "mock-league-solo",
      queueType: "RANKED_SOLO_5x5",
      tier: "EMERALD",
      rank: "I",
      summonerId: mockSummoner.id,
      leaguePoints: 74,
      wins: 142,
      losses: 118,
      veteran: false,
      inactive: false,
      freshBlood: false,
      hotStreak: true,
    },
    {
      leagueId: "mock-league-flex",
      queueType: "RANKED_FLEX_SR",
      tier: "GOLD",
      rank: "II",
      summonerId: mockSummoner.id,
      leaguePoints: 35,
      wins: 38,
      losses: 25,
      veteran: false,
      inactive: false,
      freshBlood: false,
      hotStreak: false,
    },
  ];

  const champions = [
    { id: 157, name: "Yasuo", key: "Yasuo" },
    { id: 238, name: "Zed", key: "Zed" },
    { id: 103, name: "Ahri", key: "Ahri" },
    { id: 222, name: "Jinx", key: "Jinx" },
    { id: 64, name: "LeeSin", key: "LeeSin" },
    { id: 84, name: "Akali", key: "Akali" },
  ];

  const mockMatches = Array.from({ length: 15 }).map((_, idx) => {
    const isWin = idx % 3 !== 0;
    const champ = champions[idx % champions.length];
    const duration = 1500 + (idx * 37) % 600;
    const kills = 4 + (idx * 3) % 11;
    const deaths = 1 + (idx * 2) % 7;
    const assists = 5 + (idx * 4) % 12;

    return {
      matchId: `KR-MOCK-${7000000000 + idx}`,
      gameCreation: Date.now() - idx * 3600000 * 4,
      gameDuration: duration,
      gameMode: "CLASSIC",
      queueId: idx % 4 === 0 ? 450 : 420,
      queueName: idx % 4 === 0 ? "무작위 총력전" : "솔랭",
      teams: [
        { teamId: 100, win: isWin, objectives: { baron: 1, dragon: 3, tower: 8 } },
        { teamId: 200, win: !isWin, objectives: { baron: 0, dragon: 1, tower: 3 } },
      ],
      participants: [
        {
          puuid: mockPuuid,
          summonerName: gameName,
          riotIdGameName: gameName,
          riotIdTagline: tagLine,
          championId: champ.id,
          championName: champ.key,
          champLevel: 14 + (idx % 5),
          teamId: 100,
          win: isWin,
          kills,
          deaths,
          assists,
          kda: deaths === 0 ? (kills + assists).toFixed(2) : ((kills + assists) / deaths).toFixed(2),
          totalDamageDealtToChampions: 18000 + idx * 1250,
          totalDamageTaken: 14000 + idx * 800,
          goldEarned: 11000 + idx * 600,
          totalMinionsKilled: 160 + idx * 12,
          visionScore: 24 + idx * 2,
          killParticipation: 65 + (idx % 25),
          damageShare: 28 + (idx % 12),
          items: [3031, 3072, 3006, 1055, 3036, 3026, 3340],
          primaryRune: 8008,
          secondaryRuneStyle: 8100,
          summoner1Id: 4, // Flash
          summoner2Id: 14, // Ignite
        },
        ...Array.from({ length: 9 }).map((_, pIdx) => {
          const pTeam = pIdx < 4 ? 100 : 200;
          const pChamp = champions[(pIdx + idx + 1) % champions.length];
          return {
            puuid: `mock-puuid-other-${pIdx}`,
            summonerName: `Player${pIdx + 1}`,
            riotIdGameName: `Player${pIdx + 1}`,
            riotIdTagline: "KR1",
            championId: pChamp.id,
            championName: pChamp.key,
            champLevel: 13,
            teamId: pTeam,
            win: pTeam === 100 ? isWin : !isWin,
            kills: 3 + pIdx,
            deaths: 4 + pIdx,
            assists: 6 + pIdx,
            kda: "2.1",
            totalDamageDealtToChampions: 14000,
            totalDamageTaken: 16000,
            goldEarned: 9500,
            totalMinionsKilled: 140,
            visionScore: 18,
            killParticipation: 45,
            damageShare: 18,
            items: [3031, 3006, 1055, 0, 0, 0, 3340],
            primaryRune: 8008,
            secondaryRuneStyle: 8100,
            summoner1Id: 4,
            summoner2Id: 12,
          };
        }),
      ],
    };
  });

  return {
    account: { puuid: mockPuuid, gameName, tagLine },
    summoner: mockSummoner,
    leagues: mockLeagues,
    matches: mockMatches,
    isMock: true,
  };
}
