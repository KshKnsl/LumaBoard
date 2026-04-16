import { NextRequest, NextResponse } from "next/server";
import { getAggregatedFeed } from "@/lib/providers";
import type { ContentItem, FeedResponse, UserCategory } from "@/types/content";

function paginateItems(items: ContentItem[], page = 1, pageSize = 6): FeedResponse {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    page,
    hasMore: end < items.length,
  };
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const categories = (params.get("categories") ?? "")
    .split(",")
    .filter(Boolean) as UserCategory[];
  const query = params.get("query") ?? undefined;
  const page = Number(params.get("page") ?? "1");
  const hashtags = (params.get("hashtags") ?? "")
    .split(",")
    .filter(Boolean);
  const profiles = (params.get("profiles") ?? "")
    .split(",")
    .filter(Boolean);

  const items = await getAggregatedFeed({
    categories,
    query,
    hashtags,
    profiles,
  });

  return NextResponse.json(paginateItems(items, page, 6));
}
