import { useEffect, useRef, useState } from "react";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon } from "@hugeicons/core-free-icons";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ContentCard } from "@/components/content-card";
import { SectionHeading } from "@/components/section-heading";
import { toggleFavorite } from "@/store/slices/favorites-slice";
import { setFeedOrder, setFeedPage } from "@/store/slices/feed-slice";
import {
  useGetFeedQuery,
  useSearchContentQuery,
  useGetTrendingQuery,
} from "@/store/services/content-api";
import type { ContentItem } from "@/types/content";

function SortableFeedCard({
  item,
  featured,
  isFavorite,
  onFavorite,
}: {
  item: ContentItem;
  featured?: boolean;
  isFavorite: boolean;
  onFavorite: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <ContentCard
        item={item}
        featured={featured}
        isFavorite={isFavorite}
        onFavorite={onFavorite}
      />
    </div>
  );
}

export function DashboardFeed({ searchQuery }: { searchQuery: string }) {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const favoriteIds = useAppSelector((state) => state.favorites.ids);
  const favoriteEntities = useAppSelector((state) => state.favorites.entities);
  const feed = useAppSelector((state) => state.feed);

  const [feedItems, setFeedItems] = useState<ContentItem[]>([]);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const feedQuery = useGetFeedQuery({
    categories: preferences.categories,
    hashtags: preferences.hashtags,
    profiles: preferences.socialProfiles,
    query: searchQuery || undefined,
    page: feed.page,
  });

  const searchResultsQuery = useSearchContentQuery(
    {
      categories: preferences.categories,
      hashtags: preferences.hashtags,
      profiles: preferences.socialProfiles,
      query: searchQuery,
    },
    {
      skip: !searchQuery,
    },
  );

  const trendingQuery = useGetTrendingQuery({
    categories: preferences.categories,
    hashtags: preferences.hashtags,
    profiles: preferences.socialProfiles,
  });

  useEffect(() => {
    if (searchQuery) {
      setFeedItems(searchResultsQuery.data ?? []);
      return;
    }

    if (!feedQuery.data?.items) return;
    const nextPageItems = feedQuery.data.items;

    setFeedItems((current) => {
      if (feed.page === 1) return nextPageItems;

      const existing = new Set(current.map((item) => item.id));
      return [...current, ...nextPageItems.filter((item) => !existing.has(item.id))];
    });
  }, [feed.page, feedQuery.data?.items, searchResultsQuery.data, searchQuery]);

  const orderedFeedItems = (() => {
    if (!feedItems.length) return [];
    if (!feed.order.length) return feedItems;
    const lookup = new Map(feedItems.map((item) => [item.id, item]));
    const prioritized = feed.order
      .map((id) => lookup.get(id))
      .filter((value): value is ContentItem => Boolean(value));
    const remainder = feedItems.filter((item) => !feed.order.includes(item.id));
    return [...prioritized, ...remainder];
  })();

  const favoriteItems = favoriteIds
    .map((id) => favoriteEntities[id])
    .filter((item): item is ContentItem => Boolean(item));

  const canLoadMore = !searchQuery && Boolean(feedQuery.data?.hasMore);
  const isLoadingNextPage = feedQuery.isFetching && feed.page > 1;

  const loadNextPage = () => {
    if (!canLoadMore || feedQuery.isFetching) return;
    dispatch(setFeedPage(feed.page + 1));
  };

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !canLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadNextPage();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [canLoadMore, loadNextPage]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedFeedItems.findIndex((item) => item.id === active.id);
    const newIndex = orderedFeedItems.findIndex((item) => item.id === over.id);
    dispatch(
      setFeedOrder(arrayMove(orderedFeedItems, oldIndex, newIndex).map((item) => item.id)),
    );
  };

  return (
    <section className="grid gap-5 2xl:grid-cols-[1.45fr_0.55fr]">
      <div className="soft-card rounded-[34px] p-6">
        <SectionHeading
          eyebrow="Your Feed"
          title={searchQuery ? "Search results" : "Curated For You"}
          description="Your personalized stream of news, recommendations, and social signals."
        />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={orderedFeedItems.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {orderedFeedItems.map((item, index) => (
                <SortableFeedCard
                  key={item.id}
                  item={item}
                  featured={index === 0}
                  isFavorite={favoriteIds.includes(item.id)}
                  onFavorite={() => dispatch(toggleFavorite(item))}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {feedQuery.isFetching && !orderedFeedItems.length && !searchQuery && (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-[28px] bg-(--surface-secondary) p-6"
              >
                <div className="h-40 rounded-[20px] bg-white/50" />
                <div className="mt-4 h-4 w-24 rounded-full bg-white/50" />
                <div className="mt-3 h-8 rounded-full bg-white/50" />
                <div className="mt-3 h-20 rounded-[18px] bg-white/40" />
              </div>
            ))}
          </div>
        )}

        {feedQuery.isError && !orderedFeedItems.length && !searchQuery && (
          <div className="rounded-[28px] bg-(--surface-secondary) p-8 text-center text-(--text-secondary)">
            The feed could not be loaded right now. Refresh to try again.
          </div>
        )}

        {!orderedFeedItems.length && !feedQuery.isFetching && (
          <div className="rounded-[28px] bg-(--surface-secondary) p-8 text-center text-(--text-secondary)">
            No content matched your search. Try a broader query or enable more categories.
          </div>
        )}

        {!searchQuery && canLoadMore && (
          <div ref={loadMoreRef} className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={loadNextPage}
              disabled={isLoadingNextPage}
              className="pill-button px-5 py-3 text-sm font-semibold"
            >
              {isLoadingNextPage ? "Loading next page..." : "Load next page"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div className="soft-card rounded-[34px] p-6">
          <SectionHeading
            eyebrow="Trending Now"
            title="Top Hits"
            description="The most popular content right now based on your interests."
          />
          <div className="space-y-4">
            {trendingQuery.isError && (
              <div className="rounded-3xl bg-(--surface-secondary) p-4 text-sm text-(--text-secondary)">
                Trending content is temporarily unavailable.
              </div>
            )}
            {trendingQuery.data?.map((item) => (
              <div key={item.id} className="rounded-3xl bg-(--surface-secondary) p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-(--text-muted)">
                  {item.type}
                </div>
                <div className="mt-2 text-lg font-semibold leading-7">{item.title}</div>
                <div className="mt-2 text-sm text-(--text-secondary)">
                  {item.summary}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-card rounded-[34px] p-6">
          <SectionHeading
            eyebrow="Your Library"
            title="Saved Items"
            description="Your pinned content, available instantly."
          />
          <div className="space-y-3">
            {favoriteItems.length ? (
              favoriteItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-3xl bg-(--surface-secondary) p-4"
                >
                  <div>
                    <div className="text-sm font-semibold">{item.title}</div>
                    <div className="mt-1 text-sm text-(--text-secondary)">{item.source}</div>
                  </div>
                  <HugeiconsIcon
                    icon={FavouriteIcon}
                    size={28}
                    strokeWidth={2.2}
                    className="mt-1 text-(--accent-blue)"
                  />
                </div>
              ))
            ) : (
              <div className="rounded-3xl bg-(--surface-secondary) p-4 text-sm text-(--text-secondary)">
                Save a few picks to build your favorites board.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
