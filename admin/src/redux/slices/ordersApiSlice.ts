import { generalApiSlice } from "../apiSlice";

import type {
  FilterOrdersRequest,
  FilterOrdersResponse,
  LaundryOrderDetails,
} from "../../types/orders";

export interface OrderItemRequest {
  laundryItemId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  userId: string;
  deliveryMethodId: number;
  laundryLocationId: number;
  pickupAddress?: string;
  deliveryAddress?: string;
  items: OrderItemRequest[];
}

export interface ConfirmOrderRequest {
  deliveryMethodId: number;
  laundryLocationId: number;
  pickupAddress?: string;
  deliveryAddress?: string;
  items: OrderItemRequest[];
}

// export interface CompleteOrderRequest {
  // Add fields here when the backend requires
  // a request body for completing an order.
// }

export type LaundryOrderResponse = LaundryOrderDetails;

export interface DeleteOrderResponse {
  success: boolean;
  message: string;
  data: unknown;
}

const orderApiSlice = generalApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    filterOrders: builder.query<FilterOrdersResponse, FilterOrdersRequest>({
      query: (body) => ({
        url: "/laundry-orders/filter",
        method: "POST",
        body,
      }),
      providesTags: ["LaundryOrders"],
    }),

    getOrderById: builder.query<LaundryOrderResponse, number>({
      query: (orderId) => ({
        url: `/laundry-orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (
        _result,
        _error,
        orderId
      ) => [
        "LaundryOrders",
        {
          type: "LaundryOrders",
          id: orderId,
        },
      ],
    }),

    createOrder: builder.mutation<LaundryOrderResponse, CreateOrderRequest>({
      query: (body) => ({
        url: "/laundry-orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LaundryOrders"],
    }),

    confirmOrder: builder.mutation<
      LaundryOrderResponse,
      {
        orderId: number;
        body: ConfirmOrderRequest;
      }
    >({
      query: ({ orderId, body }) => ({
        url: `/laundry-orders/${orderId}/confirm`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        "LaundryOrders",
        { type: "LaundryOrders", id: orderId },
      ],
    }),

    completeOrder: builder.mutation<
      LaundryOrderResponse,
      {
        orderId: number;
        // body: CompleteOrderRequest;
      }
    >({
      query: ({ orderId }) => ({
        url: `/laundry-orders/${orderId}/complete`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        "LaundryOrders",
        { type: "LaundryOrders", id: orderId },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useFilterOrdersQuery,
  useLazyFilterOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
  useCreateOrderMutation,
  useConfirmOrderMutation,
  useCompleteOrderMutation,
} = orderApiSlice;

export default orderApiSlice;
