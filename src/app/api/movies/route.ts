import { NextRequest, NextResponse } from "next/server";
import type { ContentItem } from "@/types/content";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query") ?? undefined;
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing TMDB_API_KEY. Live movie provider is required." },
      { status: 500 },
    );
  }

  const url = new URL(
    query
      ? "https://api.themoviedb.org/3/search/movie"
      : "https://api.themoviedb.org/3/trending/movie/week",
  );
  url.searchParams.set("api_key", apiKey);
  if (query) url.searchParams.set("query", query);

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });
    const payload = await response.json();

    const items: ContentItem[] = (payload.results ?? []).slice(0, 8).map(
      (movie: any, index: number) => ({
        id: `live-movie-${movie.id ?? index}`,
        type: "movie",
        title: String(movie.title ?? "Movie pick"),
        summary: String(movie.overview ?? "A fresh recommendation from TMDB."),
        imageUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
          : "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
        source: "TMDB",
        publishedAt: new Date().toISOString(),
        tags: ["entertainment", "movie"],
        cta: { label: "See Details", href: "https://www.themoviedb.org/" },
        metadata: {
          category: "entertainment",
          accent: index % 2 === 0 ? "blue" : "ink",
          year: String(movie.release_date ?? "").slice(0, 4),
          score: Math.round(Number(movie.vote_average ?? 7) * 10),
        },
      }),
    );

    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to fetch live movie data at the moment." },
      { status: 502 },
    );
  }
}
