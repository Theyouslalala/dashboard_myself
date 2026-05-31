"use client";

import type { DashboardMode } from "@/lib/types";

interface HeaderProps {
  mode: DashboardMode;
  onModeChange: (mode: DashboardMode) => void;
}

const MODES: { key: DashboardMode; label: string; sublabel: string; icon: string }[] = [
  { key: "normal", label: "全部", sublabel: "ALL", icon: "◎" },
  { key: "professional", label: "求职", sublabel: "WORK", icon: "◈" },
  { key: "gaming", label: "游戏", sublabel: "PLAY", icon: "◉" },
];

export default function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="mb-10 animate-fade-in-up">
      {/* Top bar with glow line */}
      <div className="glow-line mb-8" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Title section */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-emerald-400/70">
              System Online
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-100 to-violet-300 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-mono">
            &lt;/&gt; GitHub ・ LeetCode ・ Steam
          </p>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800/60" role="radiogroup" aria-label="Dashboard mode">
          {MODES.map((m) => (
            <button
              key={m.key}
              role="radio"
              aria-checked={mode === m.key}
              onClick={() => onModeChange(m.key)}
              className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                mode === m.key
                  ? "bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`text-base ${mode === m.key ? "text-cyan-400" : "text-slate-600"}`}>
                  {m.icon}
                </span>
                <span>{m.label}</span>
                <span className={`hidden sm:inline text-[10px] font-mono tracking-wider ${
                  mode === m.key ? "text-cyan-500/60" : "text-slate-700"
                }`}>
                  {m.sublabel}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="glow-line mt-8" />
    </header>
  );
}
