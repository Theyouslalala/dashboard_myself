import { createCache } from "./cache";

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number; // minutes
  playtime_2weeks?: number;
  img_icon_url: string;
  rtime_last_played?: number; // unix timestamp
}

export interface SteamPlayerSummary {
  steamid: string;
  personaname: string;
  avatarfull: string;
  profileurl: string;
  personastate: number;
}

interface SteamOwnedGamesResponse {
  response: {
    game_count: number;
    games: SteamGame[];
  };
}

interface SteamPlayerSummaryResponse {
  response: {
    players: SteamPlayerSummary[];
  };
}

const cache = createCache<unknown>(20, 10 * 60 * 1000);

function validateSteamId(steamId: string): boolean {
  return /^\d{17}$/.test(steamId);
}

export async function getOwnedGames(
  apiKey: string,
  steamId: string
): Promise<SteamGame[]> {
  if (!validateSteamId(steamId)) throw new Error("Invalid Steam ID format");

  const cacheKey = `owned_${steamId}`;
  const cached = cache.get(cacheKey) as SteamGame[] | null;
  if (cached) return cached;

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Steam API error: ${res.status}`);

  const data: SteamOwnedGamesResponse = await res.json();
  const games = data.response.games || [];
  cache.set(cacheKey, games);
  return games;
}

export async function getPlayerSummary(
  apiKey: string,
  steamId: string
): Promise<SteamPlayerSummary | null> {
  if (!validateSteamId(steamId)) throw new Error("Invalid Steam ID format");

  const cacheKey = `summary_${steamId}`;
  const cached = cache.get(cacheKey) as SteamPlayerSummary | null;
  if (cached) return cached;

  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}&format=json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Steam API error: ${res.status}`);

  const data: SteamPlayerSummaryResponse = await res.json();
  const player = data.response.players[0] || null;
  cache.set(cacheKey, player);
  return player;
}

export async function getRecentlyPlayedGames(
  apiKey: string,
  steamId: string
): Promise<SteamGame[]> {
  if (!validateSteamId(steamId)) throw new Error("Invalid Steam ID format");

  const cacheKey = `recent_${steamId}`;
  const cached = cache.get(cacheKey) as SteamGame[] | null;
  if (cached) return cached;

  const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Steam API error: ${res.status}`);

  const data: SteamOwnedGamesResponse = await res.json();
  const games = data.response.games || [];
  cache.set(cacheKey, games);
  return games;
}

export function getGameHeaderUrl(appid: number): string {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`;
}

export function formatPlaytime(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 100) return `${hours}h${minutes % 60}m`;
  return `${hours}h`;
}

export function getLastPlayedDate(timestamp?: number): string {
  if (!timestamp) return "Never";
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}
