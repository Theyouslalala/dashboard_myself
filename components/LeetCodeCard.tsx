"use client";

import useSWR from "swr";

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function ProgressBar({
  solved,
  total,
  color,
}: {
  solved: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (solved / total) * 100 : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{solved}</span>
        <span className="text-gray-500">{total}</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
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
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-6 w-28 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="h-48 bg-gray-800 rounded-lg animate-pulse" />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="bg-gray-800/50 rounded-lg p-6 text-center">
        <p className="text-gray-400">
          {error ? "LeetCode 数据加载失败" : "请配置 LeetCode 用户名"}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <path
            d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074 2.21-2.207 2.246-5.806.076-8.04L13.483 0zm2.317 8.237a2.143 2.143 0 0 1 3.035 0 2.143 2.143 0 0 1 0 3.035l-6.47 6.47a2.143 2.143 0 0 1-3.035 0 2.143 2.143 0 0 1 0-3.035l6.47-6.47z"
            fill="#ffa116"
          />
        </svg>
        <h2 className="text-2xl font-bold text-white">LeetCode</h2>
      </div>

      {/* Main Stats */}
      <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/50">
        <div className="text-center mb-4">
          <p className="text-4xl font-bold text-white">{data.totalSolved}</p>
          <p className="text-gray-400 text-sm">已解决题目</p>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-400 font-medium text-sm">简单</span>
            </div>
            <ProgressBar
              solved={data.easySolved}
              total={data.totalEasy}
              color="bg-green-500"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-400 font-medium text-sm">中等</span>
            </div>
            <ProgressBar
              solved={data.mediumSolved}
              total={data.totalMedium}
              color="bg-yellow-500"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-400 font-medium text-sm">困难</span>
            </div>
            <ProgressBar
              solved={data.hardSolved}
              total={data.totalHard}
              color="bg-red-500"
            />
          </div>
        </div>
      </div>

      {/* Extra Stats */}
      {data.ranking > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">全球排名</span>
            <span className="text-white font-medium">
              {data.ranking.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
