import {
    useState,
    type ChangeEvent,
    type FormEvent,
  } from "react";
  import { X } from "lucide-react";
  
  import type {
    LaundryService,
    CreateLaundryServiceRequest,
    UpdateLaundryServiceRequest,
  } from "../../../../redux/slices/servicesApiSlice";
  
  interface ServiceModalProps {
    isOpen: boolean;
    service: LaundryService | null;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (
      data:
        | CreateLaundryServiceRequest
        | UpdateLaundryServiceRequest,
    ) => Promise<void>;
  }
  
  interface ServiceForm {
    name: string;
    description: string;
    isActive: boolean;
  }
  
  const createInitialForm = (
    service: LaundryService | null,
  ): ServiceForm => {
    if (service) {
      return {
        name: service.name,
        description: service.description,
        isActive: service.isActive,
      };
    }
  
    return {
      name: "",
      description: "",
      isActive: true,
    };
  };
  
  const ServiceModal = ({
    isOpen,
    service,
    isSubmitting,
    onClose,
    onSubmit,
  }: ServiceModalProps) => {
    const [form, setForm] = useState<ServiceForm>(() =>
      createInitialForm(service),
    );
  
    if (!isOpen) {
      return null;
    }
  
    const isEditing = service !== null;
  
    const handleChange = (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >,
    ) => {
      const {
        name,
        value,
        type,
      } = event.target;
  
      if (type === "checkbox") {
        const checked = (
          event.target as HTMLInputElement
        ).checked;
  
        setForm((current) => ({
          ...current,
          [name]: checked,
        }));
  
        return;
      }
  
      setForm((current) => ({
        ...current,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();
  
      if (!form.name.trim()) {
        return;
      }
  
      if (isEditing) {
        await onSubmit({
          name: form.name.trim(),
          description: form.description.trim(),
          isActive: form.isActive,
        });
  
        return;
      }
  
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
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
        aria-labelledby="service-modal-title"
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
                id="service-modal-title"
                className="
                  text-lg
                  font-semibold
                  text-gray-900
                "
              >
                {isEditing
                  ? "Edit Service"
                  : "Add Service"}
              </h2>
  
              <p className="mt-1 text-sm text-gray-500">
                {isEditing
                  ? "Update the laundry service details."
                  : "Add a new laundry service."}
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
                  htmlFor="service-name"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Service Name
                </label>
  
                <input
                  id="service-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Wash"
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
                  htmlFor="service-description"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Description
                </label>
  
                <textarea
                  id="service-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this laundry service"
                  rows={4}
                  disabled={isSubmitting}
                  className="
                    w-full
                    resize-none
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
  
              {isEditing && (
                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-gray-100
                    bg-gray-50
                    px-4
                    py-3
                  "
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Active Service
                    </p>
  
                    <p className="mt-1 text-xs text-gray-500">
                      Allow customers to use this service.
                    </p>
                  </div>
  
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleChange}
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
                </label>
              )}
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
                  !form.name.trim()
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
                    : "Add Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default ServiceModal;