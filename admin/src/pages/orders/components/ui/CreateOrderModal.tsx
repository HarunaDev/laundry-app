// import { useState } from "react";

// import {
//   useCreateOrderMutation,
//   type CreateOrderRequest,
//   type OrderItemRequest,
// } from "../../../../redux/slices/ordersApiSlice";

// import {
//   useGetUsersQuery,
// } from "../../../../redux/slices/usersApiSlice";

// import {
//   useGetDeliveryMethodsQuery,
// } from "../../../../redux/slices/deliveryApiSlice";

// import {
//   useGetLaundryLocationsQuery,
// } from "../../../../redux/slices/laundryLocationsApiSlice";

// import {
//   useGetLaundryItemsQuery,
// } from "../../../../redux/slices/itemsApiSlice";

// import {
//   useGetLaundryServicesQuery,
// } from "../../../../redux/slices/servicesApiSlice";

// import {
//   requiresDeliveryAddress,
//   requiresPickupAddress,
// } from "../../hooks/orderAddressRules";

// interface CreateOrderFormState {
//   userId: string;
//   serviceId: number;
//   deliveryMethodId: number;
//   laundryLocationId: number;
//   pickupAddress: string;
//   deliveryAddress: string;
//   items: OrderItemRequest[];
// }

// const initialFormState: CreateOrderFormState = {
//   userId: "",
//   serviceId: 0,
//   deliveryMethodId: 0,
//   laundryLocationId: 0,
//   pickupAddress: "",
//   deliveryAddress: "",
//   items: [],
// };

// export const useCreateOrder = () => {
//   const [form, setForm] =
//     useState<CreateOrderFormState>(
//       initialFormState
//     );

//   const [
//     createOrder,
//     createOrderState,
//   ] = useCreateOrderMutation();

//   /*
//    * Clients
//    */
//   const {
//     data: usersResponse,
//     isLoading: isLoadingUsers,
//   } = useGetUsersQuery({
//     pageNumber: 1,
//     pageSize: 100,
//   });

//   /*
//    * Services
//    */
//   const {
//     data: servicesResponse,
//     isLoading: isLoadingServices,
//   } = useGetLaundryServicesQuery();

//   /*
//    * Delivery methods
//    */
//   const {
//     data: deliveryResponse,
//     isLoading: isLoadingDeliveryMethods,
//   } = useGetDeliveryMethodsQuery();

//   /*
//    * Laundry locations
//    */
//   const {
//     data: locationsResponse,
//     isLoading: isLoadingLocations,
//   } = useGetLaundryLocationsQuery();

//   /*
//    * Laundry items for the selected service
//    */
//   const {
//     data: itemsResponse,
//     isLoading: isLoadingItems,
//   } = useGetLaundryItemsQuery(
//     form.serviceId,
//     {
//       skip: form.serviceId === 0,
//     }
//   );

//   /*
//    * API data
//    */
//   const users =
//     usersResponse?.data.users ?? [];

//   const services =
//     servicesResponse?.data ?? [];

//   const deliveryMethods =
//     deliveryResponse?.data ?? [];

//   const locations =
//     locationsResponse?.data ?? [];

//   const laundryItems =
//     itemsResponse?.data ?? [];

//   /*
//    * Address rules
//    */
//   const pickupAddressRequired =
//     requiresPickupAddress(
//       form.deliveryMethodId
//     );

//   const deliveryAddressRequired =
//     requiresDeliveryAddress(
//       form.deliveryMethodId
//     );

//   /*
//    * Form setters
//    */
//   const setUserId = (
//     userId: string
//   ) => {
//     setForm((current) => ({
//       ...current,
//       userId,
//     }));
//   };

//   const setServiceId = (
//     serviceId: number
//   ) => {
//     setForm((current) => ({
//       ...current,
//       serviceId,

//       // Changing service removes
//       // previously selected items.
//       items: [],
//     }));
//   };

//   const setDeliveryMethodId = (
//     deliveryMethodId: number
//   ) => {
//     setForm((current) => ({
//       ...current,
//       deliveryMethodId,

