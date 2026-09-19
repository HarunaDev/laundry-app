import {
    useCreateLaundryItemMutation,
    useDeleteLaundryItemMutation,
    useGetLaundryItemsQuery,
    useUpdateLaundryItemMutation,
    type CreateLaundryItemRequest,
    type LaundryItem,
    type UpdateLaundryItemRequest,
  } from "../../../redux/slices/itemsApiSlice";
  
  export const useItems = (
    serviceId: number | null,
  ) => {
    const {
      data,
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
    } = useGetLaundryItemsQuery(serviceId as number, {
      skip: serviceId === null,
    });
  
    const [
      createLaundryItem,
      {
        isLoading: isCreating,
      },
    ] = useCreateLaundryItemMutation();
  
    const [
      updateLaundryItem,
      {
        isLoading: isUpdating,
      },
    ] = useUpdateLaundryItemMutation();
  
    const [
      deleteLaundryItem,
      {
        isLoading: isDeleting,
      },
    ] = useDeleteLaundryItemMutation();
  
    const items = data?.data ?? [];
  
    const createItem = async (
      item: CreateLaundryItemRequest,
    ): Promise<void> => {
      await createLaundryItem(item).unwrap();
    };
  
    const updateItem = async (
      id: number,
      item: UpdateLaundryItemRequest,
    ): Promise<void> => {
      await updateLaundryItem({
        id,
        body: item,
      }).unwrap();
    };
  
    const deleteItem = async (
      id: number,
    ): Promise<void> => {
      await deleteLaundryItem(id).unwrap();
    };
  
    const getItemById = (
      id: number,
    ): LaundryItem | undefined => {
      return items.find(
        (item) => item.id === id,
      );
    };
  
    return {
      items,
  
      isLoading,
      isFetching,
      isError,
      error,
  
      isCreating,
      isUpdating,
      isDeleting,
  
      createItem,
      updateItem,
      deleteItem,
      getItemById,
  
      refetch,
    };
  };