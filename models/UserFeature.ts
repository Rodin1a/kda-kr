import mongoose, { Schema } from "mongoose";

// Favorite Summoner Schema
const FavoriteSchema = new Schema({
  riotId: { type: String, required: true, unique: true },
  gameName: String,
  tagLine: String,
  profileIconId: Number,
  createdAt: { type: Date, default: Date.now },
});

// Search Log Schema for Trending / Recent Searches
const SearchLogSchema = new Schema({
  riotId: { type: String, required: true, index: true },
  gameName: String,
  tagLine: String,
  count: { type: Number, default: 1 },
  lastSearchedAt: { type: Date, default: Date.now },
});

export const Favorite =
  mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);

export const SearchLog =
  mongoose.models.SearchLog || mongoose.model("SearchLog", SearchLogSchema);
