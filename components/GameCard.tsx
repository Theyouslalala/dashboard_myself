"use client";

import { memo } from "react";
import { getGameHeaderUrl, formatPlaytime, getLastPlayedDate } from "@/lib/steam";
import type { SteamGameView } from "@/lib/types";

type GameCardProps = SteamGameView;

const GameCard = memo(function GameCard({
  appid,
  name,
  playtimeForever,
  playtimeRecent,
  lastPlayed,
}: GameCardProps) {
  return (
    <div className="game-card group animate-fade-in-up">
      {/* Image */}
      <div className="aspect-[460/215] relative overflow-hidden">
        <img
          src={getGameHeaderUrl(appid)}
          alt={`${name} game artwork`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (!img.src.startsWith("data:")) {
              img.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='460' height='215' fill='%23111827'%3E%3Crect width='460' height='215'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23374151' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
            }
          }}
        />
        <div className="game-card-overlay" />

        {/* Active badge */}
        {playtimeRecent > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-300">ACTIVE</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 relative">
        <h3 className="text-sm font-medium text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="stat-number text-[11px] text-slate-400">
            {formatPlaytime(playtimeForever)}
          </span>
          <span className="text-[10px] text-slate-600 font-mono">
            {getLastPlayedDate(lastPlayed)}
          </span>
        </div>
      </div>
    </div>
  );
});

export default GameCard;
