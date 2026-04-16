import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ContentItem } from "@/types/content";

interface FavoritesState {
  ids: string[];
  entities: Record<string, ContentItem>;
}

const initialState: FavoritesState = {
  ids: [],
  entities: {},
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<ContentItem>) {
      if (state.ids.includes(action.payload.id)) {
        state.ids = state.ids.filter((id) => id !== action.payload.id);
        delete state.entities[action.payload.id];
      } else {
        state.ids.unshift(action.payload.id);
        state.entities[action.payload.id] = action.payload;
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
