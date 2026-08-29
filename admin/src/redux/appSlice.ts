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
  accessToken?: string;
  refreshToken?: string;
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
  appMode: unknown | null; // Adjust based on actual type if known
  basicProfileInfo: BasicProfileInfo | null;
}

const initialState: AppState = {
  app_loading: false,
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null,
  appMode: localStorage.getItem("appMode")
    ? JSON.parse(localStorage.getItem("appMode") as string)
    : null,
  basicProfileInfo: localStorage.getItem("basicProfileInfo")
    ? JSON.parse(localStorage.getItem("basicProfileInfo") as string)
    : null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.app_loading = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...state.userInfo,
          ...action.payload,
        })
      );
    },
    storeBasicProfileInfo: (state, action: PayloadAction<BasicProfileInfo>) => {
      state.basicProfileInfo = action.payload;
    },
    logOut: (state) => {
      const userrec = JSON.parse(localStorage.getItem("userInfo") as string) as UserInfo | null;
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("appMode");

      if (userrec?.role === "ADMIN") {
        window.location.href = "/login";
      } else {
        window.location.href = "/";
      }
    },
    storeAppMode: (state, action: PayloadAction<unknown>) => {
      state.appMode = action.payload;
      localStorage.setItem("appMode", JSON.stringify(action.payload));
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.userInfo = {
        ...state.userInfo,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
    setUserDetails: (state, action: PayloadAction<{
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      authResponse: { accessToken: string; refreshToken: string };
      profilePictureFileUri: string;
    }>) => {
      const { userId, firstName, lastName, email, phoneNumber, authResponse, profilePictureFileUri } = action.payload;
      state.userInfo = {
        userId,
        firstName,
        lastName,
        email,
        phoneNumber,
        profilePictureFileUri,
        accessToken: authResponse?.accessToken,
        refreshToken: authResponse?.refreshToken,
      };
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
    setBasicProfileInfo: (state, action: PayloadAction<BasicProfileInfo>) => {
      const sanitizedData: BasicProfileInfo = {
        ...action.payload,
        // department: action.payload.department || { value: '', label: '' },
      };
      state.basicProfileInfo = sanitizedData;
      localStorage.setItem("basicProfileInfo", JSON.stringify(sanitizedData));
    },
    setProfileInfo: (state, action: PayloadAction<Partial<BasicProfileInfo>>) => {
      state.basicProfileInfo = {
        ...state.basicProfileInfo,
        ...action.payload,
        // department: action.payload.department || { value: '', label: '' },
      };
      localStorage.setItem("basicProfileInfo", JSON.stringify(state.basicProfileInfo));
    },
    clearBasicProfileInfo: (state) => {
      state.basicProfileInfo = null;
      localStorage.removeItem("basicProfileInfo");
    },
    // updateBasicProfileField: (state, action: PayloadAction<{ field: string; value: unknown }>) => {
    //   const { field, value } = action.payload;
    //   if (state.basicProfileInfo) {
    //     state.basicProfileInfo = {
    //       ...state.basicProfileInfo,
    //       [field]: value
    //     };
    //     localStorage.setItem("basicProfileInfo", JSON.stringify(state.basicProfileInfo));
    //   }
    // },
  },
});

export const selectBasicProfileInfo = (state: RootState): BasicProfileInfo | null => state.app.basicProfileInfo;
export const selectUserInfo = (state: RootState): UserInfo | null => state.app.userInfo;
export default appSlice.reducer;
export const {
  setAppLoading,
  setUserInfo,
  storeBasicProfileInfo,
  logOut,
  storeAppMode,
  setUserDetails,
  setTokens,
  setBasicProfileInfo,
  setProfileInfo,
  clearBasicProfileInfo,
  
} = appSlice.actions;
export const appMode = (state: RootState): unknown | null => state.app.appMode;