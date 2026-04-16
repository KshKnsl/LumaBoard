import { NextRequest, NextResponse } from "next/server";
import { getDummySocialContent } from "@/data/social-dummy";
import type { UserCategory } from "@/types/content";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const categories = (params.get("categories") ?? "")
    .split(",")
    .filter(Boolean) as UserCategory[];
  const query = params.get("query") ?? undefined;
  const hashtags = (params.get("hashtags") ?? "")
    .split(",")
    .filter(Boolean);
  const profiles = (params.get("profiles") ?? "")
    .split(",")
    .filter(Boolean);

  const items = getDummySocialContent({
    categories,
    query,
    hashtags,
    profiles,
  });

  return NextResponse.json(items);
}
