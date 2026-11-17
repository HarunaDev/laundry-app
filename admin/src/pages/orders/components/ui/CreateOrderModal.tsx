import type { ChangeEvent, FormEvent, JSX } from "react";

import type { User } from "../../../../redux/slices/usersApiSlice";

import type { DeliveryMethod } from "../../../../redux/slices/deliveryApiSlice";

import type { LaundryLocation } from "../../../../redux/slices/laundryLocationsApiSlice";

import type { LaundryService } from "../../../../redux/slices/servicesApiSlice";

import type { LaundryItem } from "../../../../redux/slices/itemsApiSlice";

import type {
  OrderItemRequest,
  PaymentMethod,
} from "../../../../redux/slices/ordersApiSlice";

interface SelectedOrderItem {
  serviceId: number;
  serviceName: string;
  laundryItemId: number;
  itemName: string;
  price: number;
  quantity: number;
}

interface CreateOrderModalProps {
  isOpen: boolean;
  isLoading: boolean;
  isSubmitting: boolean;

  users: User[];
  services: LaundryService[];
  deliveryMethods: DeliveryMethod[];
  locations: LaundryLocation[];
  laundryItems: LaundryItem[];

  selectedServiceId: number;
  selectedItems: SelectedOrderItem[];

  userId: string;
  deliveryMethodId: number;
  laundryLocationId: number;
  pickupAddress: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod | "";
  items: OrderItemRequest[];

  pickupAddressRequired: boolean;
  deliveryAddressRequired: boolean;

  onClose: () => void;
  onSubmit: () => Promise<void>;

  onUserChange: (userId: string) => void;

  onServiceChange: (serviceId: number) => void;

  onDeliveryMethodChange: (deliveryMethodId: number) => void;

  onLocationChange: (locationId: number) => void;

  onPickupAddressChange: (value: string) => void;

  onDeliveryAddressChange: (value: string) => void;
  onPaymentMethodChange: (value: PaymentMethod | "") => void;

  onAddItem: (laundryItemId: number) => void;

  onRemoveItem: (laundryItemId: number) => void;

  onQuantityChange: (laundryItemId: number, quantity: number) => void;
}

