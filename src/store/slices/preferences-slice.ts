import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ThemeMode, UserCategory, UserPreferences } from "@/types/content";

const defaultCategories: UserCategory[] = [
  "technology",
  "finance",
  "entertainment",
];

const initialState: UserPreferences = {
  categories: defaultCategories,
  socialProfiles: ["Pixel Notes", "Reel Circle"],
  hashtags: ["#designsystems", "#watchlist", "#marketpulse"],
  theme: "light",
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    toggleCategory(state, action: PayloadAction<UserCategory>) {
      if (state.categories.includes(action.payload)) {
        state.categories = state.categories.filter((item) => item !== action.payload);
      } else {
        state.categories.push(action.payload);
      }
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    setSocialProfiles(state, action: PayloadAction<string[]>) {
      state.socialProfiles = action.payload;
    },
    setHashtags(state, action: PayloadAction<string[]>) {
      state.hashtags = action.payload;
    },
  },
});

export const {
  toggleCategory,
  setTheme,
  setSocialProfiles,
  setHashtags,
} = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
