import { generalApiSlice } from "../apiSlice";

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthResponseData {
  userId: string;
  accessToken: string;
}

// export interface AuthTokens {
//     accessToken: string;
//     refreshToken: string;
// }

// export interface LoginData {
//     userId: string;
//     tokens: AuthTokens;
// }

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type LoginResponse = ApiResponse<AuthResponseData>;

// interface RefreshTokenBody {
//   refreshToken: string;
// }

// export interface RefreshTokenData {
//     userId: string;
//     tokens: AuthTokens;
// }

export type RefreshTokenResponse = ApiResponse<AuthResponseData>;

export interface ApiErrorResponse {
  success: boolean;
  errorCode: string;
  message: string;
  details: string[];
}

const authApiSlice = generalApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginBody>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    getRefreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useGetRefreshTokenMutation } = authApiSlice;
