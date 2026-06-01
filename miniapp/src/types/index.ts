// 与 Web 端 lib/types.ts 保持一致的接口定义

export type DashboardMode = "normal" | "professional" | "gaming";

// ─── GitHub ───

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubRepoView {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
  url: string;
  topics: string[];
}

export interface GitHubUserView {
  login: string;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
}

export interface GitHubData {
  user: GitHubUserView;
  repos: GitHubRepoView[];
  contributions: ContributionDay[];
}

// ─── LeetCode ───

export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
}

// ─── Steam ───

export interface SteamGameView {
  appid: number;
  name: string;
  playtimeForever: number;
  playtimeRecent: number;
  lastPlayed?: number;
}

export interface SteamPlayerView {
  name: string;
  avatar: string;
  profileUrl: string;
}

export interface SteamStats {
  totalGames: number;
  totalPlaytime: number;
  recentGamesCount: number;
  recentPlaytime: number;
}

export interface SteamData {
  player: SteamPlayerView | null;
  stats: SteamStats;
  games: SteamGameView[];
}

// ─── 通用 ───

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
