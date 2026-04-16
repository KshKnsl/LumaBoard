"use client";

import {
  ChartUpIcon,
  FavouriteIcon,
  Home01Icon,
  Logout01Icon,
  Menu01Icon,
  Moon01Icon,
  SearchIcon,
  Settings01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { FeedSection, ThemeMode, UserProfile } from "@/types/content";

const items: { id: FeedSection; label: string; icon: unknown }[] = [
  { id: "feed", label: "Feed", icon: Home01Icon },
  { id: "trending", label: "Trending", icon: ChartUpIcon },
  { id: "favorites", label: "Favorites", icon: FavouriteIcon },
  { id: "settings", label: "Settings", icon: Settings01Icon },
];

interface DashboardShellProps {
  activeSection: FeedSection;
  onSectionChange: (section: FeedSection) => void;
  onThemeToggle: () => void;
  onSignOut: () => void;
  theme: ThemeMode;
  profile: UserProfile;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
  children: ReactNode;
}

export function DashboardShell({
  activeSection,
  onSectionChange,
  onThemeToggle,
  onSignOut,
  theme,
  profile,
  searchValue,
  onSearchChange,
  onMenuToggle,
  sidebarOpen,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen px-3 py-4 md:px-5 lg:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full items-start gap-4">
        <aside className="panel-surface sticky top-4 hidden h-[calc(100vh-2rem)] w-21.5 shrink-0 flex-col justify-between rounded-[36px] px-3 py-5 lg:flex">
          <div className="flex flex-col items-center gap-4">
            <div className="mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl">
              <Image src="/logo-mark.svg" alt="LumaBoard" width={48} height={48} priority />
            </div>
            {items.map((item) => {
              const active = item.id === activeSection;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition",
                    active
                      ? "bg-(--surface-contrast) text-background"
                      : "bg-(--surface-secondary) text-(--text-secondary) hover:bg-white",
                  )}
                  aria-label={item.label}
                >
                  <HugeiconsIcon icon={item.icon as never} size={30} strokeWidth={1.9} />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onThemeToggle}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-(--surface-contrast) text-background"
            aria-label="Toggle theme"
          >
            <HugeiconsIcon
              icon={theme === "light" ? Moon01Icon : Sun01Icon}
              size={28}
              strokeWidth={2}
            />
          </button>
        </aside>

        <div className="flex-1">
          <div className="panel-surface min-h-[calc(100vh-2rem)] rounded-[38px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center justify-between gap-3 xl:hidden">
                <button
                  type="button"
                  onClick={onMenuToggle}
                  className="pill-button flex h-12 w-12 items-center justify-center"
                  aria-label="Toggle sidebar"
                >
                  <HugeiconsIcon icon={Menu01Icon} size={30} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={onThemeToggle}
                  className="pill-button flex h-12 w-12 items-center justify-center"
                  aria-label="Toggle theme"
                >
                  <HugeiconsIcon
                    icon={theme === "light" ? Moon01Icon : Sun01Icon}
                    size={28}
                    strokeWidth={2}
                  />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                      "rounded-full px-5 py-3 text-sm font-semibold transition",
                      activeSection === item.id
                        ? "bg-(--surface-contrast) text-background"
                        : "pill-button text-(--text-secondary)",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-1 items-center justify-end gap-3">
                <label className="pill-button flex min-w-60 flex-1 items-center gap-3 px-4 py-3 xl:max-w-85 xl:flex-none">
                  <HugeiconsIcon icon={SearchIcon} size={26} strokeWidth={1.9} className="text-(--text-secondary)" />
                  <input
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search stories, movies, music, or creators"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-(--text-muted)"
                  />
                </label>

                <button
                  type="button"
                  onClick={onSignOut}
                  className="pill-button hidden items-center gap-2 px-4 py-2 text-sm font-semibold md:flex"
                >
                  <HugeiconsIcon icon={Logout01Icon} size={20} strokeWidth={2} />
                  Logout
                </button>
                <div className="flex items-center gap-3 rounded-full bg-(--surface-secondary) px-3 py-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    loading="eager"
                    decoding="async"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="hidden pr-2 sm:block">
                    <div className="text-sm font-semibold">{profile.name}</div>
                    <div className="text-xs text-(--text-muted)">{profile.email}</div>
                    <div className="text-xs text-(--text-muted)">{profile.role}</div>
                  </div>
                </div>
              </div>
            </header>

            {sidebarOpen && (
              <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap",
                      activeSection === item.id
                        ? "bg-(--surface-contrast) text-background"
                        : "pill-button",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
