import { generalApiSlice } from "../apiSlice";

export interface LaundryService {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
  }
  
  export interface CreateLaundryServiceRequest {
    name: string;
    description: string;
  }
  
  export interface UpdateLaundryServiceRequest
    extends CreateLaundryServiceRequest {
    isActive: boolean;
  }
  
  export interface LaundryServicesResponse {
    success: boolean;
    message: string;
    data: LaundryService[];
  }
  
  export interface LaundryServiceResponse {
    success: boolean;
    message: string;
    data: LaundryService;
  }
  
  export interface DeleteLaundryServiceResponse {
    success: boolean;
    message: string;
    data: unknown;
  }

const servicesApiSlice = generalApiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getLaundryServices: builder.query<LaundryServicesResponse, void>({
        query: () => ({
          url: "/laundry-services",
          method: "GET",
        }),
        providesTags: ["LaundryServices"],
      }),
  
      createLaundryService: builder.mutation<
        LaundryServicesResponse,
        CreateLaundryServiceRequest
      >({
        query: (body) => ({
          url: "/laundry-services",
          method: "POST",
          body,
        }),
        invalidatesTags: ["LaundryServices"],
      }),
  
      updateLaundryService: builder.mutation<
        LaundryServiceResponse,
        {
          id: number;
          body: UpdateLaundryServiceRequest;
        }
      >({
        query: ({ id, body }) => ({
          url: `/laundry-services/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["LaundryServices"],
      }),
  
      deleteLaundryService: builder.mutation<
        DeleteLaundryServiceResponse,
        number
      >({
        query: (id) => ({
          url: `/laundry-services/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["LaundryServices"],
      }),
    }),
    overrideExisting: false,
  });
  
  export const {
    useGetLaundryServicesQuery,
    useCreateLaundryServiceMutation,
    useUpdateLaundryServiceMutation,
    useDeleteLaundryServiceMutation,
  } = servicesApiSlice;