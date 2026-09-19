import { generalApiSlice } from "../apiSlice";

export interface LaundryItem {
  id: number;
  name: string;
  price: number;
  laundryServiceId: number;
  laundryServiceName: string;
}

export interface CreateLaundryItemRequest {
  name: string;
  price: number;
  laundryServiceId: number;
}

export interface UpdateLaundryItemRequest {
  name: string;
  price: number;
  laundryServiceId: number;
}

export interface LaundryItemsResponse {
  success: boolean;
  message: string;
  data: LaundryItem[];
}

export interface LaundryItemResponse {
  success: boolean;
  message: string;
  data: LaundryItem;
}

export interface DeleteLaundryItemResponse {
  success: boolean;
  message: string;
  data: unknown;
}

const itemsApiSlice = generalApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLaundryItems: builder.query<LaundryItemsResponse, number>({
      query: (serviceId) => ({
        url: `/laundry-items/service/${serviceId}`,
        method: "GET",
      }),
      providesTags: ["LaundryItems"],
    }),

    createLaundryItem: builder.mutation<
      LaundryItemResponse,
      CreateLaundryItemRequest
    >({
      query: (body) => ({
        url: "/laundry-items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LaundryItems"],
    }),

    updateLaundryItem: builder.mutation<
      LaundryItemResponse,
      {
        id: number;
        body: UpdateLaundryItemRequest;
      }
    >({
      query: ({ id, body }) => ({
        url: `/laundry-items/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["LaundryItems"],
    }),

    deleteLaundryItem: builder.mutation<DeleteLaundryItemResponse, number>({
      query: (id) => ({
        url: `/laundry-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LaundryItems"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLaundryItemsQuery,
  useCreateLaundryItemMutation,
  useUpdateLaundryItemMutation,
  useDeleteLaundryItemMutation,
} = itemsApiSlice;
