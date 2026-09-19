import {
  useCreateDeliveryMethodMutation,
  useDeleteDeliveryMethodMutation,
  useGetDeliveryMethodsQuery,
  useUpdateDeliveryMethodMutation,
  type CreateDeliveryMethodRequest,
  type DeliveryMethod,
  type UpdateDeliveryMethodRequest,
} from "../../../redux/slices/deliveryApiSlice";

export const useDeliveryMethods = () => {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetDeliveryMethodsQuery();

  const [createDeliveryMethod, { isLoading: isCreating }] =
    useCreateDeliveryMethodMutation();

  const [updateDeliveryMethod, { isLoading: isUpdating }] =
    useUpdateDeliveryMethodMutation();

  const [deleteDeliveryMethod, { isLoading: isDeleting }] =
    useDeleteDeliveryMethodMutation();

  const deliveryMethods = data?.data ?? [];

  const createMethod = async (
    method: CreateDeliveryMethodRequest
  ): Promise<void> => {
    await createDeliveryMethod(method).unwrap();
  };

  const updateMethod = async (
    id: number,
    method: UpdateDeliveryMethodRequest
  ): Promise<void> => {
    await updateDeliveryMethod({
      id,
      body: method,
    }).unwrap();
  };

  const deleteMethod = async (id: number): Promise<void> => {
    await deleteDeliveryMethod(id).unwrap();
  };

  const getMethodById = (id: number): DeliveryMethod | undefined => {
    return deliveryMethods.find((method) => method.id === id);
  };

  return {
    deliveryMethods,

    isLoading,
    isFetching,
    isError,
    error,

    isCreating,
    isUpdating,
    isDeleting,

    createMethod,
    updateMethod,
    deleteMethod,
    getMethodById,

    refetch,
  };
};
