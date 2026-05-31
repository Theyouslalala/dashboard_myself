"use client";

import { useState } from "react";
import Header from "@/components/Header";
import GitHubCard from "@/components/GitHubCard";
import LeetCodeCard from "@/components/LeetCodeCard";
import SteamSection from "@/components/SteamSection";
import { DashboardMode } from "@/lib/config";

export default function Home() {
  const [mode, setMode] = useState<DashboardMode>("normal");

  const showSteam = mode === "normal" || mode === "gaming";

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <Header mode={mode} onModeChange={setMode} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GitHub Column */}
        <div className="animate-fade-in">
          <GitHubCard />
        </div>

        {/* LeetCode Column */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <LeetCodeCard />
        </div>

        {/* Steam Column - conditionally shown */}
        {showSteam && (
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <SteamSection />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600 text-sm pb-6">
        <p>
          Built with Next.js + Tailwind CSS |{" "}
          <a
            href="https://github.com/Theyouslalala"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-400 transition-colors"
          >
            @Theyouslalala
          </a>
        </p>
      </footer>
    </main>
  );
}
