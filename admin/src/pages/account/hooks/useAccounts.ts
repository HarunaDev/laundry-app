import {
    useCreateAccountMutation,
    useDeleteAccountMutation,
    useGetAccountsQuery,
    useUpdateAccountMutation,
    type CreateLaundryAccountRequest,
    type LaundryAccounts,
    type UpdateLaundryAccountRequest,
  } from "../../../redux/slices/accountApiSlice";
  
  export const useAccounts = () => {
    const {
      data,
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
    } = useGetAccountsQuery();
  
    const [
      createLaundryAccount,
      {
        isLoading: isCreating,
      },
    ] = useCreateAccountMutation();
  
    const [
      updateLaundryAccount,
      {
        isLoading: isUpdating,
      },
    ] = useUpdateAccountMutation();
  
    const [
      deleteLaundryAccount,
      {
        isLoading: isDeleting,
      },
    ] = useDeleteAccountMutation();
  
    const accounts = data?.data ?? [];
  
    const createAccount = async (
      account: CreateLaundryAccountRequest,
    ): Promise<void> => {
      await createLaundryAccount(account).unwrap();
    };
  
    const updateAccount = async (
      id: number,
      account: UpdateLaundryAccountRequest,
    ): Promise<void> => {
      await updateLaundryAccount({
        id,
        body: account,
      }).unwrap();
    };
  
    const deleteAccount = async (
      id: number,
    ): Promise<void> => {
      await deleteLaundryAccount(id).unwrap();
    };

    const getAccountById = (
        id: number,
      ): LaundryAccounts | undefined => {
        return accounts.find(
          (account) => account.id === id,
        );
      };
  
    return {
      accounts,
  
      isLoading,
      isFetching,
      isError,
      error,
  
      isCreating,
      isUpdating,
      isDeleting,
  
      createAccount,
      updateAccount,
      deleteAccount,
      getAccountById,
  
      refetch,
    };
  };