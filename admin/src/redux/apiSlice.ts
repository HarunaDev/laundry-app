// /* eslint-disable no-unused-vars */
// /* eslint-disable no-undef */
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type {BaseQueryFn, FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
// import { logOut } from "./appSlice";
// import type { RootState } from "./store"; // Import RootState for typing getState

// export const appApiHeader = {
//   "Content-Type": "application/json",
//   "Access-Control-Allow-Origin": "*",
// } as const; // 'as const' for literal types

// const getBaseUrl = (): string => {
//   if (process.env.NODE_ENV === "development") {
//     return "https://fhemfelapi.xmapapp.com/api";
//     // return "https://localhost:44388/api";
//     // return "https://mock.apidog.com/m1/611770-578407-default";
//   } else if (process.env.NODE_ENV === "production") {
//     return "https://fhemfelapi.xmapapp.com/api";
//   }
//   return ""; // Fallback
// };

// const baseQuery: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = fetchBaseQuery({
//   baseUrl: "",
//   prepareHeaders: (headers, { getState }) => {
//     const state = getState() as RootState;
//     const token = state.app.userInfo?.accessToken;
//     console.log({ token, state });
//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }
//     return headers;
//   },
// });

// const baseQueryWithReauth: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
//   const state = api.getState() as RootState;
//   const baseUrl = getBaseUrl();

//   const result = await baseQuery(
//     { ...args, url: `${baseUrl}${args.url}` },
//     api,
//     extraOptions
//   );

//   if (args?.url !== "/auth/login" && result?.error?.status === 401) {
//     api.dispatch(logOut());
//   }
//   return result;
// };

// export const generalApiSlice = createApi({
//   baseQuery: baseQueryWithReauth,
//   reducerPath: "api",
//   endpoints: (builder) => ({}),
// });

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

  if (
    args.url !== "/auth/login" &&
    args.url !== "/auth/refresh" &&
    result.error?.status === 401
  ) {
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

  endpoints: () => ({}),
});
