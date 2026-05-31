import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { getLeetCodeStats } from "@/lib/leetcode";

export async function GET() {
  const config = getConfig();
  const { username } = config.leetcode;

  if (!username) {
    return NextResponse.json(
      { error: "LeetCode username not configured" },
      { status: 400 }
    );
  }

  try {
    const stats = await getLeetCodeStats(username);
    return NextResponse.json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
