"use client";

import { DashboardMode } from "@/lib/config";

interface HeaderProps {
  mode: DashboardMode;
  onModeChange: (mode: DashboardMode) => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
  const modes: { key: DashboardMode; label: string; icon: string }[] = [
    { key: "normal", label: "全部", icon: "🏠" },
    { key: "professional", label: "求职", icon: "💼" },
    { key: "gaming", label: "游戏", icon: "🎮" },
  ];

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">个人 Dashboard</h1>
        <p className="text-gray-400 mt-1">GitHub / LeetCode / Steam 数据总览</p>
      </div>

      <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => onModeChange(m.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === m.key
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>
    </header>
  );
}
