export interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  html_url: string;
  topics: string[];
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4
}

const CACHE_DURATION = 10 * 60 * 1000;
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
  cache.set(key, { data, timestamp: Date.now() });
}

export async function getGitHubUser(
  username: string,
  token?: string
): Promise<GitHubUser> {
  const cacheKey = `gh_user_${username}`;
  const cached = getCached<GitHubUser>(cacheKey);
  if (cached) return cached;

  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers,
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

export async function getGitHubRepos(
  username: string,
  token?: string
): Promise<GitHubRepo[]> {
  const cacheKey = `gh_repos_${username}`;
  const cached = getCached<GitHubRepo[]>(cacheKey);
  if (cached) return cached;

  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
    { headers }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

export async function getContributions(
  username: string
): Promise<ContributionDay[]> {
  const cacheKey = `gh_contrib_${username}`;
  const cached = getCached<ContributionDay[]>(cacheKey);
  if (cached) return cached;

  // Use GitHub's contribution calendar via GraphQL (no auth needed for public data)
  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  // If GraphQL fails (no auth), generate mock data structure
  if (!res.ok) {
    const days: ContributionDay[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split("T")[0],
        count: 0,
        level: 0,
      });
    }
    return days;
  }

  const data = await res.json();
  const weeks =
    data.data?.user?.contributionsCollection?.contributionCalendar?.weeks ||
    [];

  const days: ContributionDay[] = [];
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      const count = day.contributionCount;
      let level = 0;
      if (count > 0) level = 1;
      if (count >= 3) level = 2;
      if (count >= 6) level = 3;
      if (count >= 10) level = 4;
      days.push({ date: day.date, count, level });
    }
  }

  setCache(cacheKey, days);
  return days;
}
