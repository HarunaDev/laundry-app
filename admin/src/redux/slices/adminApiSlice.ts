import { generalApiSlice } from "../apiSlice";

export interface Admin {
  id: string;
  userName: string;
  email: string;
}

export interface AdminMeta {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  items: unknown[];
}

export interface AdminData {
  meta: AdminMeta;
  admins: Admin[];
}

export interface AdminResponse {
  success: boolean;
  message: string;
  data: AdminData;
}

export interface CreateAdminRequest {
  userName: string;
  email: string;
  password: string;
}

export interface CreateAdminResponse {
  success: boolean;
  message: string;
  data: Admin;
}

export interface DeleteAdminResponse {
  success: boolean;
  message: string;
  data: unknown;
}

export interface GetAdminQuery {
  pageNumber: number;
  pageSize: number;
}

const adminApiSlice = generalApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdmin: builder.query<AdminResponse, GetAdminQuery>({
      query: ({ pageNumber, pageSize }) => ({
        url: "/admin",
        method: "GET",
        params: {
          pageNumber,
          pageSize,
        },
      }),
      providesTags: ["Admin"],
    }),

    createAdmin: builder.mutation<CreateAdminResponse, CreateAdminRequest>({
      query: (body) => ({
        url: "/admin/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),

    // updateDeliveryMethod: builder.mutation<
    //   DeliveryMethodResponse,
    //   {
    //     id: number;
    //     body: UpdateDeliveryMethodRequest;
    //   }
    // >({
    //   query: ({ id, body }) => ({
    //     url: `/delivery-methods/${id}`,
    //     method: "PUT",
    //     body,
    //   }),
    //   invalidatesTags: ["DeliveryMethods"],
    // }),

    deleteAdmin: builder.mutation<DeleteAdminResponse, string>({
      query: (id) => ({
        url: `/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminQuery,
  useCreateAdminMutation,
  //   useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminApiSlice;
