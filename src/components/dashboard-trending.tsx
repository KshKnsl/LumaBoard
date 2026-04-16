import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useGetTrendingQuery } from "@/store/services/content-api";
import { toggleFavorite } from "@/store/slices/favorites-slice";
import { ContentCard } from "@/components/content-card";
import { SectionHeading } from "@/components/section-heading";

export function DashboardTrending() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const favoriteIds = useAppSelector((state) => state.favorites.ids);

  const trendingQuery = useGetTrendingQuery({
    categories: preferences.categories,
    hashtags: preferences.hashtags,
    profiles: preferences.socialProfiles,
  });

  return (
    <section className="soft-card rounded-[34px] p-6">
      <SectionHeading
        eyebrow="Market Pulse"
        title="Top Highlights"
        description="A curated collection of the strongest signals and discoveries crossing your network."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {trendingQuery.data?.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            featured
            isFavorite={favoriteIds.includes(item.id)}
            onFavorite={() => dispatch(toggleFavorite(item))}
          />
        ))}
      </div>
    </section>
  );
}
