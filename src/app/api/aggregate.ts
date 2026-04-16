import { NextRequest } from "next/server";
import { scoreAndSort } from "@/lib/utils";
import type { UserCategory } from "@/types/content";

import { GET as getNews } from "./news/route";
import { GET as getMovies } from "./movies/route";
import { GET as getMusic } from "./music/route";
import { GET as getSocial } from "./social/route";

interface SourceOptions {
  categories?: UserCategory[];
  query?: string;
  hashtags?: string[];
  profiles?: string[];
  origin?: string;
}

export async function fetchAggregatedFeed(options: SourceOptions) {
  const origin = options.origin ?? "http://localhost:3000";

  const params = new URLSearchParams();
  if (options.categories?.length) {
    params.set("categories", options.categories.join(","));
  }
  if (options.hashtags?.length) {
    params.set("hashtags", options.hashtags.join(","));
  }
  if (options.profiles?.length) {
    params.set("profiles", options.profiles.join(","));
  }
  if (options.query) {
    params.set("query", options.query);
  }

  const queryString = params.toString();
  const searchUrl = queryString ? `?${queryString}` : "";
  const syntheticRequest = new NextRequest(new URL(`${origin}/api/mock${searchUrl}`));

  const executeRoute = async (handler: (req: NextRequest) => Promise<any>) => {
    try {
      const response = await handler(syntheticRequest);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch {
      return [];
    }
  };

  const results = await Promise.allSettled([
    executeRoute(getNews),
    executeRoute(getMovies),
    executeRoute(getMusic),
    executeRoute(getSocial),
  ]);

  const items = results.flatMap((result) =>
    result.status === "fulfilled" && Array.isArray(result.value) ? result.value : [],
  );

  return scoreAndSort(items);
}
