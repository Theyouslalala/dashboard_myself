"use client";

import { getGameHeaderUrl, formatPlaytime, getLastPlayedDate } from "@/lib/steam";

interface GameCardProps {
  appid: number;
  name: string;
  playtimeForever: number;
  playtimeRecent: number;
  lastPlayed?: number;
}

export default function GameCard({
  appid,
  name,
  playtimeForever,
  playtimeRecent,
  lastPlayed,
}: GameCardProps) {
  return (
    <div className="group relative rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-750 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10">
      <div className="aspect-[460/215] relative overflow-hidden">
        <img
          src={getGameHeaderUrl(appid)}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDYwIiBoZWlnaHQ9IjIxNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDYwIiBoZWlnaHQ9IjIxNSIgZmlsbD0iIzJkM2Q0ZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmI3MjgwIiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
          }}
        />
        {playtimeRecent > 0 && (
          <div className="absolute top-2 right-2 bg-green-600/90 text-white text-xs px-2 py-0.5 rounded-full">
            最近活跃
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-white font-medium text-sm truncate">{name}</h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-gray-400 text-xs">
            {formatPlaytime(playtimeForever)}
          </span>
          <span className="text-gray-500 text-xs">
            {getLastPlayedDate(lastPlayed)}
          </span>
        </div>
      </div>
    </div>
  );
}
