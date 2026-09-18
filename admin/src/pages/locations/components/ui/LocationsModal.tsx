import { useState } from "react";
import { X } from "lucide-react";

import type {
  CreateLaundryLocationRequest,
  LaundryLocation,
  UpdateLaundryLocationRequest,
} from "../../../../redux/slices/laundryLocationsApiSlice";

interface LocationModalProps {
  isOpen: boolean;
  location: LaundryLocation | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    data:
      | CreateLaundryLocationRequest
      | UpdateLaundryLocationRequest,
  ) => Promise<void>;
}

interface LocationForm {
  name: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  phoneNumber: string;
  isActive: boolean;
}

const createInitialForm = (
  location: LaundryLocation | null,
): LocationForm => {
  if (location) {
    return {
      name: location.name,
      address: location.address,
      city: location.city,
      state: location.state,
      landmark: location.landmark,
      phoneNumber: location.phoneNumber,
      isActive: location.isActive,
    };
  }

  return {
    name: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    phoneNumber: "",
    isActive: true,
  };
};

const LocationModal = ({
  isOpen,
  location,
  isSubmitting,
  onClose,
  onSubmit,
}: LocationModalProps) => {
  const [form, setForm] = useState<LocationForm>(() =>
    createInitialForm(location),
  );

  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) {
    return null;
  }

  const isEditMode = location !== null;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrorMessage("");

    if (
      !form.name.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.phoneNumber.trim()
    ) {
      setErrorMessage(
        "Please fill in all required fields.",
      );

      return;
    }

    try {
      if (isEditMode && location) {
        const updateData: UpdateLaundryLocationRequest = {
          name: form.name.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          landmark: form.landmark.trim(),
          phoneNumber: form.phoneNumber.trim(),
          isActive: form.isActive,
        };

        await onSubmit(updateData);
      } else {
        const createData: CreateLaundryLocationRequest = {
          name: form.name.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          landmark: form.landmark.trim(),
          phoneNumber: form.phoneNumber.trim(),
        };

        await onSubmit(createData);
      }

      onClose();
    } catch {
      setErrorMessage(
        `Failed to ${
          isEditMode ? "update" : "create"
        } laundry location.`,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode
                ? "Edit Laundry Location"
                : "Add Laundry Location"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update the details of this laundry location."
                : "Add a new laundry location to your business."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-gray-500
              transition-colors
              hover:bg-gray-100
              hover:text-gray-900
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
            {/* Name */}
            <div className="md:col-span-2">
              <label
                htmlFor="location-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Location Name
              </label>

              <input
                id="location-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Better Life Branch"
                disabled={isSubmitting}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  py-3
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label
                htmlFor="location-address"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Address
              </label>

              <input
                id="location-address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="No 4, Gbenga Street"
                disabled={isSubmitting}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  py-3
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="location-city"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                City
              </label>

              <input
                id="location-city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="Alimosho"
                disabled={isSubmitting}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  py-3
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* State */}
            <div>
              <label
                htmlFor="location-state"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                State
              </label>

              <input
                id="location-state"
                name="state"
                type="text"
                value={form.state}
                onChange={handleChange}
                placeholder="Lagos"
                disabled={isSubmitting}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  py-3
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* Landmark */}
            <div>
              <label
                htmlFor="location-landmark"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Landmark
              </label>

              <input
                id="location-landmark"
                name="landmark"
                type="text"
                value={form.landmark}
                onChange={handleChange}
                placeholder="Better Life Busstop"
                disabled={isSubmitting}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  py-3
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="location-phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>

              <input
                id="location-phone"
                name="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="08022222222"
                disabled={isSubmitting}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  py-3
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                  disabled:bg-gray-50
                "
              />
            </div>

            {/* Active status */}
            {isEditMode && (
              <div className="md:col-span-2">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        isActive: event.target.checked,
                      }))
                    }
                    disabled={isSubmitting}
                    className="
                      h-4
                      w-4
                      rounded
                      border-gray-300
                      text-violet-600
                      focus:ring-violet-500
                    "
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Location is active
                  </span>
                </label>
              </div>
            )}

            {/* Error */}
            {errorMessage && (
              <div className="md:col-span-2">
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="
                rounded-lg
                border
                border-gray-200
                px-5
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
              type="submit"
              disabled={isSubmitting}
              className="
                rounded-lg
                bg-violet-600
                px-5
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
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update Location"
                  : "Add Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationModal;