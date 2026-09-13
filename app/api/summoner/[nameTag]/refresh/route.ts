import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { LeagueCache, AccountCache } from "@/models/Cache";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ nameTag: string }> }
) {
  try {
    const { nameTag } = await params;
    const rawNameTag = decodeURIComponent(nameTag);
    const hashIndex = rawNameTag.lastIndexOf("#");
    if (hashIndex === -1) {
      return NextResponse.json({ error: "잘못된 소환사 태그입니다." }, { status: 400 });
    }

    const gameName = rawNameTag.substring(0, hashIndex).trim();
    const tagLine = rawNameTag.substring(hashIndex + 1).trim();

    const db = await connectToDatabase();
    if (db) {
      const account = await AccountCache.findOne({
        riotIdKey: `${gameName}#${tagLine}`.toLowerCase(),
      });
      if (account) {
        await LeagueCache.deleteOne({ puuid: account.puuid });
      }
    }

    return NextResponse.json({ success: true, message: "전적이 갱신되었습니다." });
  } catch (error) {
    return NextResponse.json({ error: "전적 갱신 중 오류 발생" }, { status: 500 });
  }
}
