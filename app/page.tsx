"use client";

import { useState } from "react";
import Header from "@/components/Header";
import GitHubCard from "@/components/GitHubCard";
import LeetCodeCard from "@/components/LeetCodeCard";
import SteamSection from "@/components/SteamSection";
import type { DashboardMode } from "@/lib/types";

const STEAM_MODES: DashboardMode[] = ["normal", "gaming"];

export default function Home() {
  const [mode, setMode] = useState<DashboardMode>("normal");

  const showSteam = STEAM_MODES.includes(mode);

  return (
    <main id="main" className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto relative z-10">
      <Header mode={mode} onModeChange={setMode} />

      <div className={`grid gap-6 ${
        showSteam
          ? "grid-cols-1 lg:grid-cols-3"
          : "grid-cols-1 lg:grid-cols-2"
      }`}>
        <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <GitHubCard />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <LeetCodeCard />
        </div>

        {showSteam && (
          <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <SteamSection />
          </div>
        )}
      </div>
      <footer className="mt-16 pb-8">
        <div className="glow-line mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-700">
          <span>Built with Next.js + Tailwind CSS + Recharts</span>
          <a
            href="https://github.com/Theyouslalala"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-cyan-500 transition-colors"
          >
            @Theyouslalala
          </a>
        </div>
      </footer>
    </main>
  );
}
