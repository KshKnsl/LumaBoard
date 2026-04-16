import { NextRequest, NextResponse } from "next/server";
import { fetchAggregatedFeed } from "../aggregate";
import type { UserCategory } from "@/types/content";

export async function GET(request: NextRequest) {
  const categories = (request.nextUrl.searchParams.get("categories") ?? "")
    .split(",")
    .filter(Boolean) as UserCategory[];
  const hashtags = (request.nextUrl.searchParams.get("hashtags") ?? "")
    .split(",")
    .filter(Boolean);
  const profiles = (request.nextUrl.searchParams.get("profiles") ?? "")
    .split(",")
    .filter(Boolean);

  const origin = request.nextUrl.origin;

  try {
      const items = await fetchAggregatedFeed({
        categories,
        hashtags,
        profiles,
        origin,
      });
      return NextResponse.json(items.slice(0, 6));
  } catch {
    return NextResponse.json(
      { error: "Unable to load live trending data at the moment." },
      { status: 502 },
    );
  }
}
