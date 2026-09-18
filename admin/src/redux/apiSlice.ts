import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { logOut, setAccessToken } from "./appSlice";
import type { RootState } from "./store";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,

  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.app.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // if (
  //   args.url !== "/auth/login" &&
  //   result.error?.status === 401
  // ) {
  //   api.dispatch(logOut());
  // }

  const isLoginRequest = args.url === "/auth/login";
  const isRefreshRequest = args.url === "/auth/refresh";

  if (
    // args.url !== "/auth/login" &&
    // args.url !== "/auth/refresh" &&
    // result.error?.status === 401
    !isLoginRequest &&
    !isRefreshRequest &&
    result.error?.status === 401
  ) {
    const state = api.getState() as RootState;

    // If the user has already logged out, do not attempt
    // to refresh the token.
    if (!state.app.accessToken) {
      return result;
    }
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const refreshData = refreshResult.data as {
        success: boolean;
        data: {
          userId: string;
          accessToken: string;
        };
      };

      if (refreshData.success && refreshData.data.accessToken) {
        api.dispatch(setAccessToken(refreshData.data.accessToken));

        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logOut());
      }
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const generalApiSlice = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,
  tagTypes: ["LaundryLocations"],
  endpoints: () => ({}),
});
