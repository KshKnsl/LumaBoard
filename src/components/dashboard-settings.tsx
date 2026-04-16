import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartUpIcon } from "@hugeicons/core-free-icons";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateProfile } from "@/store/slices/auth-slice";
import {
  setTheme,
  toggleCategory,
  setHashtags,
  setSocialProfiles,
} from "@/store/slices/preferences-slice";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/section-heading";
import type { UserCategory } from "@/types/content";

const categoryOptions: UserCategory[] = [
  "technology",
  "sports",
  "finance",
  "business",
  "entertainment",
  "health",
];

export function DashboardSettings() {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.auth);
  const preferences = useAppSelector((state) => state.preferences);

  const [profileDraft, setProfileDraft] = useState({
    name: profile?.name ?? "",
    email: profile?.email ?? "",
    role: profile?.role ?? "",
  });

  useEffect(() => {
    if (!profile) return;
    setProfileDraft({
      name: profile.name,
      email: profile.email,
      role: profile.role,
    });
  }, [profile]);

  return (
    <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="soft-card rounded-[34px] p-6">
        <SectionHeading
          eyebrow="Preferences"
          title="Tune the dashboard"
          description="Adjust your preferred categories, social sources, and visual mode."
        />
        <div className="space-y-6">
          <div>
            <div className="mb-3 text-sm font-semibold">Favorite categories</div>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => dispatch(toggleCategory(category))}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium capitalize transition",
                    preferences.categories.includes(category)
                      ? "bg-(--surface-contrast) text-background"
                      : "pill-button text-(--text-secondary)",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold">Theme mode</div>
            <div className="flex gap-2">
              {(["light", "dark"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => dispatch(setTheme(mode))}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium capitalize",
                    preferences.theme === mode
                      ? "bg-(--surface-contrast) text-background"
                      : "pill-button",
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold">Profile customization</div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "role", label: "Role" },
              ].map((field) => (
                <label
                  key={field.key}
                  className="rounded-[22px] bg-(--surface-secondary) p-4 text-sm"
                >
                  <div className="mb-2 text-xs uppercase tracking-[0.16em] text-(--text-muted)">
                    {field.label}
                  </div>
                  <input
                    value={profileDraft[field.key as keyof typeof profileDraft]}
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                    className="w-full bg-transparent outline-none"
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={() => dispatch(updateProfile(profileDraft))}
              className="mt-3 rounded-full bg-(--surface-contrast) px-4 py-2 text-sm font-semibold text-background"
            >
              Save profile
            </button>
          </div>
        </div>
      </div>

      <div className="soft-card rounded-[34px] p-6">
        <SectionHeading
          eyebrow="Filters"
          title="Social and discovery context"
          description="These profile and hashtag presets personalize mock social content and search relevance."
        />
        <div className="space-y-6">
          <div>
            <div className="mb-3 text-sm font-semibold">Profiles</div>
            <div className="flex flex-wrap gap-2">
              {["Pixel Notes", "Reel Circle", "Market Loop"].map((profileName) => {
                const selected = preferences.socialProfiles.includes(profileName);
                return (
                  <button
                    key={profileName}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? preferences.socialProfiles.filter((item) => item !== profileName)
                        : [...preferences.socialProfiles, profileName];
                      dispatch(setSocialProfiles(next));
                    }}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm",
                      selected
                        ? "bg-(--surface-contrast) text-background"
                        : "pill-button",
                    )}
                  >
                    {profileName}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold">Hashtags</div>
            <div className="flex flex-wrap gap-2">
              {["#designsystems", "#watchlist", "#marketpulse", "#aifeed"].map((tag) => {
                const selected = preferences.hashtags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? preferences.hashtags.filter((item) => item !== tag)
                        : [...preferences.hashtags, tag];
                      dispatch(setHashtags(next));
                    }}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm",
                      selected
                        ? "bg-(--surface-contrast) text-background"
                        : "pill-button",
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] bg-(--surface-secondary) p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <HugeiconsIcon icon={ChartUpIcon} size={30} strokeWidth={2} />
              Experience snapshot
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-(--text-muted)">
                  Profiles
                </div>
                <div className="mt-2 text-2xl font-semibold">{preferences.socialProfiles.length}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-(--text-muted)">
                  Hashtags
                </div>
                <div className="mt-2 text-2xl font-semibold">{preferences.hashtags.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
