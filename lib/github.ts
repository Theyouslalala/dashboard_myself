import { createCache } from "./cache";
import type { ContributionDay } from "./types";
export type { ContributionDay };

/** Raw GitHub REST API user shape. */
export interface GitHubUser {
  login: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

/** Raw GitHub REST API repo shape. */
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

const userCache = createCache<GitHubUser>(10, 10 * 60 * 1000);
const repoCache = createCache<GitHubRepo[]>(10, 10 * 60 * 1000);
const contribCache = createCache<ContributionDay[]>(10, 10 * 60 * 1000);

function authHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getGitHubUser(
  username: string,
  token?: string
): Promise<GitHubUser> {
  const cacheKey = `gh_user_${username}`;
  const cached = userCache.get(cacheKey);
  if (cached) return cached;

  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: authHeaders(token),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data: GitHubUser = await res.json();
  userCache.set(cacheKey, data);
  return data;
}

export async function getGitHubRepos(
  username: string,
  token?: string
): Promise<GitHubRepo[]> {
  const cacheKey = `gh_repos_${username}`;
  const cached = repoCache.get(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
    { headers: authHeaders(token), signal: AbortSignal.timeout(10_000) }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data: GitHubRepo[] = await res.json();
  repoCache.set(cacheKey, data);
  return data;
}

function generateEmptyDays(): ContributionDay[] {
  const days: ContributionDay[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push({ date: date.toISOString().split("T")[0], count: 0, level: 0 });
  }
  return days;
}

export async function getContributions(
  username: string,
  token?: string
): Promise<ContributionDay[]> {
  const cacheKey = `gh_contrib_${username}`;
  const cached = contribCache.get(cacheKey);
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
    ...authHeaders(token),
  };

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables: { login: username } }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const empty = generateEmptyDays();
    contribCache.set(cacheKey, empty);
    return empty;
  }

  const data = await res.json();

  if (data.errors?.length) {
    console.warn("GitHub GraphQL errors:", data.errors[0].message);
    const empty = generateEmptyDays();
    contribCache.set(cacheKey, empty);
    return empty;
  }
  const weeks =
    data.data?.user?.contributionsCollection?.contributionCalendar?.weeks ||
    [];

  const days: ContributionDay[] = [];
  for (const week of weeks) {
    for (const day of week.contributionDays ?? []) {
      const count = day.contributionCount;
      let level = 0;
      if (count > 0) level = 1;
      if (count >= 3) level = 2;
      if (count >= 6) level = 3;
      if (count >= 10) level = 4;
      days.push({ date: day.date, count, level });
    }
  }

  contribCache.set(cacheKey, days);
  return days;
}
