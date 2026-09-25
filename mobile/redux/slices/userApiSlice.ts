import { baseApi } from "../baseApiSlice";

export interface CurrentUser {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  totalOrders: number;
  status: string;
  role: string;
}

export interface CurrentUserResponse {
  success: boolean;
  message: string;
  data: CurrentUser;
}

export const userApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
} = userApiSlice;