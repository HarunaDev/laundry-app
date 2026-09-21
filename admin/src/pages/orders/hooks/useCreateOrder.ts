import { useMemo, useState } from "react";

import {
  useCreateOrderMutation,
  type CreateOrderRequest,
  type OrderItemRequest,
} from "../../../redux/slices/ordersApiSlice";

import { useGetUsersQuery } from "../../../redux/slices/usersApiSlice";

import { useGetDeliveryMethodsQuery } from "../../../redux/slices/deliveryApiSlice";

import { useGetLaundryLocationsQuery } from "../../../redux/slices/laundryLocationsApiSlice";

import { useGetLaundryItemsQuery } from "../../../redux/slices/itemsApiSlice";

import {
  requiresDeliveryAddress,
  requiresPickupAddress,
} from "./orderAddressRules";

interface CreateOrderFormState {
  userId: string;
  deliveryMethodId: number;
  laundryLocationId: number;
  pickupAddress: string;
  deliveryAddress: string;
  items: OrderItemRequest[];
}

const initialFormState: CreateOrderFormState = {
  userId: "",
  deliveryMethodId: 0,
  laundryLocationId: 0,
  pickupAddress: "",
  deliveryAddress: "",
  items: [],
};

export const useCreateOrder = () => {
  const [form, setForm] = useState<CreateOrderFormState>(initialFormState);

  const [createOrder, createOrderState] = useCreateOrderMutation();

  const { data: usersResponse, isLoading: isLoadingUsers } = useGetUsersQuery({
    pageNumber: 1,
    pageSize: 100,
  });

  const { data: deliveryResponse, isLoading: isLoadingDeliveryMethods } =
    useGetDeliveryMethodsQuery();

  const { data: locationsResponse, isLoading: isLoadingLocations } =
    useGetLaundryLocationsQuery();

  const selectedServiceId = useMemo(() => {
    return form.items.length > 0 ? undefined : undefined;
  }, [form.items]);

  const { data: itemsResponse, isLoading: isLoadingItems } =
    useGetLaundryItemsQuery(selectedServiceId ?? 0, {
      skip: selectedServiceId === undefined,
    });

  const users = usersResponse?.data.users ?? [];
  const deliveryMethods = deliveryResponse?.data ?? [];
  const locations = locationsResponse?.data ?? [];
  const laundryItems = itemsResponse?.data ?? [];

  const pickupAddressRequired = requiresPickupAddress(form.deliveryMethodId);

  const deliveryAddressRequired = requiresDeliveryAddress(
    form.deliveryMethodId
  );

  const setField = <K extends keyof CreateOrderFormState>(
    field: K,
    value: CreateOrderFormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const setDeliveryMethod = (deliveryMethodId: number) => {
    setForm((current) => ({
      ...current,
      deliveryMethodId,
      pickupAddress: requiresPickupAddress(deliveryMethodId)
        ? current.pickupAddress
        : "",
      deliveryAddress: requiresDeliveryAddress(deliveryMethodId)
        ? current.deliveryAddress
        : "",
    }));
  };

  const setItems = (items: OrderItemRequest[]) => {
    setForm((current) => ({
      ...current,
      items,
    }));
  };

  const buildPayload = (): CreateOrderRequest => {
    const payload: CreateOrderRequest = {
      userId: form.userId,
      deliveryMethodId: form.deliveryMethodId,
      laundryLocationId: form.laundryLocationId,
      items: form.items,
    };

    if (pickupAddressRequired && form.pickupAddress.trim()) {
      payload.pickupAddress = form.pickupAddress.trim();
    }

    if (deliveryAddressRequired && form.deliveryAddress.trim()) {
      payload.deliveryAddress = form.deliveryAddress.trim();
    }

    return payload;
  };

  const submit = async () => {
    const payload = buildPayload();

    return createOrder(payload).unwrap();
  };

  const reset = () => {
    setForm(initialFormState);
  };

  return {
    form,

    users,
    deliveryMethods,
    locations,
    laundryItems,

    pickupAddressRequired,
    deliveryAddressRequired,

    isLoadingUsers,
    isLoadingDeliveryMethods,
    isLoadingLocations,
    isLoadingItems,

    isLoading:
      isLoadingUsers ||
      isLoadingDeliveryMethods ||
      isLoadingLocations ||
      isLoadingItems,

    isCreating: createOrderState.isLoading,
    isCreateSuccess: createOrderState.isSuccess,
    createError: createOrderState.error,

    setField,
    setDeliveryMethod,
    setItems,

    buildPayload,
    submit,
    reset,
  };
};
