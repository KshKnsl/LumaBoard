import { NextRequest, NextResponse } from "next/server";
import { getTrending } from "@/lib/providers";
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

  try {
    return NextResponse.json(
      await getTrending({
        categories,
        hashtags,
        profiles,
      }),
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to load live trending data at the moment." },
      { status: 502 },
    );
  }
}
