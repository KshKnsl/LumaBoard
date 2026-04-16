"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useAppSelector } from "@/lib/hooks";
import { AuthEntryCard } from "@/components/auth-entry-card";
import { DashboardFeed } from "@/components/dashboard-feed";
import { DashboardTrending } from "@/components/dashboard-trending";
import { DashboardFavorites } from "@/components/dashboard-favorites";
import { DashboardSettings } from "@/components/dashboard-settings";
import type { FeedSection } from "@/types/content";

interface DashboardClientProps {
  activeSection: FeedSection;
  searchQuery: string;
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
}

export function DashboardClient({
  activeSection,
  searchQuery,
  isSettingsOpen,
  onToggleSettings,
}: DashboardClientProps) {
  const { isAuthenticated, profile } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !profile) {
    return <AuthEntryCard mode="login" />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="space-y-8"
      >
        {activeSection === "feed" && <DashboardFeed searchQuery={searchQuery} />}
        {activeSection === "trending" && <DashboardTrending />}
        {activeSection === "favorites" && <DashboardFavorites />}
        {(activeSection === "settings" || isSettingsOpen) && <DashboardSettings />}
      </motion.div>
    </AnimatePresence>
  );
}
