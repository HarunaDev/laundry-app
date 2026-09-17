import { generalApiSlice } from "../apiSlice";

import type {
  FilterOrdersRequest,
  FilterOrdersResponse,
  LaundryOrderDetails,
} from "../../types/orders";

const orderApiSlice =
  generalApiSlice.injectEndpoints({
    endpoints: (builder) => ({

      filterOrders: builder.query<
        FilterOrdersResponse,
        FilterOrdersRequest
      >({
        query: (body) => ({
          url: "/laundry-orders/filter",
          method: "POST",
          body,
        }),
      }),

      getOrderById: builder.query<
        LaundryOrderDetails,
        number
      >({
        query: (orderId) => ({
          url: `/laundry-orders/${orderId}`,
          method: "GET",
        }),
      }),

    }),

    overrideExisting: false,
  });

export const {
  useFilterOrdersQuery,
  useLazyFilterOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
} = orderApiSlice;

export default orderApiSlice;