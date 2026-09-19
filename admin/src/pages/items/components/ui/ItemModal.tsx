import { useState, type ChangeEvent, type FormEvent } from "react";
import { X } from "lucide-react";

import type {
  LaundryItem,
  CreateLaundryItemRequest,
  UpdateLaundryItemRequest,
} from "../../../../redux/slices/itemsApiSlice";

import type { LaundryService } from "../../../../redux/slices/servicesApiSlice";

interface ItemModalProps {
  isOpen: boolean;
  item: LaundryItem | null;
  services: LaundryService[];
  selectedServiceId: number | null;
  isSubmitting: boolean;
  isServicesLoading: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateLaundryItemRequest | UpdateLaundryItemRequest
  ) => Promise<void>;
}

interface ItemForm {
  name: string;
  price: string;
  laundryServiceId: string;
}

const createInitialForm = (
  item: LaundryItem | null,
  selectedServiceId: number | null
): ItemForm => {
  if (item) {
    return {
      name: item.name,
      price: String(item.price),
      laundryServiceId: String(item.laundryServiceId),
    };
  }

  return {
    name: "",
    price: "",
    laundryServiceId:
      selectedServiceId !== null ? String(selectedServiceId) : "",
  };
};

const ItemModal = ({
  isOpen,
  item,
  services,
  selectedServiceId,
  isSubmitting,
  isServicesLoading,
  onClose,
  onSubmit,
}: ItemModalProps) => {
  const [form, setForm] = useState<ItemForm>(() =>
    createInitialForm(item, selectedServiceId)
  );

  if (!isOpen) {
    return null;
  }

  const isEditing = item !== null;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const price = Number(form.price);
    const laundryServiceId = Number(form.laundryServiceId);

    if (
      !form.name.trim() ||
      !form.price ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(laundryServiceId) ||
      laundryServiceId <= 0
    ) {
      return;
    }

    if (isEditing) {
      await onSubmit({
        name: form.name.trim(),
        price,
        laundryServiceId,
      });

      return;
    }

    await onSubmit({
      name: form.name.trim(),
      price,
      laundryServiceId,
    });
  };

  return (
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
      aria-labelledby="item-modal-title"
    >
      <div
        className="
            w-full
            max-w-lg
            rounded-xl
            bg-white
            shadow-xl
          "
      >
        <div
          className="
              flex
              items-center
              justify-between
              border-b
              border-gray-100
              px-6
              py-4
            "
        >
          <div>
            <h2
              id="item-modal-title"
              className="
                  text-lg
                  font-semibold
                  text-gray-900
                "
            >
              {isEditing ? "Edit Laundry Item" : "Add Laundry Item"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Update the laundry item details."
                : "Add a new item to a laundry service."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
                flex
                h-8
                w-8
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
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div>
              <label
                htmlFor="item-name"
                className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
              >
                Item Name
              </label>

              <input
                id="item-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Shirt"
                disabled={isSubmitting}
                required
                className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    px-3
                    py-2.5
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-violet-500
                    focus:ring-2
                    focus:ring-violet-100
                    disabled:bg-gray-50
                  "
              />
            </div>

            <div>
              <label
                htmlFor="item-price"
                className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
              >
                Price
              </label>

              <input
                id="item-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 1000"
                disabled={isSubmitting}
                required
                className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    px-3
                    py-2.5
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-violet-500
                    focus:ring-2
                    focus:ring-violet-100
                    disabled:bg-gray-50
                  "
              />
            </div>

            <div>
              <label
                htmlFor="item-service"
                className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
              >
                Laundry Service
              </label>

              <select
                id="item-service"
                name="laundryServiceId"
                value={form.laundryServiceId}
                onChange={handleChange}
                disabled={isSubmitting || isServicesLoading}
                required
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
                <option value="">
                  {isServicesLoading
                    ? "Loading services..."
                    : "Select a service"}
                </option>

                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="
                flex
                justify-end
                gap-3
                border-t
                border-gray-100
                px-6
                py-4
              "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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
              type="submit"
              disabled={
                isSubmitting ||
                isServicesLoading ||
                !form.name.trim() ||
                !form.price ||
                !form.laundryServiceId
              }
              className="
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
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
