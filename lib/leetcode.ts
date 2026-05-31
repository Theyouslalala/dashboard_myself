import { createCache } from "./cache";
import type { LeetCodeStats } from "./types";
export type { LeetCodeStats };

interface DifficultyCount {
  difficulty: string;
  count: number;
}

const cache = createCache<LeetCodeStats>(20, 10 * 60 * 1000);

export async function getLeetCodeStats(
  username: string
): Promise<LeetCodeStats> {
  const cacheKey = `lc_${username}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const query = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
          reputation
        }
      }
      allQuestionsCount {
        difficulty
        count
      }
    }
  `;

  const res = await fetch("https://leetcode.cn/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.cn",
    },
    body: JSON.stringify({ query, variables: { username } }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`);

  const data = await res.json();
  const user = data.data?.matchedUser;
  const allQuestions: DifficultyCount[] = data.data?.allQuestionsCount || [];

  if (!user) throw new Error("User not found");

  const acStats: DifficultyCount[] =
    user.submitStatsGlobal?.acSubmissionNum || [];
  const easySolved =
    acStats.find((s) => s.difficulty === "Easy")?.count || 0;
  const mediumSolved =
    acStats.find((s) => s.difficulty === "Medium")?.count || 0;
  const hardSolved =
    acStats.find((s) => s.difficulty === "Hard")?.count || 0;
  const totalSolved = easySolved + mediumSolved + hardSolved;

  const totalEasy =
    allQuestions.find((q) => q.difficulty === "Easy")?.count || 0;
  const totalMedium =
    allQuestions.find((q) => q.difficulty === "Medium")?.count || 0;
  const totalHard =
    allQuestions.find((q) => q.difficulty === "Hard")?.count || 0;

  const stats: LeetCodeStats = {
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    totalEasy,
    totalMedium,
    totalHard,
    acceptanceRate: 0,
    ranking: user.profile?.ranking || 0,
    contributionPoints: user.profile?.reputation || 0,
  };

  cache.set(cacheKey, stats);
  return stats;
}
