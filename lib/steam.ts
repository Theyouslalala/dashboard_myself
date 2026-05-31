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

export interface SteamOwnedGamesResponse {
  response: {
    game_count: number;
    games: SteamGame[];
  };
}

export interface SteamPlayerSummaryResponse {
  response: {
    players: SteamPlayerSummary[];
  };
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, { data: unknown; timestamp: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function getOwnedGames(
  apiKey: string,
  steamId: string
): Promise<SteamGame[]> {
  const cacheKey = `owned_${steamId}`;
  const cached = getCached<SteamGame[]>(cacheKey);
  if (cached) return cached;

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Steam API error: ${res.status}`);

  const data: SteamOwnedGamesResponse = await res.json();
  const games = data.response.games || [];
  setCache(cacheKey, games);
  return games;
}

export async function getPlayerSummary(
  apiKey: string,
  steamId: string
): Promise<SteamPlayerSummary | null> {
  const cacheKey = `summary_${steamId}`;
  const cached = getCached<SteamPlayerSummary | null>(cacheKey);
  if (cached) return cached;

  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Steam API error: ${res.status}`);

  const data: SteamPlayerSummaryResponse = await res.json();
  const player = data.response.players[0] || null;
  setCache(cacheKey, player);
  return player;
}

export async function getRecentlyPlayedGames(
  apiKey: string,
  steamId: string
): Promise<SteamGame[]> {
  const cacheKey = `recent_${steamId}`;
  const cached = getCached<SteamGame[]>(cacheKey);
  if (cached) return cached;

  const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Steam API error: ${res.status}`);

  const data = await res.json();
  const games = data.response.games || [];
  setCache(cacheKey, games);
  return games;
}

export function getGameHeaderUrl(appid: number): string {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`;
}

export function formatPlaytime(minutes: number): string {
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  if (hours < 100) return `${hours}小时${minutes % 60}分钟`;
  return `${hours}小时`;
}

export function getLastPlayedDate(timestamp?: number): string {
  if (!timestamp) return "从未游玩";
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
  return `${Math.floor(diffDays / 365)}年前`;
}
