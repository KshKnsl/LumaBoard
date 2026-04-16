import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/store/slices/auth-slice";
import { favoritesReducer } from "@/store/slices/favorites-slice";
import { feedReducer } from "@/store/slices/feed-slice";
import { preferencesReducer } from "@/store/slices/preferences-slice";
import { contentApi } from "@/store/services/content-api";
import type {
  ContentItem,
  UserPreferences,
  UserProfile,
} from "@/types/content";

const STORAGE_KEY = "lumaboard-state";

interface PersistedDashboardState {
  auth: {
    isAuthenticated: boolean;
    profile: UserProfile | null;
  };
  preferences: UserPreferences;
  favorites: {
    ids: string[];
    entities: Record<string, ContentItem>;
  };
  feedOrder: string[];
}

type LegacyPersistedDashboardState = Omit<PersistedDashboardState, "favorites"> & {
  favorites: string[];
};

function isPersistedDashboardState(
  value: PersistedDashboardState | LegacyPersistedDashboardState,
): value is PersistedDashboardState {
  return (
    !!value &&
    typeof value === "object" &&
    !!value.favorites &&
    typeof value.favorites === "object" &&
    !Array.isArray(value.favorites) &&
    Array.isArray(value.favorites.ids)
  );
}

function loadDashboardState(): PersistedDashboardState | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return null;

    const parsed = JSON.parse(value) as
      | PersistedDashboardState
      | LegacyPersistedDashboardState;

    if (Array.isArray(parsed.favorites)) {
      return {
        ...parsed,
        favorites: {
          ids: parsed.favorites,
          entities: {},
        },
      };
    }

    if (isPersistedDashboardState(parsed)) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

function saveDashboardState(state: PersistedDashboardState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

type DashboardPreloadedState = {
  auth: ReturnType<typeof authReducer>;
  preferences: ReturnType<typeof preferencesReducer>;
  feed: ReturnType<typeof feedReducer>;
  favorites: ReturnType<typeof favoritesReducer>;
};

function getPreloadedState(): DashboardPreloadedState | undefined {
  const persisted = loadDashboardState();
  if (!persisted) return undefined;

  return {
    auth: persisted.auth,
    preferences: persisted.preferences,
    favorites: persisted.favorites,
    feed: {
      order: persisted.feedOrder,
      page: 1,
    },
  };
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
    feed: feedReducer,
    favorites: favoritesReducer,
    [contentApi.reducerPath]: contentApi.reducer,
  },
  preloadedState: getPreloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(contentApi.middleware),
});

if (typeof window !== "undefined") {
  const currentTheme = store.getState().preferences.theme;
  document.documentElement.classList.toggle("dark", currentTheme === "dark");

  store.subscribe(() => {
    const snapshot = store.getState();

    document.documentElement.classList.toggle(
      "dark",
      snapshot.preferences.theme === "dark",
    );

    const payload: PersistedDashboardState = {
      auth: snapshot.auth,
      preferences: snapshot.preferences,
      favorites: snapshot.favorites,
      feedOrder: snapshot.feed.order,
    };

    saveDashboardState(payload);
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
