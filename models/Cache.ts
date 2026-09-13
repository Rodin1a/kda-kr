import mongoose, { Schema } from "mongoose";

// 1. Account Cache (GameName#TagLine -> PUUID) - TTL 30 days
const AccountCacheSchema = new Schema({
  riotIdKey: { type: String, required: true, unique: true, index: true }, // lowercase "gamename#tagline"
  gameName: String,
  tagLine: String,
  puuid: String,
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 }, // 30 days TTL
});

// 2. League & Summoner Rank Cache - TTL 15 minutes
const LeagueCacheSchema = new Schema({
  puuid: { type: String, required: true, unique: true, index: true },
  summoner: Object,
  leagues: Array,
  createdAt: { type: Date, default: Date.now, expires: 60 * 15 }, // 15 minutes TTL
});

// 3. Match Detail Cache (Data Pruned) - TTL 30 days
const MatchCacheSchema = new Schema({
  matchId: { type: String, required: true, unique: true, index: true },
  prunedData: Object,
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 }, // 30 days TTL
});

export const AccountCache =
  mongoose.models.AccountCache || mongoose.model("AccountCache", AccountCacheSchema);

export const LeagueCache =
  mongoose.models.LeagueCache || mongoose.model("LeagueCache", LeagueCacheSchema);

export const MatchCache =
  mongoose.models.MatchCache || mongoose.model("MatchCache", MatchCacheSchema);
