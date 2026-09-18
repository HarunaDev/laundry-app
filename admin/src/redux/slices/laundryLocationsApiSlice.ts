import { generalApiSlice } from "../apiSlice";

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

export interface CreateLaundryLocationRequest {
  name: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  phoneNumber: string;
}

export interface UpdateLaundryLocationRequest
  extends CreateLaundryLocationRequest {
  isActive: boolean;
}

export interface LaundryLocationsResponse {
  success: boolean;
  message: string;
  data: LaundryLocation[];
}

export interface LaundryLocationResponse {
  success: boolean;
  message: string;
  data: LaundryLocation;
}

export interface DeleteLaundryLocationResponse {
  success: boolean;
  message: string;
  data: unknown;
}

const laundryLocationsApiSlice = generalApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLaundryLocations: builder.query<LaundryLocationsResponse, void>({
      query: () => ({
        url: "/laundry-locations",
        method: "GET",
      }),
      providesTags: ["LaundryLocations"],
    }),

    createLaundryLocation: builder.mutation<
      LaundryLocationResponse,
      CreateLaundryLocationRequest
    >({
      query: (body) => ({
        url: "/laundry-locations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LaundryLocations"],
    }),

    updateLaundryLocation: builder.mutation<
      LaundryLocationResponse,
      {
        id: number;
        body: UpdateLaundryLocationRequest;
      }
    >({
      query: ({ id, body }) => ({
        url: `/laundry-locations/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["LaundryLocations"],
    }),

    deleteLaundryLocation: builder.mutation<
      DeleteLaundryLocationResponse,
      number
    >({
      query: (id) => ({
        url: `/laundry-locations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LaundryLocations"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLaundryLocationsQuery,
  useCreateLaundryLocationMutation,
  useUpdateLaundryLocationMutation,
  useDeleteLaundryLocationMutation,
} = laundryLocationsApiSlice;