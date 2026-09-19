import { useState } from "react";
import { Plus } from "lucide-react";

import DeliveryMethodsTable from "./components/layout/DeliveryMethodsTable";
import DeliveryMethodModal from "./components/ui/DeliveryMethodModal";
import { useDeliveryMethods } from "./hooks/useDeliveryMethods";

import type {
  DeliveryMethod,
  CreateDeliveryMethodRequest,
  UpdateDeliveryMethodRequest,
} from "../../redux/slices/deliveryApiSlice";

const DeliveryMethods = () => {
  const {
    deliveryMethods,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createMethod,
    updateMethod,
    deleteMethod,
  } = useDeliveryMethods();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState<DeliveryMethod | null>(
    null
  );

  const [deleteTarget, setDeleteTarget] = useState<DeliveryMethod | null>(null);

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleAddMethod = () => {
    setSelectedMethod(null);
    setIsModalOpen(true);
  };

  const handleEditMethod = (method: DeliveryMethod) => {
    setSelectedMethod(method);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isCreating || isUpdating) {
      return;
    }

    setIsModalOpen(false);
    setSelectedMethod(null);
  };

  const handleSubmitMethod = async (
    data: CreateDeliveryMethodRequest | UpdateDeliveryMethodRequest
  ) => {
    if (selectedMethod) {
      await updateMethod(
        selectedMethod.id,
        data as UpdateDeliveryMethodRequest
      );
    } else {
      await createMethod(data as CreateDeliveryMethodRequest);
    }

    setIsModalOpen(false);
    setSelectedMethod(null);
  };

  const handleDeleteClick = (method: DeliveryMethod) => {
    setDeleteError(null);
    setDeleteTarget(method);
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

      await deleteMethod(deleteTarget.id);

      setDeleteTarget(null);
    } catch {
      setDeleteError(
        "Unable to delete this delivery method. Please try again."
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
            Delivery Methods
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the delivery methods available to customers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddMethod}
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
          Add Delivery Method
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
        <DeliveryMethodsTable
          deliveryMethods={deliveryMethods}
          isLoading={isLoading}
          onEdit={handleEditMethod}
          onDelete={handleDeleteClick}
        />
      </div>

      <DeliveryMethodModal
        key={selectedMethod?.id ?? "new"}
        isOpen={isModalOpen}
        deliveryMethod={selectedMethod}
        isSubmitting={isCreating || isUpdating}
        onClose={handleCloseModal}
        onSubmit={handleSubmitMethod}
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
          aria-labelledby="delete-delivery-method-title"
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
              id="delete-delivery-method-title"
              className="
                  text-lg
                  font-semibold
                  text-gray-900
                "
            >
              Delete Delivery Method
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
                {isDeleting ? "Deleting..." : "Delete Delivery Method"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryMethods;
