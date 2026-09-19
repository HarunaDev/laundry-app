import { generalApiSlice } from "../apiSlice";

export interface DeliveryMethod {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
}

export interface CreateDeliveryMethodRequest {
  name: string;
  description: string;
  price: number;
}

export interface UpdateDeliveryMethodRequest {
  name: string;
  description: string;
  price: number;
  isActive: boolean;
}

export interface DeliveryMethodsResponse {
  success: boolean;
  message: string;
  data: DeliveryMethod[];
}

export interface DeliveryMethodResponse {
  success: boolean;
  message: string;
  data: DeliveryMethod;
}

export interface DeleteDeliveryMethodResponse {
  success: boolean;
  message: string;
  data: unknown;
}

const deliveryApiSlice = generalApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryMethods: builder.query<DeliveryMethodsResponse, void>({
      query: () => ({
        url: "/delivery-methods",
        method: "GET",
      }),
      providesTags: ["DeliveryMethods"],
    }),

    createDeliveryMethod: builder.mutation<
      DeliveryMethodResponse,
      CreateDeliveryMethodRequest
    >({
      query: (body) => ({
        url: "/delivery-methods",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DeliveryMethods"],
    }),

    updateDeliveryMethod: builder.mutation<
      DeliveryMethodResponse,
      {
        id: number;
        body: UpdateDeliveryMethodRequest;
      }
    >({
      query: ({ id, body }) => ({
        url: `/delivery-methods/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DeliveryMethods"],
    }),

    deleteDeliveryMethod: builder.mutation<
      DeleteDeliveryMethodResponse,
      number
    >({
      query: (id) => ({
        url: `/delivery-methods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeliveryMethods"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDeliveryMethodsQuery,
  useCreateDeliveryMethodMutation,
  useUpdateDeliveryMethodMutation,
  useDeleteDeliveryMethodMutation,
} = deliveryApiSlice;