//       /*
//        * Remove addresses that are no
//        * longer applicable.
//        */
//       pickupAddress:
//         requiresPickupAddress(
//           deliveryMethodId
//         )
//           ? current.pickupAddress
//           : "",

//       deliveryAddress:
//         requiresDeliveryAddress(
//           deliveryMethodId
//         )
//           ? current.deliveryAddress
//           : "",
//     }));
//   };

//   const setLaundryLocationId = (
//     laundryLocationId: number
//   ) => {
//     setForm((current) => ({
//       ...current,
//       laundryLocationId,
//     }));
//   };

//   const setPickupAddress = (
//     pickupAddress: string
//   ) => {
//     setForm((current) => ({
//       ...current,
//       pickupAddress,
//     }));
//   };

//   const setDeliveryAddress = (
//     deliveryAddress: string
//   ) => {
//     setForm((current) => ({
//       ...current,
//       deliveryAddress,
//     }));
//   };

//   /*
//    * Items
//    */
//   const addItem = (
//     item: OrderItemRequest
//   ) => {
//     setForm((current) => {
//       const alreadyExists =
//         current.items.some(
//           (existingItem) =>
//             existingItem.laundryItemId ===
//             item.laundryItemId
//         );

//       if (alreadyExists) {
//         return current;
//       }

//       return {
//         ...current,
//         items: [
//           ...current.items,
//           item,
//         ],
//       };
//     });
//   };

//   const removeItem = (
//     laundryItemId: number
//   ) => {
//     setForm((current) => ({
//       ...current,

//       items: current.items.filter(
//         (item) =>
//           item.laundryItemId !==
//           laundryItemId
//       ),
//     }));
//   };

//   const updateQuantity = (
//     laundryItemId: number,
//     quantity: number
//   ) => {
//     setForm((current) => ({
//       ...current,

//       items: current.items.map(
//         (item) =>
//           item.laundryItemId ===
//           laundryItemId
//             ? {
//                 ...item,
//                 quantity:
//                   Math.max(
//                     1,
//                     quantity
//                   ),
//               }
//             : item
//       ),
//     }));
//   };

//   /*
//    * Build API request
//    */
//   const buildPayload =
//     (): CreateOrderRequest => {
//       const payload: CreateOrderRequest = {
//         userId: form.userId,
//         deliveryMethodId:
//           form.deliveryMethodId,
//         laundryLocationId:
//           form.laundryLocationId,
//         items: form.items,
//       };

//       /*
//        * Only send pickupAddress when
//        * the delivery method requires it.
//        */
//       if (
//         pickupAddressRequired &&
//         form.pickupAddress.trim()
//       ) {
//         payload.pickupAddress =
//           form.pickupAddress.trim();
//       }

//       /*
//        * Only send deliveryAddress when
//        * the delivery method requires it.
//        */
//       if (
//         deliveryAddressRequired &&
//         form.deliveryAddress.trim()
//       ) {
//         payload.deliveryAddress =
//           form.deliveryAddress.trim();
//       }

//       return payload;
//     };

//   /*
//    * Submit order
//    */
//   const submit = async () => {
//     const payload =
//       buildPayload();

//     return createOrder(
//       payload
//     ).unwrap();
//   };

//   /*
//    * Reset form
//    */
//   const reset = () => {
//     setForm(initialFormState);
//   };

//   return {
//     /*
//      * Form
//      */
//     form,

//     /*
//      * API data
//      */
//     users,
//     services,
//     deliveryMethods,
//     locations,
//     laundryItems,

//     /*
//      * Address rules
//      */
//     pickupAddressRequired,
//     deliveryAddressRequired,

//     /*
//      * Loading states
//      */
//     isLoadingUsers,
//     isLoadingServices,
//     isLoadingDeliveryMethods,
//     isLoadingLocations,
//     isLoadingItems,

//     isLoading:
//       isLoadingUsers ||
//       isLoadingServices ||
//       isLoadingDeliveryMethods ||
//       isLoadingLocations ||
//       isLoadingItems,

