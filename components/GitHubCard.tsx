"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { ContributionDay, GitHubData } from "@/lib/types";

const LEVEL_COLORS = [
  "bg-slate-800/60",
  "bg-emerald-900/80",
  "bg-emerald-700/80",
  "bg-emerald-500/80",
  "bg-emerald-400",
];

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
};

function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-800 animate-pulse" />
        <div className="h-6 w-24 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="h-32 bg-slate-800/50 rounded-lg animate-pulse" />
      <div className="h-40 bg-slate-800/50 rounded-lg animate-pulse" />
    </div>
  );
}

export default function GitHubCard() {
  const { data, error, isLoading } = useSWR<GitHubData>(
    "/api/github",
    fetcher,
    { refreshInterval: 10 * 60 * 1000 }
  );

  if (isLoading) return <SkeletonCard />;

  if (error || !data) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-3 opacity-40">⊘</div>
        <p className="text-slate-500 text-sm font-mono">
          {error ? "CONNECTION FAILED" : "CONFIGURE GITHUB USERNAME"}
        </p>
      </div>
    );
  }

  const { user, repos, contributions } = data;

  const weeks = useMemo(() => {
    const result: ContributionDay[][] = [];
    for (let i = 0; i < contributions.length; i += 7) {
      result.push(contributions.slice(i, i + 7));
    }
    return result;
  }, [contributions]);

  return (
    <div className="card p-6 space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <svg className="w-7 h-7 text-slate-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">GitHub</h2>
          <span className="text-[10px] font-mono text-slate-600 tracking-wider">CONTRIBUTIONS</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/40">
        <div className="relative">
          <img
            src={user.avatarUrl}
            alt={`${user.login}'s avatar`}
            className="w-12 h-12 rounded-full ring-2 ring-slate-700/50"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 truncate">{user.login}</h3>
          {user.bio && <p className="text-slate-500 text-xs mt-0.5 truncate">{user.bio}</p>}
        </div>
        <div className="flex gap-5 text-center">
          <div>
            <p className="stat-number text-lg font-bold text-slate-100">{user.publicRepos}</p>
            <p className="text-[10px] text-slate-600 font-mono">REPOS</p>
          </div>
          <div>
            <p className="stat-number text-lg font-bold text-slate-100">{user.followers}</p>
            <p className="text-[10px] text-slate-600 font-mono">FOLLOW</p>
          </div>
        </div>
      </div>

      {/* Contribution Heatmap */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-slate-500 tracking-wider">ACTIVITY MAP</span>
          <span className="text-[10px] text-slate-600">{contributions.length} days</span>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-[3px]" role="img" aria-label={`Contribution heatmap: ${contributions.length} days`}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} contributions`}
                    className={`contrib-cell ${LEVEL_COLORS[day.level]}`}
                    aria-label={`${day.date}: ${day.count} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 justify-end">
          <span className="text-[10px] text-slate-600 mr-1">Less</span>
          {LEVEL_COLORS.map((c, i) => (
            <div key={i} className={`contrib-cell ${c}`} />
          ))}
          <span className="text-[10px] text-slate-600 ml-1">More</span>
        </div>
      </div>

      {/* Recent Repos */}
      <div>
        <span className="text-xs font-mono text-slate-500 tracking-wider block mb-3">RECENT REPOS</span>
        <div className="space-y-2 stagger-children">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg bg-slate-900/30 border border-slate-800/30 hover:border-cyan-500/20 hover:bg-slate-900/50 transition-all duration-200 animate-fade-in-up"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-cyan-400 text-sm font-medium">{repo.name}</span>
                {repo.language && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: LANG_COLORS[repo.language] || "#6b7280" }}
                    />
                    {repo.language}
                  </span>
                )}
              </div>
              {repo.description && (
                <p className="text-slate-500 text-xs line-clamp-2">{repo.description}</p>
              )}
              {(repo.stars > 0 || repo.forks > 0) && (
                <div className="flex gap-3 mt-1.5 text-[10px] text-slate-600 font-mono">
                  {repo.stars > 0 && <span>★ {repo.stars}</span>}
                  {repo.forks > 0 && <span>⑂ {repo.forks}</span>}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
