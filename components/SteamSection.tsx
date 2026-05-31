"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { SteamData } from "@/lib/types";
import GameCard from "./GameCard";
import StatsChart from "./StatsChart";

function StatBox({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/30">
      <p className="text-[10px] font-mono text-slate-600 tracking-wider mb-1">{label}</p>
      <p className="stat-number text-2xl font-bold text-slate-100">{value}</p>
      {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function SteamSection() {
  const { data, error, isLoading } = useSWR<SteamData>(
    "/api/steam",
    fetcher,
    { refreshInterval: 10 * 60 * 1000 }
  );

  if (isLoading) {
    return (
      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 animate-pulse" />
          <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-slate-800/50 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-slate-800/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-3 opacity-40">⊘</div>
        <p className="text-slate-500 text-sm font-mono">
          {error ? "CONNECTION FAILED" : "CONFIGURE STEAM API KEY"}
        </p>
      </div>
    );
  }

  const { player, stats, games } = data;

  return (
    <div className="card p-6 space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <svg className="w-7 h-7 text-slate-300" viewBox="0 0 256 256" fill="none" aria-hidden="true">
          <path
            d="M127.6 0C57.2 0 0 57.2 0 127.6c0 70.4 57.2 127.6 127.6 127.6s127.6-57.2 127.6-127.6C255.2 57.2 198 0 127.6 0z"
            fill="#1b2838"
          />
          <path
            d="M127.6 0C57.2 0 0 57.2 0 127.6c0 70.4 57.2 127.6 127.6 127.6s127.6-57.2 127.6-127.6C255.2 57.2 198 0 127.6 0z"
            fill="#66c0f4"
            opacity="0.15"
          />
        </svg>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Steam</h2>
          <span className="text-[10px] font-mono text-slate-600 tracking-wider">GAME LIBRARY</span>
        </div>
        {player && (
          <span className="ml-auto text-xs text-slate-500 font-mono">{player.name}</span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox label="GAMES" value={stats.totalGames} />
        <StatBox
          label="PLAYTIME"
          value={`${Math.round(stats.totalPlaytime / 60)}h`}
        />
        <StatBox
          label="RECENT 2W"
          value={stats.recentGamesCount}
          sub={`${Math.round(stats.recentPlaytime / 60)}h played`}
        />
      </div>

      {/* Chart */}
      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/20">
        <StatsChart games={games} />
      </div>

      {/* Game Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-slate-500 tracking-wider">ALL GAMES</span>
          <span className="text-[10px] text-slate-600 font-mono">{games.length} titles</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger-children">
          {games.map((game) => (
            <GameCard key={game.appid} {...game} />
          ))}
        </div>
      </div>
    </div>
  );
}
