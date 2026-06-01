import { request } from "./request";
import type { LeetCodeStats } from "../types";

export async function getLeetCodeStats() {
  return request<LeetCodeStats>("/api/leetcode");
}
