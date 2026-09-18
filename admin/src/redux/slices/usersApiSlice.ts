import { generalApiSlice } from "../apiSlice";

export interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  totalOrders: number;
  status: "Active" | "Inactive";
}

export interface UsersMeta {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    items: unknown[];
  }
  
  export interface UsersData {
    meta: UsersMeta;
    users: User[];
  }
  
  export interface UsersResponse {
    success: boolean;
    message: string;
    data: UsersData;
  }
  
  export interface GetUsersQuery {
    pageNumber: number;
    pageSize: number;
  }

const usersApiSlice = generalApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, GetUsersQuery>({
      query: ({ pageNumber, pageSize }) => ({
        url: "/users",
        method: "GET",
        params: {
            pageNumber,
            pageSize
        },
      }),
    }),
    
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery } = usersApiSlice;
