"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NotificationIcon,
  SearchIcon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { formatRelativeDate, cn } from "@/lib/utils";
import type { ContentItem } from "@/types/content";

interface ContentCardProps {
  item: ContentItem;
  featured?: boolean;
  isFavorite?: boolean;
  onFavorite: (id: string) => void;
}

export function ContentCard({
  item,
  featured = false,
  isFavorite,
  onFavorite,
}: ContentCardProps) {
  const useUnoptimizedImage = /^https?:\/\//i.test(item.imageUrl);
  const accentClasses =
    item.metadata.accent === "coral"
      ? "bg-[rgba(239,141,141,0.14)] text-(--accent-coral)"
      : item.metadata.accent === "ink"
        ? "bg-(--surface-contrast) text-background"
        : item.metadata.accent === "lilac"
          ? "bg-[rgba(147,171,239,0.1)] text-(--text-secondary)"
          : "bg-[rgba(147,171,239,0.15)] text-(--accent-blue)";

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "soft-card relative overflow-hidden rounded-[28px] p-4",
        featured ? "min-h-80" : "min-h-70",
      )}
      data-testid="content-card"
    >
      <div className="relative mb-4 h-44 overflow-hidden rounded-[22px]">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          unoptimized={useUnoptimizedImage}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/25 to-transparent" />
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
            accentClasses,
          )}
        >
          {item.type}
        </span>
        <button
          type="button"
          aria-label={`Toggle favorite for ${item.title}`}
          onClick={() => onFavorite(item.id)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border transition",
            isFavorite
              ? "border-transparent bg-(--surface-contrast) text-background"
              : "border-(--border-soft) bg-(--surface-secondary) text-(--text-secondary)",
          )}
        >
          <HugeiconsIcon icon={UserIcon} size={28} strokeWidth={isFavorite ? 2.2 : 1.7} />
        </button>
      </div>

      <h3 className="font-(--font-heading) text-[1.25rem] leading-8 tracking-[-0.03em]">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-(--text-secondary)">{item.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-(--surface-secondary) px-3 py-1 text-xs text-(--text-secondary)"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-(--text-muted)">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={NotificationIcon} size={24} strokeWidth={1.9} />
          <span>{item.source}</span>
        </div>
        <span>{formatRelativeDate(item.publishedAt)}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-(--text-secondary)">
          {item.metadata.author ?? item.metadata.profile ?? item.metadata.mood ?? "Curated pick"}
        </div>
        <a
          href={item.cta.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-(--border-soft) bg-(--surface-secondary) px-4 py-2 text-sm font-semibold text-foreground transition hover:border-(--border-strong) hover:bg-(--surface-elevated)"
        >
          <HugeiconsIcon
            icon={item.type === "music" ? Settings01Icon : SearchIcon}
            size={22}
            strokeWidth={1.9}
          />
          {item.cta.label}
        </a>
      </div>
    </motion.article>
  );
}
