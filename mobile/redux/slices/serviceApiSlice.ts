import { baseApi } from "../baseApiSlice";

export interface LaundryService {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface LaundryServicesResponse {
  success: boolean;
  message: string;
  data: LaundryService[];
}

export interface LaundryItem {
  id: number;
  name: string;
  price: number;
  laundryServiceId: number;
  laundryServiceName: string;
}

export interface LaundryItemsResponse {
  success: boolean;
  message: string;
  data: LaundryItem[];
}

export const serviceApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLaundryServices: builder.query<LaundryServicesResponse, void>({
      query: () => ({
        url: "/laundry-services",
        method: "GET",
      }),
      providesTags: ["LaundryServices"],
    }),

    getLaundryItemsByService: builder.query<LaundryItemsResponse, number>({
      query: (serviceId) => ({
        url: `/laundry-items/service/${serviceId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, serviceId) => [
        {
          type: "LaundryItems",
          id: serviceId,
        },
      ],
    }),
  }),
});

export const { useGetLaundryServicesQuery, useGetLaundryItemsByServiceQuery } =
  serviceApiSlice;
