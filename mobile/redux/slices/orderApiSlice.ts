import { baseApi } from "../baseApiSlice";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Cancelled"
  | (string & {});

export interface LaundryOrder {
  id: number;
  customerId: string;
  customerName: string;
  deliveryMethod: string;
  laundryLocation: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryPrice: number;
  itemsTotal: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
}

export interface LaundryOrderItem {
  laundryItemId: number;
  laundryItemName: string;
  laundryServiceName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface LaundryOrderDetails {
  id: number;
  customerId: string;
  customerName: string;
  deliveryMethodId: number;
  deliveryMethod: string;
  laundryLocationId: number;
  laundryLocation: string;
  deliveryAddress: string | null;
  pickupAddress: string;
  deliveryPrice: number;
  itemsTotal: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
  items: LaundryOrderItem[];
}

export const ordersApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<LaundryOrder[], void>({
      query: () => ({
        url: "/laundry-orders/my-orders",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((order) => ({
                type: "LaundryOrders" as const,
                id: order.id,
              })),
              { type: "LaundryOrders" as const, id: "LIST" },
            ]
          : [{ type: "LaundryOrders" as const, id: "LIST" }],
    }),

    getOrderById: builder.query<LaundryOrderDetails, number>({
      query: (orderId) => ({
        url: `/laundry-orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, orderId) => [
        {
          type: "LaundryOrders",
          id: orderId,
        },
      ],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
} = ordersApiSlice;