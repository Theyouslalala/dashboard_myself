"use client";

import useSWR from "swr";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
  url: string;
}

interface GitHubData {
  user: {
    login: string;
    avatarUrl: string;
    bio: string | null;
    publicRepos: number;
    followers: number;
    following: number;
  };
  repos: GitHubRepo[];
  contributions: ContributionDay[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const LEVEL_COLORS = [
  "bg-gray-800",
  "bg-green-900",
  "bg-green-700",
  "bg-green-500",
  "bg-green-400",
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

export default function GitHubCard() {
  const { data, error, isLoading } = useSWR<GitHubData>(
    "/api/github",
    fetcher,
    { refreshInterval: 10 * 60 * 1000 }
  );

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-6 w-24 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="h-32 bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-40 bg-gray-800 rounded-lg animate-pulse" />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="bg-gray-800/50 rounded-lg p-6 text-center">
        <p className="text-gray-400">
          {error ? "GitHub 数据加载失败" : "请配置 GitHub 用户名"}
        </p>
      </section>
    );
  }

  const { user, repos, contributions } = data;

  // Group contributions into weeks
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        <h2 className="text-2xl font-bold text-white">GitHub</h2>
      </div>

      {/* User Info */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 flex items-center gap-4">
        <img
          src={user.avatarUrl}
          alt={user.login}
          className="w-14 h-14 rounded-full"
        />
        <div>
          <h3 className="text-white font-semibold text-lg">{user.login}</h3>
          {user.bio && <p className="text-gray-400 text-sm">{user.bio}</p>}
          <div className="flex gap-4 mt-1 text-sm text-gray-400">
            <span>{user.publicRepos} 仓库</span>
            <span>{user.followers} 关注者</span>
            <span>{user.following} 关注中</span>
          </div>
        </div>
      </div>

      {/* Contribution Heatmap */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
        <h3 className="text-white font-medium mb-3">贡献热力图</h3>
        <div className="overflow-x-auto">
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} 次贡献`}
                    className={`w-[11px] h-[11px] rounded-[2px] ${LEVEL_COLORS[day.level]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <span>少</span>
          {LEVEL_COLORS.map((c, i) => (
            <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${c}`} />
          ))}
          <span>多</span>
        </div>
      </div>

      {/* Recent Repos */}
      <div>
        <h3 className="text-white font-medium mb-3">最近更新的仓库</h3>
        <div className="grid gap-3">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-medium">{repo.name}</span>
                {repo.language && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          LANG_COLORS[repo.language] || "#6b7280",
                      }}
                    />
                    {repo.language}
                  </span>
                )}
              </div>
              {repo.description && (
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {repo.description}
                </p>
              )}
              <div className="flex gap-3 mt-2 text-xs text-gray-500">
                {repo.stars > 0 && <span>⭐ {repo.stars}</span>}
                {repo.forks > 0 && <span>🍴 {repo.forks}</span>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
