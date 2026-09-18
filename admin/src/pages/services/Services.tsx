import {
    useState,
  } from "react";
  import {
    Plus,
  } from "lucide-react";
  
  import ServicesTable from "./components/layout/ServicesTable";
  import ServiceModal from "./components/ui/ServiceModal";
  import { useServices } from "./hooks/useServices";
  
  import type {
    LaundryService,
    CreateLaundryServiceRequest,
    UpdateLaundryServiceRequest,
  } from "../../redux/slices/servicesApiSlice";
  
  const Services = () => {
    const {
      services,
      isLoading,
      isCreating,
      isUpdating,
      isDeleting,
      createService,
      updateService,
      deleteService,
    } = useServices();
  
    const [
      isModalOpen,
      setIsModalOpen,
    ] = useState(false);
  
    const [
      selectedService,
      setSelectedService,
    ] = useState<LaundryService | null>(null);
  
    const [
      deleteTarget,
      setDeleteTarget,
    ] = useState<LaundryService | null>(null);
  
    const [
      deleteError,
      setDeleteError,
    ] = useState<string | null>(null);
  
    const handleAddService = () => {
      setSelectedService(null);
      setIsModalOpen(true);
    };
  
    const handleEditService = (
      service: LaundryService,
    ) => {
      setSelectedService(service);
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      if (isCreating || isUpdating) {
        return;
      }
  
      setIsModalOpen(false);
      setSelectedService(null);
    };
  
    const handleSubmitService = async (
      data:
        | CreateLaundryServiceRequest
        | UpdateLaundryServiceRequest,
    ) => {
      if (selectedService) {
        await updateService(
          selectedService.id,
          data as UpdateLaundryServiceRequest,
        );
      } else {
        await createService(
          data as CreateLaundryServiceRequest,
        );
      }
  
      setIsModalOpen(false);
      setSelectedService(null);
    };
  
    const handleDeleteClick = (
      service: LaundryService,
    ) => {
      setDeleteError(null);
      setDeleteTarget(service);
    };
  
    const handleCloseDelete = () => {
      if (isDeleting) {
        return;
      }
  
      setDeleteTarget(null);
      setDeleteError(null);
    };
  
    const handleConfirmDelete = async () => {
      if (!deleteTarget) {
        return;
      }
  
      try {
        setDeleteError(null);
  
        await deleteService(
          deleteTarget.id,
        );
  
        setDeleteTarget(null);
      } catch {
        setDeleteError(
          "Unable to delete this service. Please try again.",
        );
      }
    };
  
    return (
      <div className="space-y-6">
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-2xl
                font-semibold
                text-gray-900
              "
            >
              Services
            </h1>
  
            <p className="mt-1 text-sm text-gray-500">
              Manage the laundry services available
              to customers.
            </p>
          </div>
  
          <button
            type="button"
            onClick={handleAddService}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-violet-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-violet-700
            "
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>
  
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-gray-100
            bg-white
          "
        >
          <ServicesTable
            services={services}
            isLoading={isLoading}
            onEdit={handleEditService}
            onDelete={handleDeleteClick}
          />
        </div>
  
        <ServiceModal
          key={
            selectedService?.id ??
            "new"
          }
          isOpen={isModalOpen}
          service={selectedService}
          isSubmitting={
            isCreating ||
            isUpdating
          }
          onClose={handleCloseModal}
          onSubmit={handleSubmitService}
        />
  
        {deleteTarget && (
          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/40
              px-4
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-service-title"
          >
            <div
              className="
                w-full
                max-w-md
                rounded-xl
                bg-white
                p-6
                shadow-xl
              "
            >
              <h2
                id="delete-service-title"
                className="
                  text-lg
                  font-semibold
                  text-gray-900
                "
              >
                Delete Service
              </h2>
  
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {deleteTarget.name}
                </span>
                ?
              </p>
  
              <p className="mt-2 text-xs text-gray-500">
                This action cannot be undone.
              </p>
  
              {deleteError && (
                <p
                  className="
                    mt-4
                    rounded-lg
                    bg-red-50
                    px-3
                    py-2
                    text-sm
                    text-red-600
                  "
                >
                  {deleteError}
                </p>
              )}
  
              <div
                className="
                  mt-6
                  flex
                  justify-end
                  gap-3
                "
              >
                <button
                  type="button"
                  onClick={handleCloseDelete}
                  disabled={isDeleting}
                  className="
                    rounded-lg
                    border
                    border-gray-200
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-700
                    transition-colors
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>
  
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="
                    rounded-lg
                    bg-red-600
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition-colors
                    hover:bg-red-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isDeleting
                    ? "Deleting..."
                    : "Delete Service"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Services;