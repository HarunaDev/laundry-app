import { generalApiSlice } from "../apiSlice";

export interface LaundryAccounts {
    id: number;
    bankName: string;
    accountName: string;
    accountNumber: string;
    isActive: boolean;
  }
  
  export interface CreateLaundryAccountRequest {
    bankName: string;
    accountName: string;
    accountNumber: string;
  }
  
  export interface UpdateLaundryAccountRequest
    extends CreateLaundryAccountRequest {
    isActive: boolean;
  }
  
  export interface LaundryAccountResponse {
    success: boolean;
    message: string;
    data: LaundryAccounts[];
  }
  
//   export interface LaundryServiceResponse {
//     success: boolean;
//     message: string;
//     data: LaundryService;
//   }
  
  export interface DeleteLaundryAccountResponse {
    success: boolean;
    message: string;
    data: unknown;
  }

const accountApiSlice = generalApiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getAccounts: builder.query<LaundryAccountResponse, void>({
        query: () => ({
          url: "/bank-accounts",
          method: "GET",
        }),
        providesTags: ["Account"],
      }),
  
      createAccount: builder.mutation<
      LaundryAccountResponse,
        CreateLaundryAccountRequest
      >({
        query: (body) => ({
          url: "/bank-accounts",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Account"],
      }),
  
      updateAccount: builder.mutation<
      LaundryAccountResponse,
        {
          id: number;
          body: UpdateLaundryAccountRequest;
        }
      >({
        query: ({ id, body }) => ({
          url: `/bank-accounts/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Account"],
      }),
  
      deleteAccount: builder.mutation<
        DeleteLaundryAccountResponse,
        number
      >({
        query: (id) => ({
          url: `/bank-accounts/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Account"],
      }),
    }),
    overrideExisting: false,
  });
  
  export const {
    useGetAccountsQuery,
    useCreateAccountMutation,
    useUpdateAccountMutation,
    useDeleteAccountMutation,
  } = accountApiSlice;