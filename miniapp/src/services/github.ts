import { request } from "./request";
import type { GitHubData } from "../types";

export async function getGitHubData() {
  return request<GitHubData>("/api/github");
}