//     /*
//      * Create state
//      */
//     isCreating:
//       createOrderState.isLoading,

//     isCreateSuccess:
//       createOrderState.isSuccess,

//     createError:
//       createOrderState.error,

//     /*
//      * Setters
//      */
//     setUserId,
//     setServiceId,
//     setDeliveryMethodId,
//     setLaundryLocationId,
//     setPickupAddress,
//     setDeliveryAddress,

//     /*
//      * Items
//      */
//     addItem,
//     removeItem,
//     updateQuantity,

//     /*
//      * Actions
//      */
//     buildPayload,
//     submit,
//     reset,
//   };
// };

import type { FormEvent, JSX } from "react";

import type { User } from "../../../../redux/slices/usersApiSlice";
import type { DeliveryMethod } from "../../../../redux/slices/deliveryApiSlice";
import type { LaundryLocation } from "../../../../redux/slices/laundryLocationsApiSlice";
import type { LaundryItem } from "../../../../redux/slices/itemsApiSlice";
import type { LaundryService } from "../../../../redux/slices/servicesApiSlice";
import type { OrderItemRequest } from "../../../../redux/slices/ordersApiSlice";

interface CreateOrderModalProps {
  isOpen: boolean;

  isLoading: boolean;
  isSubmitting: boolean;

  users: User[];
  services: LaundryService[];
  deliveryMethods: DeliveryMethod[];
  locations: LaundryLocation[];
  laundryItems: LaundryItem[];

  userId: string;
  serviceId: number;
  deliveryMethodId: number;
  laundryLocationId: number;

  pickupAddress: string;
  deliveryAddress: string;

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

  onAddItem: (item: OrderItemRequest) => void;

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

  userId,
  serviceId,
  deliveryMethodId,
  laundryLocationId,

  pickupAddress,
  deliveryAddress,

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

  const handleAddItem = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const laundryItemId = Number(event.target.value);

    if (
      !laundryItemId ||
      items.some((item) => item.laundryItemId === laundryItemId)
    ) {
      return;
    }

    onAddItem({
      laundryItemId,
      quantity: 1,
    });

