import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toggleFavorite } from "@/store/slices/favorites-slice";
import { ContentCard } from "@/components/content-card";
import { SectionHeading } from "@/components/section-heading";
import type { ContentItem } from "@/types/content";

export function DashboardFavorites() {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.ids);
  const favoriteEntities = useAppSelector((state) => state.favorites.entities);

  const favoriteItems = favoriteIds
    .map((id) => favoriteEntities[id])
    .filter((item): item is ContentItem => Boolean(item));

  return (
    <section className="soft-card rounded-[34px] p-6">
      <SectionHeading
        eyebrow="Your Vault"
        title="Saved Collections"
        description="A personal archive of stories, films, music, and highlights worth keeping."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {favoriteItems.length ? (
          favoriteItems.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              isFavorite
              onFavorite={() => dispatch(toggleFavorite(item))}
            />
          ))
        ) : (
          <div className="rounded-[26px] bg-(--surface-secondary) p-6 text-(--text-secondary)">
            No favorites yet. Heart a few cards from the feed to start curating.
          </div>
        )}
      </div>
    </section>
  );
}
