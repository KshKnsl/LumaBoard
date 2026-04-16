import { NextRequest, NextResponse } from "next/server";
import { fetchAggregatedFeed } from "../aggregate";
import type { UserCategory } from "@/types/content";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const categories = (params.get("categories") ?? "")
    .split(",")
    .filter(Boolean) as UserCategory[];
  const query = params.get("query") ?? "";
  const hashtags = (params.get("hashtags") ?? "")
    .split(",")
    .filter(Boolean);
  const profiles = (params.get("profiles") ?? "")
    .split(",")
    .filter(Boolean);

  const origin = request.nextUrl.origin;

  try {
      const items = await fetchAggregatedFeed({
        categories,
        query,
        hashtags,
        profiles,
        origin,
      });
      return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Unable to load live search results at the moment." },
      { status: 502 },
    );
  }
}
