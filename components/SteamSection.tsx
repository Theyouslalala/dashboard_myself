"use client";

import useSWR from "swr";
import GameCard from "./GameCard";
import StatsChart from "./StatsChart";

interface SteamData {
  player: {
    name: string;
    avatar: string;
    profileUrl: string;
  } | null;
  stats: {
    totalGames: number;
    totalPlaytime: number;
    recentGamesCount: number;
    recentPlaytime: number;
  };
  games: {
    appid: number;
    name: string;
    playtimeForever: number;
    playtimeRecent: number;
    lastPlayed?: number;
  }[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SteamSection() {
  const { data, error, isLoading } = useSWR<SteamData>(
    "/api/steam",
    fetcher,
    { refreshInterval: 10 * 60 * 1000 }
  );

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="bg-gray-800/50 rounded-lg p-6 text-center">
        <p className="text-gray-400">
          {error ? "Steam 数据加载失败" : "请配置 Steam API Key"}
        </p>
      </section>
    );
  }

  const { player, stats, games } = data;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 256 256" fill="none">
          <path
            d="M127.6 0C57.2 0 0 57.2 0 127.6c0 70.4 57.2 127.6 127.6 127.6s127.6-57.2 127.6-127.6C255.2 57.2 198 0 127.6 0zM69.5 177.2l32.7-14.1c1.8 3.6 4.5 6.6 7.9 8.7l-18.3 26.3c-15.4-6.3-22.3-22.3-22.3-20.9zm128.4 12.1l-18.8-27.2c3.5-2.1 6.3-5.2 8.1-9l34 14.6c-1 16.4-8.3 22.6-23.3 21.6zm-65.5-45.3c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5 24.5 11 24.5 24.5-11 24.5-24.5 24.5zm59.3-34.5c-2-14.7-14.4-25.9-29.3-25.9-2.5 0-5 .3-7.4.9l-22.3-12.9 1.3-31.5 21.5 12.4c11.4-5 24.4-2.8 33.4 5.7 9 8.5 11.7 21.3 7 32.4l.2.1-4.4 18.8z"
            fill="#1b2838"
          />
          <path
            d="M127.6 0C57.2 0 0 57.2 0 127.6c0 70.4 57.2 127.6 127.6 127.6s127.6-57.2 127.6-127.6C255.2 57.2 198 0 127.6 0z"
            fill="#66c0f4"
            opacity="0.2"
          />
        </svg>
        <div>
          <h2 className="text-2xl font-bold text-white">Steam 游戏库</h2>
          {player && (
            <p className="text-gray-400 text-sm">
              {player.name}
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm">总游戏数</p>
          <p className="text-2xl font-bold text-white">{stats.totalGames}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm">总游玩时长</p>
          <p className="text-2xl font-bold text-white">
            {Math.round(stats.totalPlaytime / 60)} 小时
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <p className="text-gray-400 text-sm">近 2 周活跃</p>
          <p className="text-2xl font-bold text-white">
            {stats.recentGamesCount} 款 /{" "}
            {Math.round(stats.recentPlaytime / 60)} 小时
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
        <StatsChart games={games} />
      </div>

      {/* Game Cards */}
      <div>
        <h3 className="text-white font-medium mb-3">全部游戏</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {games.map((game) => (
            <GameCard key={game.appid} {...game} />
          ))}
        </div>
      </div>
    </section>
  );
}
