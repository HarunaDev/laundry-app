import { useState } from "react";
import { Plus } from "lucide-react";

import ItemsTable from "./components/layout/ItemsTable";
import ItemModal from "./components/ui/ItemModal";
import { useItems } from "./hooks/useItems";

import { useServices } from "../services/hooks/useServices";

import type {
  LaundryItem,
  CreateLaundryItemRequest,
  UpdateLaundryItemRequest,
} from "../../redux/slices/itemsApiSlice";

const Items = () => {
  const { services, isLoading: isServicesLoading } = useServices();

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );

  const {
    items,
    isLoading: isItemsLoading,
    isFetching: isItemsFetching,
    isCreating,
    isUpdating,
    isDeleting,
    createItem,
    updateItem,
    deleteItem,
  } = useItems(selectedServiceId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<LaundryItem | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<LaundryItem | null>(null);

  const [deleteError, setDeleteError] = useState<string | null>(null);

  /*
   * Select the first service when the services
   * have loaded.
   */
  if (selectedServiceId === null && services.length > 0) {
    setSelectedServiceId(services[0].id);
  }

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = Number(event.target.value);

    if (Number.isInteger(serviceId) && serviceId > 0) {
      setSelectedServiceId(serviceId);
    }
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: LaundryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isCreating || isUpdating) {
      return;
    }

    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSubmitItem = async (
    data: CreateLaundryItemRequest | UpdateLaundryItemRequest
  ) => {
    if (selectedItem) {
      await updateItem(selectedItem.id, data);
    } else {
      await createItem(data);
    }

    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteClick = (item: LaundryItem) => {
    setDeleteError(null);
    setDeleteTarget(item);
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

      await deleteItem(deleteTarget.id);

      setDeleteTarget(null);
    } catch {
      setDeleteError("Unable to delete this item. Please try again.");
    }
  };

  const isItemsLoadingState = isItemsLoading || isItemsFetching;

  return (
    <div className="space-y-6">
      <div
        className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
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
            Laundry Items
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the items and prices available for each laundry service.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          disabled={isServicesLoading || services.length === 0}
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
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div
        className="
            flex
            flex-col
            gap-2
            sm:max-w-sm
          "
      >
        <label
          htmlFor="service-filter"
          className="
              text-sm
              font-medium
              text-gray-700
            "
        >
          Laundry Service
        </label>

        <select
          id="service-filter"
          value={selectedServiceId ?? ""}
          onChange={handleServiceChange}
          disabled={isServicesLoading || services.length === 0}
          className="
              w-full
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
              py-2.5
              text-sm
              text-gray-900
              outline-none
              transition
              focus:border-violet-500
              focus:ring-2
              focus:ring-violet-100
              disabled:bg-gray-50
            "
        >
          {isServicesLoading && <option value="">Loading services...</option>}

          {!isServicesLoading && services.length === 0 && (
            <option value="">No services available</option>
          )}

          {!isServicesLoading &&
            services.length > 0 &&
            services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
        </select>
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
        <ItemsTable
          items={items}
          isLoading={isItemsLoadingState}
          onEdit={handleEditItem}
          onDelete={handleDeleteClick}
        />
      </div>

      <ItemModal
        key={selectedItem?.id ?? `new-${selectedServiceId ?? "none"}`}
        isOpen={isModalOpen}
        item={selectedItem}
        services={services}
        selectedServiceId={selectedServiceId}
        isSubmitting={isCreating || isUpdating}
        isServicesLoading={isServicesLoading}
        onClose={handleCloseModal}
        onSubmit={handleSubmitItem}
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
          aria-labelledby="delete-item-title"
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
              id="delete-item-title"
              className="
                  text-lg
                  font-semibold
                  text-gray-900
                "
            >
              Delete Laundry Item
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
                {isDeleting ? "Deleting..." : "Delete Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;
