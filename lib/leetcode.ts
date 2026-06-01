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
    query($userSlug: String!) {
      userProfileUserQuestionSubmitStats(userSlug: $userSlug) {
        acSubmissionNum {
          difficulty
          count
        }
      }
      userProfileUserQuestionProgress(userSlug: $userSlug) {
        numAcceptedQuestions {
          difficulty
          count
        }
        numUntouchedQuestions {
          difficulty
          count
        }
      }
    }
  `;

  const res = await fetch("https://leetcode.cn/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.cn",
    },
    body: JSON.stringify({ query, variables: { userSlug: username } }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`);

  const data = await res.json();

  if (data.errors?.length) {
    throw new Error(`LeetCode: ${data.errors[0].message}`);
  }

  const submitStats: DifficultyCount[] =
    data.data?.userProfileUserQuestionSubmitStats?.acSubmissionNum || [];
  const accepted: DifficultyCount[] =
    data.data?.userProfileUserQuestionProgress?.numAcceptedQuestions || [];
  const untouched: DifficultyCount[] =
    data.data?.userProfileUserQuestionProgress?.numUntouchedQuestions || [];

  const findCount = (arr: DifficultyCount[], diff: string) =>
    arr.find((s) => s.difficulty === diff)?.count || 0;

  const easySolved = findCount(submitStats, "EASY");
  const mediumSolved = findCount(submitStats, "MEDIUM");
  const hardSolved = findCount(submitStats, "HARD");
  const totalSolved = easySolved + mediumSolved + hardSolved;

  const totalEasy = findCount(accepted, "EASY") + findCount(untouched, "EASY");
  const totalMedium =
    findCount(accepted, "MEDIUM") + findCount(untouched, "MEDIUM");
  const totalHard =
    findCount(accepted, "HARD") + findCount(untouched, "HARD");
  const totalAll = totalEasy + totalMedium + totalHard;

  const acceptanceRate =
    totalAll > 0 ? Math.round((totalSolved / totalAll) * 10000) / 100 : 0;

  const stats: LeetCodeStats = {
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    totalEasy,
    totalMedium,
    totalHard,
    acceptanceRate,
    ranking: 0,
    contributionPoints: 0,
  };

  cache.set(cacheKey, stats);
  return stats;
}
