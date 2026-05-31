"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface GameData {
  appid: number;
  name: string;
  playtimeForever: number;
}

interface StatsChartProps {
  games: GameData[];
}

const COLORS = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
];

export default function StatsChart({ games }: StatsChartProps) {
  const top10 = games
    .sort((a, b) => b.playtimeForever - a.playtimeForever)
    .slice(0, 10)
    .map((g) => ({
      name: g.name.length > 12 ? g.name.slice(0, 12) + "..." : g.name,
      hours: Math.round(g.playtimeForever / 60),
      fullName: g.name,
    }));

  if (top10.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        暂无游戏数据
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <h3 className="text-white font-medium mb-3">游玩时长 Top 10</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={top10}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        >
          <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fill: "#d1d5db", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value, _name, props) => [
              `${value} 小时`,
              (props.payload as { fullName?: string }).fullName || "",
            ]}
          />
          <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
            {top10.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