    event.target.value = "";
  };

  const getItem = (laundryItemId: number) => {
    return laundryItems.find((item) => item.id === laundryItemId);
  };

  const itemsTotal = items.reduce((total, orderItem) => {
    const item = getItem(orderItem.laundryItemId);

    return total + (item?.price ?? 0) * orderItem.quantity;
  }, 0);

  const selectedDeliveryMethod = deliveryMethods.find(
    (method) => method.id === deliveryMethodId
  );

  const deliveryFee = selectedDeliveryMethod?.price ?? 0;

  const total = itemsTotal + deliveryFee;

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
      onClick={onClose}
    >
      <div
        className="
            flex
            max-h-[90vh]
            w-full
            max-w-3xl
            flex-col
            overflow-hidden
            rounded-xl
            bg-white
            shadow-xl
          "
        onClick={(event) => event.stopPropagation()}
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
            <h2 className="text-lg font-semibold text-gray-900">
              Create Order
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a new laundry order.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
                rounded-lg
                p-2
                text-gray-400
                hover:bg-gray-100
                hover:text-gray-600
                disabled:opacity-50
              "
          >
            ×
          </button>
        </div>

        {/* Body */}

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="space-y-6 p-6">
            {/* Client */}

            <div>
              <label
                htmlFor="order-client"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Client
              </label>

              <select
                id="order-client"
                value={userId}
                onChange={(event) => onUserChange(event.target.value)}
                required
                disabled={isLoading || isSubmitting}
                className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
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

            {/* Service */}

            <div>
              <label
                htmlFor="order-service"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Service
              </label>

              <select
                id="order-service"
                value={serviceId || ""}
                onChange={(event) =>
                  onServiceChange(Number(event.target.value))
                }
                required
                disabled={isLoading || isSubmitting}
                className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
              >
                <option value="">Select service</option>

                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery + Location */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="order-delivery-method"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Delivery Method
                </label>

                <select
                  id="order-delivery-method"
                  value={deliveryMethodId || ""}
                  onChange={(event) =>
                    onDeliveryMethodChange(Number(event.target.value))
                  }
                  required
                  disabled={isLoading || isSubmitting}
                  className="
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                >
                  <option value="">Select delivery method</option>

                  {deliveryMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="order-location"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Laundry Location
                </label>

                <select
                  id="order-location"
                  value={laundryLocationId || ""}
                  onChange={(event) =>
                    onLocationChange(Number(event.target.value))
                  }
                  required
                  disabled={isLoading || isSubmitting}
                  className="
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                >
                  <option value="">Select laundry location</option>

                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pickup address */}

            {pickupAddressRequired && (
              <div>
                <label
                  htmlFor="pickup-address"
                  className="mb-2 block text-sm font-medium text-gray-700"
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
                  disabled={isSubmitting}
                  placeholder="Enter pickup address"
                  className="
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                />
              </div>
            )}

            {/* Delivery address */}

            {deliveryAddressRequired && (
              <div>
                <label
                  htmlFor="delivery-address"
                  className="mb-2 block text-sm font-medium text-gray-700"
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
                  disabled={isSubmitting}
                  placeholder="Enter delivery address"
                  className="
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                />
              </div>
            )}

            {/* Items */}

            <div>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Laundry Items
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Select items for this order.
                </p>
              </div>

              <select
                defaultValue=""
                onChange={handleAddItem}
                disabled={!serviceId || isLoading || isSubmitting}
                className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
              >
                <option value="">
                  {!serviceId
                    ? "Select a service first"
                    : "Select an item to add"}
                </option>

                {laundryItems.map((item) => {
                  const alreadyAdded = items.some(
                    (orderItem) => orderItem.laundryItemId === item.id
                  );

                  return (
                    <option
                      key={item.id}
                      value={item.id}
                      disabled={alreadyAdded}
                    >
                      {item.name} — ₦{item.price.toLocaleString()}
                    </option>
                  );
                })}
              </select>

              {/* Selected items */}

              {items.length > 0 && (
                <div className="mt-4 space-y-3">
                  {items.map((orderItem) => {
                    const item = getItem(orderItem.laundryItemId);

                    return (
                      <div
                        key={orderItem.laundryItemId}
                        className="
                              flex
                              items-center
                              gap-4
                              rounded-lg
                              border
                              border-gray-100
                              p-4
                            "
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item?.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            ₦{(item?.price ?? 0).toLocaleString()} each
                          </p>
                        </div>

                        <input
                          type="number"
                          min={1}
                          value={orderItem.quantity}
                          onChange={(event) =>
                            onQuantityChange(
                              orderItem.laundryItemId,
                              Number(event.target.value)
                            )
                          }
                          disabled={isSubmitting}
                          className="
                                w-20
                                rounded-lg
                                border
                                border-gray-200
                                px-3
                                py-2
                                text-sm
                                outline-none
                                focus:border-blue-500
                              "
                        />

                        <button
                          type="button"
                          onClick={() => onRemoveItem(orderItem.laundryItemId)}
                          disabled={isSubmitting}
                          className="
                                text-sm
                                font-medium
                                text-red-500
                                hover:text-red-700
                              "
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Total */}

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Items</span>

                <span>₦{itemsTotal.toLocaleString()}</span>
              </div>

              <div className="mt-2 flex justify-between text-sm text-gray-600">
                <span>Delivery</span>

                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>

              <div className="my-3 border-t border-gray-200" />

              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span>

                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}

          <div
            className="
                flex
                justify-end
                gap-3
                border-t
                border-gray-100
                bg-gray-50
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
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-gray-50
                  disabled:opacity-50
                "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !userId ||
                !serviceId ||
                !deliveryMethodId ||
                !laundryLocationId ||
                items.length === 0
              }
              className="
                  rounded-lg
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
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
