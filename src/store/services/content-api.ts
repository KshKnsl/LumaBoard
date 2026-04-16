import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ContentItem, FeedResponse, UserCategory } from "@/types/content";

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Feed"],
  endpoints: (builder) => ({

    getFeed: builder.query<
      FeedResponse,
      {
        categories: UserCategory[];
        hashtags: string[];
        profiles: string[];
        query?: string;
        page: number;
      }
    >({
      query: ({ categories, hashtags, profiles, query, page }) => {
        const params = new URLSearchParams({
          categories: categories.join(","),
          hashtags: hashtags.join(","),
          profiles: profiles.join(","),
          page: String(page),
        });
        if (query) params.set("query", query);
        return `feed?${params.toString()}`;
      },
      providesTags: ["Feed"],
    }),
    getTrending: builder.query<
      ContentItem[],
      { categories: UserCategory[]; hashtags: string[]; profiles: string[] }
    >({
      query: ({ categories, hashtags, profiles }) =>
        `trending?${new URLSearchParams({
          categories: categories.join(","),
          hashtags: hashtags.join(","),
          profiles: profiles.join(","),
        }).toString()}`,
    }),
    searchContent: builder.query<
      ContentItem[],
      {
        categories: UserCategory[];
        hashtags: string[];
        profiles: string[];
        query: string;
      }
    >({
      query: ({ categories, hashtags, profiles, query }) =>
        `search?${new URLSearchParams({
          categories: categories.join(","),
          hashtags: hashtags.join(","),
          profiles: profiles.join(","),
          query,
        }).toString()}`,
    }),
  }),
});

export const {
  useGetFeedQuery,
  useGetTrendingQuery,
  useSearchContentQuery,
} = contentApi;
