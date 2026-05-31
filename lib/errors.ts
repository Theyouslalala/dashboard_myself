import { NextResponse } from "next/server";

export function apiError(err: unknown, label: string) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`${label} API error:`, message);
  return NextResponse.json(
    { error: `Failed to fetch ${label} data` },
    { status: 500 }
  );
}
