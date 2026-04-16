import { NextRequest, NextResponse } from "next/server";
import type { ContentItem } from "@/types/content";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query") ?? undefined;
  const term = query ?? "indie";
  const normalizedTerm = term.trim() || "indie";

  const itunesUrl = new URL("https://itunes.apple.com/search");
  itunesUrl.searchParams.set("term", normalizedTerm);
  itunesUrl.searchParams.set("entity", "album");
  itunesUrl.searchParams.set("media", "music");
  itunesUrl.searchParams.set("country", "US");
  itunesUrl.searchParams.set("limit", "8");

  try {
    const response = await fetch(itunesUrl.toString(), {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });
    
    const text = await response.text();
    const payload = JSON.parse(text) as { results?: any[] };

    const itunesItems = (payload.results ?? []).slice(0, 8).map((album: any, index: number) => {
      const accent: "coral" | "lilac" = index % 2 === 0 ? "coral" : "lilac";

      return {
        id: `live-music-itunes-${album.collectionId ?? index}`,
        type: "music" as const,
        title: album.collectionName ?? "Album pick",
        summary: `A curated album recommendation by ${album.artistName ?? "an emerging artist"}.`,
        imageUrl:
          album.artworkUrl100?.replace("100x100bb", "600x600bb") ??
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
        source: "Apple Music",
        publishedAt: new Date().toISOString(),
        tags: ["music", normalizedTerm.toLowerCase()],
        cta: { label: "Play Now", href: album.collectionViewUrl ?? "https://music.apple.com/" },
        metadata: {
          category: "entertainment" as const,
          accent,
          author: album.artistName ?? "Artist",
          duration: "Album",
          mood: normalizedTerm,
          score: 84 - index,
        },
      };
    });

    if (itunesItems.length) {
      return NextResponse.json(itunesItems);
    }
    
    throw new Error("No data");
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch live music data at the moment." },
      { status: 502 },
    );
  }
}
