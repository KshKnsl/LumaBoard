import type { ContentItem, UserCategory } from "@/types/content";

const now = Date.now();

function isoHoursAgo(hoursAgo: number) {
  return new Date(now - hoursAgo * 60 * 60 * 1000).toISOString();
}

export const socialDummyData: ContentItem[] = [
  {
    id: "social-dummy-1",
    type: "social",
    title: "Design teams are sharing their dashboard accessibility checklists",
    summary:
      "Creators are posting quick audits for contrast, focus states, and keyboard flow on modern content dashboards.",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    source: "Social Pulse",
    publishedAt: isoHoursAgo(1),
    tags: ["social", "technology", "designsystems", "accessibility"],
    cta: { label: "Open Post", href: "https://example.com/social/design" },
    metadata: {
      category: "technology",
      accent: "blue",
      profile: "Pixel Notes",
      handle: "@pixelnotes",
      score: 90,
    },
  },
  {
    id: "social-dummy-2",
    type: "social",
    title: "Film communities are curating watchlist threads for this weekend",
    summary:
      "A wave of short-form recommendations is trending, with spoiler-free mini reviews and seasonal picks.",
    imageUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    source: "Social Pulse",
    publishedAt: isoHoursAgo(3),
    tags: ["social", "entertainment", "watchlist", "movies"],
    cta: { label: "Open Post", href: "https://example.com/social/watchlist" },
    metadata: {
      category: "entertainment",
      accent: "coral",
      profile: "Reel Circle",
      handle: "@reelcircle",
      score: 86,
    },
  },
  {
    id: "social-dummy-3",
    type: "social",
    title: "Market creators are tracking momentum themes across sectors",
    summary:
      "Finance-focused dashboards and creator notes are surfacing compact snapshots for daily review.",
    imageUrl:
      "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80",
    source: "Social Pulse",
    publishedAt: isoHoursAgo(5),
    tags: ["social", "finance", "marketpulse", "business"],
    cta: { label: "Open Post", href: "https://example.com/social/markets" },
    metadata: {
      category: "finance",
      accent: "ink",
      profile: "Market Loop",
      handle: "@marketloop",
      score: 83,
    },
  },
  {
    id: "social-dummy-4",
    type: "social",
    title: "Health creators are posting practical morning routine check-ins",
    summary:
      "Simple weekly templates are being shared for hydration, steps, and mindful breaks.",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    source: "Social Pulse",
    publishedAt: isoHoursAgo(7),
    tags: ["social", "health", "wellness"],
    cta: { label: "Open Post", href: "https://example.com/social/health" },
    metadata: {
      category: "health",
      accent: "lilac",
      profile: "Health Habit",
      handle: "@healthhabit",
      score: 78,
    },
  },
];

export function getDummySocialContent(options: {
  categories?: UserCategory[];
  query?: string;
  hashtags?: string[];
  profiles?: string[];
}) {
  const terms = [
    ...(options.query ? [options.query.toLowerCase().trim()] : []),
    ...(options.hashtags ?? []).map((value) => value.replace(/^#/, "").toLowerCase()),
    ...(options.profiles ?? []).map((value) => value.toLowerCase()),
  ].filter(Boolean);

  const categorySet = new Set(options.categories ?? []);

  return socialDummyData.filter((item) => {
    const categoryMatch =
      categorySet.size === 0 ||
      item.tags.some((tag) => categorySet.has(tag as UserCategory));

    if (!categoryMatch) return false;
    if (!terms.length) return true;

    const haystack = `${item.title} ${item.summary} ${item.tags.join(" ")} ${
      item.metadata.profile ?? ""
    } ${item.metadata.handle ?? ""}`.toLowerCase();

    return terms.some((term) => haystack.includes(term));
  });
}
