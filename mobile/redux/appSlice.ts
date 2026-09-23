import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  userId: string;
  accessToken: string;
}

export interface UserProfile {
  userName: string;
  email: string;
}

interface AppState {
  user: AuthUser | null;
  userInfo: UserProfile | null;
  isAuthenticated: boolean;
}

const initialState: AppState = {
  user: null,
  userInfo: null,
  isAuthenticated: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    setAccessToken(
      state,
      action: PayloadAction<{
        accessToken: string;
      }>
    ) {
      if (!state.user) {
        return;
      }

      state.user.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    setUserInfo(state, action: PayloadAction<UserProfile>) {
      state.userInfo = action.payload;
    },

    updateProfile(
      state,
      action: PayloadAction<{
        userName?: string;
        email?: string;
      }>
    ) {
      if (!state.userInfo) {
        return;
      }

      if (action.payload.userName !== undefined) {
        state.userInfo.userName = action.payload.userName;
      }

      if (action.payload.email !== undefined) {
        state.userInfo.email = action.payload.email;
      }
    },

    logOut(state) {
      state.user = null;
      state.userInfo = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setAccessToken, setUserInfo, updateProfile, logOut } =
  appSlice.actions;

export default appSlice.reducer;
