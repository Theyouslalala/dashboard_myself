import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { apiError } from "@/lib/errors";
import {
  getOwnedGames,
  getPlayerSummary,
  getRecentlyPlayedGames,
} from "@/lib/steam";

export async function GET() {
  const config = getConfig();
  const { apiKey, userId } = config.steam;

  if (!apiKey || !userId) {
    return NextResponse.json(
      { error: "Steam API Key or User ID not configured" },
      { status: 400 }
    );
  }

  try {
    const [games, player, recentGames] = await Promise.all([
      getOwnedGames(apiKey, userId),
      getPlayerSummary(apiKey, userId),
      getRecentlyPlayedGames(apiKey, userId),
    ]);

    const totalPlaytime = games.reduce(
      (sum, g) => sum + g.playtime_forever,
      0
    );
    const recentPlaytime = recentGames.reduce(
      (sum, g) => sum + (g.playtime_2weeks || 0),
      0
    );

    return NextResponse.json({
      player: player
        ? {
            name: player.personaname,
            avatar: player.avatarfull,
            profileUrl: player.profileurl,
          }
        : null,
      stats: {
        totalGames: games.length,
        totalPlaytime,
        recentGamesCount: recentGames.length,
        recentPlaytime,
      },
      games: [...games]
        .sort(
          (a, b) => (b.rtime_last_played || 0) - (a.rtime_last_played || 0)
        )
        .map((g) => ({
          appid: g.appid,
          name: g.name,
          playtimeForever: g.playtime_forever,
          playtimeRecent: g.playtime_2weeks || 0,
          lastPlayed: g.rtime_last_played,
        })),
    });
  } catch (err: unknown) {
    return apiError(err, "Steam");
  }
}
