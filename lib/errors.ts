import { NextResponse } from "next/server";

export function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export function apiError(err: unknown, label: string) {
  const message = getErrorMessage(err);
  console.error(`${label} API error:`, message);
  return NextResponse.json(
    { error: `Failed to fetch ${label} data` },
    { status: 500 }
  );
}
