import { baseApi } from "../baseApiSlice";
import { logOut, setUser} from "../appSlice";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface AuthData {
  userId: string;
  accessToken: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  data: unknown;
}

export interface ApiErrorResponse {
  success: boolean;
  errorCode: string;
  message: string;
  details: string[];
}

export const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setUser({
              userId: data.data.userId,
              accessToken: data.data.accessToken,
            })
          );
        } catch {
          // Login errors are handled by the component
          // through the mutation result.
        }
      },

      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Auth"],
    }),

    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          /*
           * Whether the server succeeds or fails, the local
           * authentication state must be cleared.
           */
          dispatch(logOut());

          /*
           * Remove cached authenticated API data.
           */
          dispatch(baseApi.util.resetApiState());
        }
      },

      invalidatesTags: ["Auth"],
    })
  }),
});

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    userName: string;
    email: string;
  };
}

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation
} = authApiSlice;
