import { useState, type ChangeEvent, type FormEvent } from "react";

import type { CreateAdminRequest } from "../../../../redux/slices/adminApiSlice";

interface AdminModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (admin: CreateAdminRequest) => Promise<void>;
}

interface AdminForm {
  userName: string;
  email: string;
  password: string;
}

const initialForm: AdminForm = {
  userName: "",
  email: "",
  password: "",
};

const AdminModal = ({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: AdminModalProps) => {
  const [form, setForm] = useState<AdminForm>(initialForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      userName: form.userName.trim(),
      email: form.email.trim(),
      password: form.password,
    });

    setForm(initialForm);
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setForm(initialForm);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">Add Admin</h2>

          <p className="mt-1 text-sm text-gray-500">
            Create a new administrator account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label
              htmlFor="userName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username
            </label>

            <input
              id="userName"
              name="userName"
              type="text"
              value={form.userName}
              onChange={handleChange}
              placeholder="Enter username"
              required
              minLength={3}
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
                  focus:border-gray-400
                  focus:ring-2
                  focus:ring-gray-100
                  disabled:bg-gray-50
                "
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
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
                  focus:border-gray-400
                  focus:ring-2
                  focus:ring-gray-100
                  disabled:bg-gray-50
                "
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              minLength={6}
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
                  focus:border-gray-400
                  focus:ring-2
                  focus:ring-gray-100
                  disabled:bg-gray-50
                "
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={handleClose}
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
                  transition
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
                  bg-gray-900
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-gray-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
            >
              {isSubmitting ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
