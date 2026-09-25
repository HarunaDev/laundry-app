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

export const serviceApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLaundryServices: builder.query<LaundryServicesResponse, void>({
      query: () => ({
        url: "/laundry-services",
        method: "GET",
      }),
      providesTags: ["LaundryServices"],
    }),
  }),
});

export const {
  useGetLaundryServicesQuery,
} = serviceApiSlice;