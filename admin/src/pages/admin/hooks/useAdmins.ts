import {
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useGetAdminQuery,
  type Admin,
  type CreateAdminRequest,
} from "../../../redux/slices/adminApiSlice";

interface UseAdminsParams {
  pageNumber: number;
  pageSize: number;
}

export const useAdmins = ({ pageNumber, pageSize }: UseAdminsParams) => {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAdminQuery({
      pageNumber,
      pageSize,
    });

  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();

  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  const admins = data?.data.admins ?? [];

  const totalRecords = data?.data.meta.totalRecords ?? 0;

  const totalPages = data?.data.meta.totalPages ?? 1;

  const createAdminAccount = async (
    admin: CreateAdminRequest
  ): Promise<void> => {
    await createAdmin(admin).unwrap();
  };

  const deleteAdminAccount = async (id: string): Promise<void> => {
    await deleteAdmin(id).unwrap();
  };

  const getAdminById = (id: string): Admin | undefined => {
    return admins.find((admin) => admin.id === id);
  };

  return {
    admins,
    totalRecords,
    totalPages,

    isLoading,
    isFetching,
    isError,
    error,

    isCreating,
    isDeleting,

    createAdminAccount,
    deleteAdminAccount,
    getAdminById,

    refetch,
  };
};
