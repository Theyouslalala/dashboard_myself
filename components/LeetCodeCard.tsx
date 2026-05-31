"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { LeetCodeStats } from "@/lib/types";

interface DifficultyBarProps {
  label: string;
  solved: number;
  total: number;
  color: string;
  glowColor: string;
}

function DifficultyBar({
  label,
  solved,
  total,
  color,
  glowColor,
}: DifficultyBarProps) {
  const pct = total > 0 ? (solved / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${color}`}>{label}</span>
        <span className="stat-number text-xs text-slate-400">
          {solved} <span className="text-slate-600">/ {total}</span>
        </span>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${glowColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function LeetCodeCard() {
  const { data, error, isLoading } = useSWR<LeetCodeStats>(
    "/api/leetcode",
    fetcher,
    { refreshInterval: 10 * 60 * 1000 }
  );

  if (isLoading) {
    return (
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 animate-pulse" />
          <div className="h-6 w-28 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="h-48 bg-slate-800/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-3 opacity-40">⊘</div>
        <p className="text-slate-500 text-sm font-mono">
          {error ? "CONNECTION FAILED" : "CONFIGURE LEETCODE USERNAME"}
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074 2.21-2.207 2.246-5.806.076-8.04L13.483 0zm2.317 8.237a2.143 2.143 0 0 1 3.035 0 2.143 2.143 0 0 1 0 3.035l-6.47 6.47a2.143 2.143 0 0 1-3.035 0 2.143 2.143 0 0 1 0-3.035l6.47-6.47z"
            fill="#ffa116"
          />
        </svg>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">LeetCode</h2>
          <span className="text-[10px] font-mono text-slate-600 tracking-wider">PROGRESS</span>
        </div>
      </div>

      {/* Central Solved Count */}
      <div className="text-center py-4">
        <p className="stat-number text-5xl font-bold bg-gradient-to-b from-amber-300 to-amber-500 bg-clip-text text-transparent">
          {data.totalSolved}
        </p>
        <p className="text-xs text-slate-500 font-mono mt-1 tracking-wider">PROBLEMS SOLVED</p>
      </div>

      {/* Difficulty Breakdown */}
      <div className="space-y-4">
        <DifficultyBar
          label="Easy"
          solved={data.easySolved}
          total={data.totalEasy}
          color="text-emerald-400"
          glowColor="bg-emerald-500"
        />
        <DifficultyBar
          label="Medium"
          solved={data.mediumSolved}
          total={data.totalMedium}
          color="text-amber-400"
          glowColor="bg-amber-500"
        />
        <DifficultyBar
          label="Hard"
          solved={data.hardSolved}
          total={data.totalHard}
          color="text-rose-400"
          glowColor="bg-rose-500"
        />
      </div>

      {/* Ranking */}
      {data.ranking > 0 && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800/30">
          <span className="text-xs text-slate-500 font-mono tracking-wider">GLOBAL RANK</span>
          <span className="stat-number text-sm font-bold text-violet-400">
            #{data.ranking.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
