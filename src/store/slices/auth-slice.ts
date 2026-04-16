import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "@/types/content";

interface AuthState {
  isAuthenticated: boolean;
  profile: UserProfile | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  profile: null,
};

const defaultProfile: UserProfile = {
  name: "Kush Kansal",
  email: "kush@lumaboard.app",
  role: "Backend DEV",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<Partial<UserProfile> | undefined>) {
      state.isAuthenticated = true;
      state.profile = {
        ...defaultProfile,
        ...action.payload,
      };
    },
    signOut(state) {
      state.isAuthenticated = false;
      state.profile = null;
    },
    updateProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      if (!state.profile) return;
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
    },
  },
});

export const { signIn, signOut, updateProfile } = authSlice.actions;
export const authReducer = authSlice.reducer;
