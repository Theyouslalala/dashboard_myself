import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { apiError } from "@/lib/errors";
import { getGitHubUser, getGitHubRepos, getContributions } from "@/lib/github";

export async function GET() {
  const config = getConfig();
  const { username, token } = config.github;

  if (!username) {
    return NextResponse.json(
      { error: "GitHub username not configured" },
      { status: 400 }
    );
  }

  try {
    const [user, repos, contributions] = await Promise.all([
      getGitHubUser(username, token),
      getGitHubRepos(username, token),
      getContributions(username, token),
    ]);

    return NextResponse.json({
      user: {
        login: user.login,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
      },
      repos: repos.map((r) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        updatedAt: r.updated_at,
        url: r.html_url,
        topics: r.topics,
      })),
      contributions,
    });
  } catch (err: unknown) {
    return apiError(err, "GitHub");
  }
}
