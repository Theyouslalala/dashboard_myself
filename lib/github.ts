import { createCache } from "./cache";

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

const cache = createCache<unknown>(50, 10 * 60 * 1000);

export async function getGitHubUser(
  username: string,
  token?: string
): Promise<GitHubUser> {
  const cacheKey = `gh_user_${username}`;
  const cached = cache.get(cacheKey) as GitHubUser | null;
  if (cached) return cached;

  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers,
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data: GitHubUser = await res.json();
  cache.set(cacheKey, data);
  return data;
}

export async function getGitHubRepos(
  username: string,
  token?: string
): Promise<GitHubRepo[]> {
  const cacheKey = `gh_repos_${username}`;
  const cached = cache.get(cacheKey) as GitHubRepo[] | null;
  if (cached) return cached;

  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
    { headers, signal: AbortSignal.timeout(10_000) }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data: GitHubRepo[] = await res.json();
  cache.set(cacheKey, data);
  return data;
}

export async function getContributions(
  username: string,
  token?: string
): Promise<ContributionDay[]> {
  const cacheKey = `gh_contrib_${username}`;
  const cached = cache.get(cacheKey) as ContributionDay[] | null;
  if (cached) return cached;

  // Use GraphQL variables to prevent injection
  const query = `
    query ($login: String!) {
      user(login: $login) {
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

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables: { login: username } }),
    signal: AbortSignal.timeout(10_000),
  });

  // If GraphQL fails (no auth), generate empty data structure
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

  if (data.errors?.length) {
    console.error("GitHub GraphQL errors:", data.errors);
    throw new Error(`GitHub GraphQL: ${data.errors[0].message}`);
  }
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

  cache.set(cacheKey, days);
  return days;
}
