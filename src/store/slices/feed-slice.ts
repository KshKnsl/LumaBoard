import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FeedState {
  order: string[];
  page: number;
}

const initialState: FeedState = {
  order: [],
  page: 1,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeedOrder(state, action: PayloadAction<string[]>) {
      state.order = action.payload;
    },
    setFeedPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
});

export const { setFeedOrder, setFeedPage } = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
