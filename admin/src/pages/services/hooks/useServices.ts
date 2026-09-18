import {
    useCreateLaundryServiceMutation,
    useDeleteLaundryServiceMutation,
    useGetLaundryServicesQuery,
    useUpdateLaundryServiceMutation,
    type CreateLaundryServiceRequest,
    type LaundryService,
    type UpdateLaundryServiceRequest,
  } from "../../../redux/slices/servicesApiSlice";
  
  export const useServices = () => {
    const {
      data,
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
    } = useGetLaundryServicesQuery();
  
    const [
      createLaundryService,
      {
        isLoading: isCreating,
      },
    ] = useCreateLaundryServiceMutation();
  
    const [
      updateLaundryService,
      {
        isLoading: isUpdating,
      },
    ] = useUpdateLaundryServiceMutation();
  
    const [
      deleteLaundryService,
      {
        isLoading: isDeleting,
      },
    ] = useDeleteLaundryServiceMutation();
  
    const services = data?.data ?? [];
  
    const createService = async (
      service: CreateLaundryServiceRequest,
    ): Promise<void> => {
      await createLaundryService(service).unwrap();
    };
  
    const updateService = async (
      id: number,
      service: UpdateLaundryServiceRequest,
    ): Promise<void> => {
      await updateLaundryService({
        id,
        body: service,
      }).unwrap();
    };
  
    const deleteService = async (
      id: number,
    ): Promise<void> => {
      await deleteLaundryService(id).unwrap();
    };
  
    const getServiceById = (
      id: number,
    ): LaundryService | undefined => {
      return services.find(
        (service) => service.id === id,
      );
    };
  
    return {
      services,
  
      isLoading,
      isFetching,
      isError,
      error,
  
      isCreating,
      isUpdating,
      isDeleting,
  
      createService,
      updateService,
      deleteService,
      getServiceById,
  
      refetch,
    };
  };