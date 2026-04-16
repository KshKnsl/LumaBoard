"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthEntryCard } from "@/components/dashboard/auth-entry-card";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { signOut } from "@/store/slices/auth-slice";
import { setFeedPage } from "@/store/slices/feed-slice";
import { setTheme } from "@/store/slices/preferences-slice";
import { setActiveSection, setSearchQuery, toggleSidebar } from "@/store/slices/ui-slice";
import type { FeedSection } from "@/types/content";

function sectionToPath(section: FeedSection) {
  switch (section) {
    case "feed":
      return "/dashboard";
    case "trending":
      return "/dashboard/trending";
    case "favorites":
      return "/dashboard/favorites";
    case "settings":
      return "/dashboard/settings";
    default:
      return "/dashboard";
  }
}

function pathToSection(pathname: string): FeedSection {
  if (pathname.endsWith("/trending")) return "trending";
  if (pathname.endsWith("/favorites")) return "favorites";
  if (pathname.endsWith("/settings")) return "settings";
  return "feed";
}

export default function DashboardSectionPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, profile } = useAppSelector((state) => state.auth);
  const preferences = useAppSelector((state) => state.preferences);
  const ui = useAppSelector((state) => state.ui);

  const [searchInput, setSearchInput] = useState(ui.searchQuery);
  const deferredSearch = useDeferredValue(searchInput.trim());

  const activeSection = useMemo(() => pathToSection(pathname), [pathname]);

  useEffect(() => {
    dispatch(setActiveSection(activeSection));
  }, [activeSection, dispatch]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      dispatch(setSearchQuery(deferredSearch));
      dispatch(setFeedPage(1));
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [deferredSearch, dispatch]);

  if (!isAuthenticated || !profile) {
    return <AuthEntryCard mode="login" />;
  }

  return (
    <DashboardShell
      activeSection={activeSection}
      onSectionChange={(section) => {
        dispatch(setActiveSection(section));
        router.push(sectionToPath(section));
      }}
      onThemeToggle={() =>
        dispatch(setTheme(preferences.theme === "light" ? "dark" : "light"))
      }
      onSignOut={() => dispatch(signOut())}
      theme={preferences.theme}
      profile={profile}
      searchValue={searchInput}
      onSearchChange={setSearchInput}
      onMenuToggle={() => dispatch(toggleSidebar())}
      sidebarOpen={ui.isSidebarOpen}
    >
      <DashboardClient activeSection={activeSection} />
    </DashboardShell>
  );
}
