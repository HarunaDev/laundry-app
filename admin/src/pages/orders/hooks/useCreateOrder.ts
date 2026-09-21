import { useState } from "react";

import {
  useCreateOrderMutation,
  type CreateOrderRequest,
  type OrderItemRequest,
} from "../../../redux/slices/ordersApiSlice";

import { useGetUsersQuery } from "../../../redux/slices/usersApiSlice";

import { useGetDeliveryMethodsQuery } from "../../../redux/slices/deliveryApiSlice";

import { useGetLaundryLocationsQuery } from "../../../redux/slices/laundryLocationsApiSlice";

import { useGetLaundryItemsQuery } from "../../../redux/slices/itemsApiSlice";

import { useGetLaundryServicesQuery } from "../../../redux/slices/servicesApiSlice";

import {
  requiresDeliveryAddress,
  requiresPickupAddress,
} from "./orderAddressRules";

interface CreateOrderFormState {
  userId: string;
  serviceId: number;
  deliveryMethodId: number;
  laundryLocationId: number;
  pickupAddress: string;
  deliveryAddress: string;
  items: OrderItemRequest[];
}

const initialFormState: CreateOrderFormState = {
  userId: "",
  serviceId: 0,
  deliveryMethodId: 0,
  laundryLocationId: 0,
  pickupAddress: "",
  deliveryAddress: "",
  items: [],
};

export const useCreateOrder = () => {
  const [form, setForm] = useState<CreateOrderFormState>(initialFormState);

  const [createOrder, createOrderState] = useCreateOrderMutation();

  /*
   * Clients
   */
  const { data: usersResponse, isLoading: isLoadingUsers } = useGetUsersQuery({
    pageNumber: 1,
    pageSize: 100,
  });

  /*
   * Services
   */
  const { data: servicesResponse, isLoading: isLoadingServices } =
    useGetLaundryServicesQuery();

  /*
   * Delivery methods
   */
  const { data: deliveryResponse, isLoading: isLoadingDeliveryMethods } =
    useGetDeliveryMethodsQuery();

  /*
   * Laundry locations
   */
  const { data: locationsResponse, isLoading: isLoadingLocations } =
    useGetLaundryLocationsQuery();

  /*
   * Laundry items for the selected service
   */
  const { data: itemsResponse, isLoading: isLoadingItems } =
    useGetLaundryItemsQuery(form.serviceId, {
      skip: form.serviceId === 0,
    });

  /*
   * API data
   */
  const users = usersResponse?.data.users ?? [];

  const services = servicesResponse?.data ?? [];

  const deliveryMethods = deliveryResponse?.data ?? [];

  const locations = locationsResponse?.data ?? [];

  const laundryItems = itemsResponse?.data ?? [];

  /*
   * Address rules
   */
  const pickupAddressRequired = requiresPickupAddress(form.deliveryMethodId);

  const deliveryAddressRequired = requiresDeliveryAddress(
    form.deliveryMethodId
  );

  /*
   * Form setters
   */
  const setUserId = (userId: string) => {
    setForm((current) => ({
      ...current,
      userId,
    }));
  };

  const setServiceId = (serviceId: number) => {
    setForm((current) => ({
      ...current,
      serviceId,

      // Changing service removes
      // previously selected items.
      items: [],
    }));
  };

  const setDeliveryMethodId = (deliveryMethodId: number) => {
    setForm((current) => ({
      ...current,
      deliveryMethodId,

      /*
       * Remove addresses that are no
       * longer applicable.
       */
      pickupAddress: requiresPickupAddress(deliveryMethodId)
        ? current.pickupAddress
        : "",

      deliveryAddress: requiresDeliveryAddress(deliveryMethodId)
        ? current.deliveryAddress
        : "",
    }));
  };

  const setLaundryLocationId = (laundryLocationId: number) => {
    setForm((current) => ({
      ...current,
      laundryLocationId,
    }));
  };

  const setPickupAddress = (pickupAddress: string) => {
    setForm((current) => ({
      ...current,
      pickupAddress,
    }));
  };

  const setDeliveryAddress = (deliveryAddress: string) => {
    setForm((current) => ({
      ...current,
      deliveryAddress,
    }));
  };

  /*
   * Items
   */
  const addItem = (item: OrderItemRequest) => {
    setForm((current) => {
      const alreadyExists = current.items.some(
        (existingItem) => existingItem.laundryItemId === item.laundryItemId
      );

      if (alreadyExists) {
        return current;
      }

      return {
        ...current,
        items: [...current.items, item],
      };
    });
  };

  const removeItem = (laundryItemId: number) => {
    setForm((current) => ({
      ...current,

      items: current.items.filter(
        (item) => item.laundryItemId !== laundryItemId
      ),
    }));
  };

  const updateQuantity = (laundryItemId: number, quantity: number) => {
    setForm((current) => ({
      ...current,

      items: current.items.map((item) =>
        item.laundryItemId === laundryItemId
          ? {
              ...item,
              quantity: Math.max(1, quantity),
            }
          : item
      ),
    }));
  };

  /*
   * Build API request
   */
  const buildPayload = (): CreateOrderRequest => {
    const payload: CreateOrderRequest = {
      userId: form.userId,
      deliveryMethodId: form.deliveryMethodId,
      laundryLocationId: form.laundryLocationId,
      items: form.items,
    };

    /*
     * Only send pickupAddress when
     * the delivery method requires it.
     */
    if (pickupAddressRequired && form.pickupAddress.trim()) {
      payload.pickupAddress = form.pickupAddress.trim();
    }

    /*
     * Only send deliveryAddress when
     * the delivery method requires it.
     */
    if (deliveryAddressRequired && form.deliveryAddress.trim()) {
      payload.deliveryAddress = form.deliveryAddress.trim();
    }

    return payload;
  };

  /*
   * Submit order
   */
  const submit = async () => {
    const payload = buildPayload();

    return createOrder(payload).unwrap();
  };

  /*
   * Reset form
   */
  const reset = () => {
    setForm(initialFormState);
  };

  return {
    /*
     * Form
     */
    form,

    /*
     * API data
     */
    users,
    services,
    deliveryMethods,
    locations,
    laundryItems,

    /*
     * Address rules
     */
    pickupAddressRequired,
    deliveryAddressRequired,

    /*
     * Loading states
     */
    isLoadingUsers,
    isLoadingServices,
    isLoadingDeliveryMethods,
    isLoadingLocations,
    isLoadingItems,

    isLoading:
      isLoadingUsers ||
      isLoadingServices ||
      isLoadingDeliveryMethods ||
      isLoadingLocations ||
      isLoadingItems,

    /*
     * Create state
     */
    isCreating: createOrderState.isLoading,

    isCreateSuccess: createOrderState.isSuccess,

    createError: createOrderState.error,

    /*
     * Setters
     */
    setUserId,
    setServiceId,
    setDeliveryMethodId,
    setLaundryLocationId,
    setPickupAddress,
    setDeliveryAddress,

    /*
     * Items
     */
    addItem,
    removeItem,
    updateQuantity,

    /*
     * Actions
     */
    buildPayload,
    submit,
    reset,
  };
};