const CreateOrderModal = ({
  isOpen,
  isLoading,
  isSubmitting,

  users,
  services,
  deliveryMethods,
  locations,
  laundryItems,

  selectedServiceId,
  selectedItems,

  userId,
  deliveryMethodId,
  laundryLocationId,
  pickupAddress,
  deliveryAddress,
  paymentMethod,
  items,

  pickupAddressRequired,
  deliveryAddressRequired,

  onClose,
  onSubmit,

  onUserChange,
  onServiceChange,
  onDeliveryMethodChange,
  onLocationChange,
  onPickupAddressChange,
  onDeliveryAddressChange,
  onPaymentMethodChange,

  onAddItem,
  onRemoveItem,
  onQuantityChange,
}: CreateOrderModalProps): JSX.Element | null => {
  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit();
  };

  const handleServiceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onServiceChange(Number(event.target.value));
  };

  const handleItemChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const laundryItemId = Number(event.target.value);

    if (laundryItemId > 0) {
      onAddItem(laundryItemId);

      event.target.value = "0";
    }
  };

  const totalItems = selectedItems.length;

  const itemsTotal = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const selectedDeliveryMethod = deliveryMethods.find(
    (method) => method.id === deliveryMethodId
  );

  const deliveryFee = selectedDeliveryMethod?.price ?? 0;

  const grandTotal = itemsTotal + deliveryFee;

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
          p-4
        "
    >
      <div
        className="
            flex
            max-h-[90vh]
            w-full
            max-w-4xl
            flex-col
            overflow-hidden
            rounded-xl
            bg-white
            shadow-xl
          "
      >
        {/* Header */}
        <div
          className="
              flex
              items-center
              justify-between
              border-b
              border-gray-100
              px-6
              py-5
            "
        >
          <div>
            <h2
              className="
                  text-lg
                  font-semibold
                  text-gray-900
                "
            >
              Create New Order
            </h2>

            <p
              className="
                  mt-1
                  text-sm
                  text-gray-500
                "
            >
              Add services and laundry items to this order.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
                text-2xl
                leading-none
                text-gray-400
                transition
                hover:text-gray-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
          >
            ×
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="
              flex
              min-h-0
              flex-1
              flex-col
            "
        >
          <div
            className="
                flex-1
                space-y-6
                overflow-y-auto
                p-6
              "
          >
            {/* Client */}
            <div>
              <label
                htmlFor="order-client"
                className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
              >
                Client
              </label>

              <select
                id="order-client"
                value={userId}
                onChange={(event) => onUserChange(event.target.value)}
                required
                className="
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-3
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
              >
                <option value="">Select client</option>

                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.userName} — {user.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery information */}
            <div
              className="
                  grid
                  gap-4
                  md:grid-cols-2
                "
            >
              {/* Delivery method */}
              <div>
                <label
                  htmlFor="delivery-method"
                  className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                >
                  Delivery Method
                </label>

                <select
                  id="delivery-method"
                  value={deliveryMethodId}
                  onChange={(event) =>
                    onDeliveryMethodChange(Number(event.target.value))
                  }
                  required
                  className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-3
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                >
                  <option value={0}>Select delivery method</option>

                  {deliveryMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name} — ₦{method.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="laundry-location"
                  className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                >
                  Laundry Location
                </label>

                <select
                  id="laundry-location"
                  value={laundryLocationId}
                  onChange={(event) =>
                    onLocationChange(Number(event.target.value))
                  }
                  required
                  className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-3
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                >
                  <option value={0}>Select laundry location</option>

                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Addresses */}
            <div
              className="
                  grid
                  gap-4
                  md:grid-cols-2
                "
            >
              {pickupAddressRequired && (
                <div>
                  <label
                    htmlFor="pickup-address"
                    className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                      "
                  >
                    Pickup Address
                  </label>

                  <textarea
                    id="pickup-address"
                    value={pickupAddress}
                    onChange={(event) =>
                      onPickupAddressChange(event.target.value)
                    }
                    required
                    rows={3}
                    className="
                        w-full
                        resize-none
                        rounded-lg
                        border
                        border-gray-200
                        px-3
                        py-2
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    placeholder="Enter pickup address"
                  />
                </div>
              )}

              {deliveryAddressRequired && (
                <div>
                  <label
                    htmlFor="delivery-address"
                    className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                      "
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="delivery-address"
                    value={deliveryAddress}
                    onChange={(event) =>
                      onDeliveryAddressChange(event.target.value)
                    }
                    required
                    rows={3}
                    className="
                        w-full
                        resize-none
                        rounded-lg
                        border
                        border-gray-200
                        px-3
                        py-2
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    placeholder="Enter delivery address"
                  />
                </div>
              )}
            </div>

            {/* Payment method */}
            <div>
              <label
                htmlFor="payment-method"
                className="
      mb-2
      block
      text-sm
      font-medium
      text-gray-700
    "
              >
                Payment Method
              </label>

              <select
                id="payment-method"
                value={paymentMethod}
                onChange={(event) => {
                  const value = event.target.value;

                  if (
                    value === "Cash" ||
                    value === "Transfer" ||
                    value === ""
                  ) {
                    onPaymentMethodChange(value);
                  }
                }}
                required
                className="
      h-11
      w-full
      rounded-lg
      border
      border-gray-200
      bg-white
      px-3
      text-sm
      outline-none
      focus:border-blue-500
      focus:ring-2
      focus:ring-blue-100
    "
              >
                <option value="">Select payment method</option>
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
            {/* Payment method */}
            {/* <div>
              <label htmlFor="paymentMethod">Payment Method</label>

              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(event) => {
                  const value = event.target.value;

                  if (
                    value === "Cash" ||
                    value === "Transfer" ||
                    value === ""
                  ) {
                    onPaymentMethodChange(value);
                  }
                }}
                required
              >
                <option value="">Select payment method</option>
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div> */}

            {/* Service + item selection */}
            <div
              className="
                  rounded-lg
                  border
                  border-gray-200
                  p-4
                "
            >
              <div className="mb-4">
                <h3
                  className="
                      text-sm
                      font-semibold
                      text-gray-900
                    "
                >
                  Laundry Items
                </h3>

                <p
                  className="
                      mt-1
                      text-xs
                      text-gray-500
                    "
                >
                  Select a service to view its items. You can switch services
                  without losing previously selected items.
                </p>
              </div>

              <div
                className="
                    grid
                    gap-4
                    md:grid-cols-2
                  "
              >
                {/* Service */}
                <div>
                  <label
                    htmlFor="order-service"
                    className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                      "
                  >
                    Service
                  </label>

                  <select
                    id="order-service"
                    value={selectedServiceId}
                    onChange={handleServiceChange}
                    className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        px-3
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                  >
                    <option value={0}>Select service</option>

                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Item */}
                <div>
                  <label
                    htmlFor="order-item"
                    className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-700
                      "
                  >
                    Laundry Item
                  </label>

                  <select
                    id="order-item"
                    defaultValue="0"
                    onChange={handleItemChange}
                    disabled={selectedServiceId === 0 || isLoading}
                    className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        px-3
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                        disabled:cursor-not-allowed
                        disabled:bg-gray-50
                      "
                  >
                    <option value="0">
                      {selectedServiceId === 0
                        ? "Select service first"
                        : isLoading
                        ? "Loading items..."
                        : "Select item"}
                    </option>

                    {laundryItems.map((item) => {
                      const alreadySelected = items.some(
                        (selectedItem) => selectedItem.laundryItemId === item.id
                      );

                      return (
                        <option
                          key={item.id}
                          value={item.id}
                          disabled={alreadySelected}
                        >
                          {item.name} — ₦{item.price.toLocaleString()}
                          {alreadySelected ? " (Added)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Selected items */}
            <div>
              <div
                className="
                    mb-3
                    flex
                    items-center
                    justify-between
                  "
              >
                <h3
                  className="
                      text-sm
                      font-semibold
                      text-gray-900
                    "
                >
                  Selected Items
                </h3>

                <span
                  className="
                      rounded-full
                      bg-blue-50
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      text-blue-600
                    "
                >
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>

              {selectedItems.length === 0 ? (
                <div
                  className="
                      rounded-lg
                      border
                      border-dashed
                      border-gray-200
                      px-4
                      py-8
                      text-center
                      text-sm
                      text-gray-500
                    "
                >
                  No items selected yet.
                  <br />
                  Select a service above and add its items.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div
                      key={item.laundryItemId}
                      className="
                            flex
                            flex-col
                            gap-3
                            rounded-lg
                            border
                            border-gray-200
                            p-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                    >
                      <div>
                        <p
                          className="
                                text-sm
                                font-medium
                                text-gray-900
                              "
                        >
                          {item.itemName}
                        </p>

                        <p
                          className="
                                mt-1
                                text-xs
                                text-gray-500
                              "
                        >
                          {item.serviceName}
                        </p>

                        <p
                          className="
                                mt-1
                                text-xs
                                text-gray-500
                              "
                        >
                          ₦{item.price.toLocaleString()} each
                        </p>
                      </div>

                      <div
                        className="
                              flex
                              items-center
                              gap-3
                            "
                      >
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            onQuantityChange(
                              item.laundryItemId,
                              Number(event.target.value)
                            )
                          }
                          className="
                                h-10
                                w-20
                                rounded-lg
                                border
                                border-gray-200
                                px-3
                                text-center
                                text-sm
                                outline-none
                                focus:border-blue-500
                              "
                        />

                        <span
                          className="
                                min-w-22.5
                                text-right
                                text-sm
                                font-semibold
                                text-gray-900
                              "
                        >
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.laundryItemId)}
                          className="
                                text-sm
                                font-medium
                                text-red-500
                                hover:text-red-600
                              "
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals */}
            <div
              className="
                  rounded-lg
                  bg-gray-50
                  p-4
                "
            >
              <div
                className="
                    flex
                    justify-between
                    text-sm
                    text-gray-600
                  "
              >
                <span>Laundry items</span>

                <span>₦{itemsTotal.toLocaleString()}</span>
              </div>

              <div
                className="
                    mt-2
                    flex
                    justify-between
                    text-sm
                    text-gray-600
                  "
              >
                <span>Delivery fee</span>

                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>

              <div
                className="
                    mt-3
                    flex
                    justify-between
                    border-t
                    border-gray-200
                    pt-3
                    text-base
                    font-semibold
                    text-gray-900
                  "
              >
                <span>Total</span>

                <span>₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="
                flex
                items-center
                justify-end
                gap-3
                border-t
                border-gray-100
                bg-white
                px-6
                py-4
              "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="
                  h-11
                  rounded-lg
                  border
                  border-gray-200
                  px-5
                  text-sm
                  font-medium
                  text-gray-600
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
              disabled={
                isSubmitting ||
                isLoading ||
                !userId ||
                deliveryMethodId === 0 ||
                laundryLocationId === 0 ||
                !paymentMethod ||
                items.length === 0
              }
              className="
                  h-11
                  rounded-lg
                  bg-blue-600
                  px-5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
            >
              {isSubmitting ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;
