import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface UserInfo {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profilePictureFileUri?: string;
  role?: string;
}

// interface DropdownOption {
//   value: string;
//   label: string;
// }

interface BasicProfileInfo {
  [key: string]: unknown; // For dynamic fields
}

interface AppState {
  app_loading: boolean;

  userInfo: UserInfo | null;

  accessToken: string | null;

  authInitialized: boolean;

  appMode: unknown | null;

  basicProfileInfo: BasicProfileInfo | null;
}

const initialState: AppState = {
  app_loading: false,
  userInfo: null,
  accessToken: null,
  authInitialized: false,
  appMode: null,
  basicProfileInfo: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.app_loading = action.payload;
    },

    setCredentials: (
      state,
      action: PayloadAction<{
        user: UserInfo;
        accessToken: string;
      }>
    ) => {
      state.userInfo = action.payload.user;

      state.accessToken = action.payload.accessToken;
    },

    setAuthInitialized: ( state, action: PayloadAction<boolean>) => {
        state.authInitialized = action.payload;
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    setUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      state.userInfo = action.payload;
    },
    storeBasicProfileInfo: (state, action: PayloadAction<BasicProfileInfo>) => {
      state.basicProfileInfo = action.payload;
    },
    logOut: (state) => {
      state.userInfo = null;

      state.accessToken = null;

      state.appMode = null;

      state.basicProfileInfo = null;
    },
    storeAppMode: (state, action: PayloadAction<unknown>) => {
      state.appMode = action.payload;
    },
    setBasicProfileInfo: (state, action: PayloadAction<BasicProfileInfo>) => {
      state.basicProfileInfo = action.payload;
    },
    setProfileInfo: (
      state,
      action: PayloadAction<Partial<BasicProfileInfo>>
    ) => {
      state.basicProfileInfo = {
        ...state.basicProfileInfo,
        ...action.payload,
      };
    },
    clearBasicProfileInfo: (state) => {
      state.basicProfileInfo = null;
    },
  },
});

// export const selectBasicProfileInfo = (state: RootState): BasicProfileInfo | null => state.app.basicProfileInfo;
export const {
  setAppLoading,
  setCredentials,
  setAuthInitialized,
  setAccessToken,
  setUserInfo,
  logOut,
  storeAppMode,
  setBasicProfileInfo,
  setProfileInfo,
  clearBasicProfileInfo,
} = appSlice.actions;

export const selectUserInfo = (state: RootState): UserInfo | null =>
  state.app.userInfo;
export const selectAccessToken =
  (state: RootState) =>
    state.app.accessToken;
export default appSlice.reducer;
// export const appMode = (state: RootState): unknown | null => state.app.appMode;
