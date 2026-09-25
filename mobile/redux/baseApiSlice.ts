import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

import { logOut, setAccessToken } from "./appSlice";
import type { RootState } from "./store";

const BASE_URL = "http://192.168.0.194:8080/api";

const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,

  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.app.user?.accessToken;

    headers.set("Accept", "application/json");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  /*
   * Wait if another request is already refreshing the token.
   */
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  /*
   * Access token is still valid.
   */
  if (result.error?.status !== 401) {
    return result;
  }

  /*
   * Another request may have started refreshing between
   * the first request and this point.
   */
  if (!mutex.isLocked()) {
    const release = await mutex.acquire();

    try {
      /*
       * Try refreshing the access token.
       *
       * The refresh token is NOT sent manually.
       * The backend's HTTP-only cookie is sent automatically
       * because credentials: "include" is configured above.
       */
      const refreshResult = await rawBaseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const response = refreshResult.data as {
          success: boolean;
          message: string;
          data: {
            userId: string;
            accessToken: string;
          };
        };

        if (
          response.success &&
          response.data?.accessToken &&
          response.data?.userId
        ) {
          api.dispatch(
            setAccessToken({
              accessToken: response.data.accessToken,
            })
          );

          /*
           * Retry the original request with the new access token.
           */
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
        }
      } else {
        api.dispatch(logOut());
      }
    } finally {
      release();
    }
  } else {
    /*
     * Another request already refreshed the token.
     * Wait for it, then retry the original request.
     */
    await mutex.waitForUnlock();

    result = await rawBaseQuery(args, api, extraOptions);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

  endpoints: () => ({}),

  tagTypes: ["Auth", "Orders", "LaundryServices", "LaundryItems", "Locations", "User"],
});
