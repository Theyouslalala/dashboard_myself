"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SteamGameView } from "@/lib/types";

interface StatsChartProps {
  games: SteamGameView[];
}

const COLORS = [
  "#22d3ee",
  "#6366f1",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#f97316",
  "#818cf8",
  "#2dd4bf",
  "#e879f9",
];

export default function StatsChart({ games }: StatsChartProps) {
  const top10 = useMemo(
    () =>
      [...games]
        .sort((a, b) => b.playtimeForever - a.playtimeForever)
        .slice(0, 10)
        .map((g) => ({
          name: g.name.length > 14 ? g.name.slice(0, 14) + ".." : g.name,
          hours: Math.round(g.playtimeForever / 60),
          fullName: g.name,
        })),
    [games]
  );

  if (top10.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-600 font-mono text-sm">
        NO DATA AVAILABLE
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-slate-500 tracking-wider">TOP 10 BY PLAYTIME</span>
        <span className="text-[10px] text-slate-600 font-mono">HOURS</span>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={top10}
          layout="vertical"
          margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={95}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(34, 211, 238, 0.03)" }}
            contentStyle={{
              background: "rgba(17, 24, 39, 0.95)",
              border: "1px solid rgba(34, 211, 238, 0.2)",
              borderRadius: "8px",
              color: "#e2e8f0",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
            formatter={(value, _name, props) => [
              `${value}h`,
              (props.payload as { fullName?: string }).fullName || "",
            ]}
          />
          <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={16}>
            {top10.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
