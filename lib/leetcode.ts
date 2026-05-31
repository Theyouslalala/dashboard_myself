export interface LeetCodeStats {
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

const CACHE_DURATION = 10 * 60 * 1000;
const MAX_CACHE_SIZE = 20;
const cache = new Map<string, { data: unknown; timestamp: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { data, timestamp: Date.now() });
}

export async function getLeetCodeStats(
  username: string
): Promise<LeetCodeStats> {
  const cacheKey = `lc_${username}`;
  const cached = getCached<LeetCodeStats>(cacheKey);
  if (cached) return cached;

  // Try LeetCode CN GraphQL API
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

  try {
    const res = await fetch("https://leetcode.cn/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.cn",
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`);

    const data = await res.json();
    const user = data.data?.matchedUser;
    const allQuestions = data.data?.allQuestionsCount || [];

    if (!user) throw new Error("User not found");

    const acStats = user.submitStatsGlobal?.acSubmissionNum || [];
    const easySolved =
      acStats.find((s: { difficulty: string }) => s.difficulty === "Easy")
        ?.count || 0;
    const mediumSolved =
      acStats.find((s: { difficulty: string }) => s.difficulty === "Medium")
        ?.count || 0;
    const hardSolved =
      acStats.find((s: { difficulty: string }) => s.difficulty === "Hard")
        ?.count || 0;
    const totalSolved = easySolved + mediumSolved + hardSolved;

    const totalEasy =
      allQuestions.find(
        (q: { difficulty: string }) => q.difficulty === "Easy"
      )?.count || 0;
    const totalMedium =
      allQuestions.find(
        (q: { difficulty: string }) => q.difficulty === "Medium"
      )?.count || 0;
    const totalHard =
      allQuestions.find(
        (q: { difficulty: string }) => q.difficulty === "Hard"
      )?.count || 0;

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

    setCache(cacheKey, stats);
    return stats;
  } catch (err) {
    console.error("LeetCode API error:", err);
    return {
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      totalEasy: 800,
      totalMedium: 1700,
      totalHard: 700,
      acceptanceRate: 0,
      ranking: 0,
      contributionPoints: 0,
    };
  }
}
