import { baseApi } from "../baseApiSlice";

export interface LaundryLocation {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface LaundryLocationsResponse {
  success: boolean;
  message: string;
  data: LaundryLocation[];
}

export interface DeliveryMethod {
  id: number;
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

export interface CreateLaundryOrderItem {
  laundryItemId: number;
  quantity: number;
}

export interface CreateLaundryOrderRequest {
  deliveryMethodId: number;
  laundryLocationId: number;
  pickupAddress?: string;
  deliveryAddress?: string;
  items: CreateLaundryOrderItem[];
}

export interface CreateLaundryOrderResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
  };
}

export const bookingApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLaundryLocations: builder.query<
      LaundryLocationsResponse,
      void
    >({
      query: () => ({
        url: "/laundry-locations",
        method: "GET",
      }),
      providesTags: ["LaundryLocations"],
    }),

    getDeliveryMethods: builder.query<
      DeliveryMethodsResponse,
      void
    >({
      query: () => ({
        url: "/delivery-methods",
        method: "GET",
      }),
      providesTags: ["DeliveryMethods"],
    }),

    createLaundryOrder: builder.mutation<
      CreateLaundryOrderResponse,
      CreateLaundryOrderRequest
    >({
      query: (body) => ({
        url: "/laundry-orders",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        "LaundryOrders",
        "User",
      ],
    }),
  }),
});

export const {
  useGetLaundryLocationsQuery,
  useGetDeliveryMethodsQuery,
  useCreateLaundryOrderMutation,
} = bookingApiSlice;