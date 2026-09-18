import { useState } from "react";
import { Plus } from "lucide-react";

import LocationsTable from "./components/layout/LocationsTable";
import LocationModal from "./components/ui/LocationsModal";
import { useLocations } from "./hooks/useLocations";

import type {
  CreateLaundryLocationRequest,
  LaundryLocation,
  UpdateLaundryLocationRequest,
} from "../../redux/slices/laundryLocationsApiSlice";

const Locations = () => {
  const {
    locations,
    isLoading,
    isFetching,
    isError,
    isCreating,
    isUpdating,
    isDeleting,
    createLocation,
    updateLocation,
    deleteLocation,
  } = useLocations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LaundryLocation | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<LaundryLocation | null>(null);

  const [deleteError, setDeleteError] = useState("");

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setIsModalOpen(true);
  };

  const handleEditLocation = (location: LaundryLocation) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isCreating || isUpdating) {
      return;
    }

    setIsModalOpen(false);
    setSelectedLocation(null);
  };

  const handleSubmitLocation = async (
    data:
      | CreateLaundryLocationRequest
      | UpdateLaundryLocationRequest,
  ) => {
    if (selectedLocation) {
      await updateLocation(selectedLocation.id, {
        ...data,
        isActive:
          "isActive" in data
            ? data.isActive
            : selectedLocation.isActive,
      });

      return;
    }

    await createLocation(data);
  };

  const handleDeleteClick = (location: LaundryLocation) => {
    setDeleteError("");
    setDeleteTarget(location);
  };

  const handleDeleteCancel = () => {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleteError("");

      await deleteLocation(deleteTarget.id);

      setDeleteTarget(null);
    } catch {
      setDeleteError("Failed to delete the laundry location.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Laundry Locations
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your laundry branches and locations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddLocation}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          <Plus size={18} />
          Add Location
        </button>
      </div>

      {isError && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          Failed to load laundry locations. Please try again.
        </div>
      )}

      {deleteError && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {deleteError}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              All Locations
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {locations.length}{" "}
              {locations.length === 1 ? "location" : "locations"}
            </p>
          </div>

          {isFetching && !isLoading && (
            <span className="text-xs text-gray-400">
              Updating...
            </span>
          )}
        </div>

        <LocationsTable
          locations={locations}
          isLoading={isLoading}
          onEdit={handleEditLocation}
          onDelete={handleDeleteClick}
        />
      </div>

      <LocationModal
        key={selectedLocation?.id ?? "new"}
        isOpen={isModalOpen}
        location={selectedLocation}
        isSubmitting={isCreating || isUpdating}
        onClose={handleCloseModal}
        onSubmit={handleSubmitLocation}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Location
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                {deleteTarget.name}
              </span>
              ? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Location"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;