import {
    useCreateLaundryLocationMutation,
    useDeleteLaundryLocationMutation,
    useGetLaundryLocationsQuery,
    useUpdateLaundryLocationMutation,
    type CreateLaundryLocationRequest,
    type LaundryLocation,
    type UpdateLaundryLocationRequest,
  } from "../../../redux/slices/laundryLocationsApiSlice";
  
  export const useLocations = () => {
    const {
      data,
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
    } = useGetLaundryLocationsQuery();
  
    const [
      createLaundryLocation,
      {
        isLoading: isCreating,
      },
    ] = useCreateLaundryLocationMutation();
  
    const [
      updateLaundryLocation,
      {
        isLoading: isUpdating,
      },
    ] = useUpdateLaundryLocationMutation();
  
    const [
      deleteLaundryLocation,
      {
        isLoading: isDeleting,
      },
    ] = useDeleteLaundryLocationMutation();
  
    const locations = data?.data ?? [];
  
    const createLocation = async (
      location: CreateLaundryLocationRequest,
    ): Promise<void> => {
      await createLaundryLocation(location).unwrap();
    };
  
    const updateLocation = async (
      id: number,
      location: UpdateLaundryLocationRequest,
    ): Promise<void> => {
      await updateLaundryLocation({
        id,
        body: location,
      }).unwrap();
    };
  
    const deleteLocation = async (id: number): Promise<void> => {
      await deleteLaundryLocation(id).unwrap();
    };
  
    const getLocationById = (id: number): LaundryLocation | undefined => {
      return locations.find((location) => location.id === id);
    };
  
    return {
      locations,
  
      isLoading,
      isFetching,
      isError,
      error,
  
      isCreating,
      isUpdating,
      isDeleting,
  
      createLocation,
      updateLocation,
      deleteLocation,
      getLocationById,
  
      refetch,
    };
  };