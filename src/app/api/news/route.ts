import { NextRequest, NextResponse } from "next/server";
import type { ContentItem } from "@/types/content";
import type { UserCategory } from "@/types/content";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const categories = (params.get("categories") ?? "")
    .split(",")
    .filter(Boolean) as UserCategory[];
  const query = params.get("query") ?? undefined;

  const apiKey = process.env.NEWS_API_KEY;

  const category = categories[0] ?? "technology";
  const url = new URL("https://newsapi.org/v2/top-headlines");
  url.searchParams.set("apiKey", apiKey ?? "");
  url.searchParams.set("pageSize", "8");
  url.searchParams.set("category", category);
  if (query) url.searchParams.set("q", query);

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 900 },
    });
    const payload = await response.json();

    const items: ContentItem[] = (payload.articles ?? []).map(
      (article: any, index: number) => ({
        id: `live-news-${index}`,
        type: "news",
        title: article.title ?? "Breaking update",
        summary: article.description ?? "Fresh coverage from your personalized news stream.",
        imageUrl:
          article.urlToImage ??
          "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
        source: article.source?.name ?? "NewsAPI",
        publishedAt: article.publishedAt ?? new Date().toISOString(),
        tags: [category, "live"],
        cta: { label: "Read More", href: article.url ?? "https://newsapi.org/" },
        metadata: {
          category,
          accent: "blue",
          author: article.author ?? "News desk",
          readingTime: "4 min read",
          score: 80 - index,
        },
      }),
    );

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch live news at the moment." },
      { status: 502 },
    );
  }
}
