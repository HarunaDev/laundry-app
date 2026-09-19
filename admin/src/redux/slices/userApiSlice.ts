import { generalApiSlice } from "../apiSlice";

export type UserRole = "Client" | "Admin" | "SuperAdmin";
export type UserStatus = "Active" | "Inactive";

export interface CurrentUser {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  totalOrders: number;
  status: UserStatus;
  role: UserRole;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: CurrentUser;
}

const userApiSlice = generalApiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getUser: builder.query<UserResponse, void>({
        query: () => ({
          url: "/users/me",
          method: "GET",
        }),
        providesTags: ["User"],
      }),
  
      
    }),
    overrideExisting: false,
  });
  
  export const {
    useGetUserQuery, useLazyGetUserQuery
  } = userApiSlice;
  