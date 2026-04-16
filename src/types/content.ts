export type ContentType = "news" | "movie" | "music" | "social";
export type FeedSection = "feed" | "trending" | "favorites" | "settings";
export type ThemeMode = "light" | "dark";
export type UserCategory =
  | "technology"
  | "sports"
  | "finance"
  | "business"
  | "entertainment"
  | "health";

export interface ContentCTA {
  label: string;
  href: string;
}

export interface ContentMetadata {
  category: UserCategory;
  accent: "blue" | "coral" | "ink" | "lilac";
  author?: string;
  readingTime?: string;
  score?: number;
  profile?: string;
  handle?: string;
  duration?: string;
  mood?: string;
  year?: string;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  summary: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  tags: string[];
  cta: ContentCTA;
  metadata: ContentMetadata;
}

export interface FeedResponse {
  items: ContentItem[];
  page: number;
  hasMore: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface UserPreferences {
  categories: UserCategory[];
  socialProfiles: string[];
  hashtags: string[];
  theme: ThemeMode;
}