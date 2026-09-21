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

const CREATE_ORDER_STORAGE_KEY = "laundryapp:create-order";

interface CreateOrderFormState {
  userId: string;
  //   serviceId: number;
  deliveryMethodId: number;
  laundryLocationId: number;
  pickupAddress: string;
  deliveryAddress: string;
  items: OrderItemRequest[];
}

interface StoredOrderItem {
  serviceId: number;
  serviceName: string;
  laundryItemId: number;
  itemName: string;
  price: number;
  quantity: number;
}

const initialFormState: CreateOrderFormState = {
  userId: "",
  //   serviceId: 0,
  deliveryMethodId: 0,
  laundryLocationId: 0,
  pickupAddress: "",
  deliveryAddress: "",
  items: [],
};

const readStoredItems = (): StoredOrderItem[] => {
  try {
    const storedItems = localStorage.getItem(CREATE_ORDER_STORAGE_KEY);

    if (!storedItems) {
      return [];
    }

    const parsedItems: unknown = JSON.parse(storedItems);

    if (!Array.isArray(parsedItems)) {
      return [];
    }

    return parsedItems as StoredOrderItem[];
  } catch {
    return [];
  }
};

const writeStoredItems = (items: StoredOrderItem[]): void => {
  localStorage.setItem(CREATE_ORDER_STORAGE_KEY, JSON.stringify(items));
};

const clearStoredItems = (): void => {
  localStorage.removeItem(CREATE_ORDER_STORAGE_KEY);
};

// interface UseCreateOrderProps {
//   isOpen: boolean;
// }

export const useCreateOrder = () => {
  const [form, setForm] = useState<CreateOrderFormState>(initialFormState);

  const [selectedServiceId, setSelectedServiceId] =
    useState(0);

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
    useGetLaundryItemsQuery(
        selectedServiceId,
    {
      skip: selectedServiceId === 0,
    }
    );

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

//   clear temporary storage
//   useEffect(() => {
//     if (!isOpen) {
//       return;
//     }

//     clearStoredItems();

//     setForm(initialFormState);

//     setSelectedServiceId(0);
//   }, [isOpen]);

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
    // setForm((current) => ({
    //   ...current,
    //   serviceId,

    //   // Changing service removes
    //   // previously selected items.
    //   items: [],
    // }));
    setSelectedServiceId(serviceId)
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
  const addItem = (laundryItemId: number) => {
    const selectedItem = laundryItems.find(
        (item) => item.id === laundryItemId
      );
  
      const selectedService = services.find(
        (service) =>
          service.id === selectedServiceId
      );
  
      if (
        !selectedItem ||
        !selectedService ||
        selectedServiceId === 0
      ) {
        return;
      }

    setForm((current) => {
      const alreadyExists = current.items.some(
        (item) => item.laundryItemId === laundryItemId
      );

      if (alreadyExists) {
        return current;
      }

      const newItem: OrderItemRequest = {
        laundryItemId,
        quantity: 1,
      };

      const updatedItems = [
        ...current.items,
        newItem,
      ];

      const storedItems =
        readStoredItems();

      const storedItem: StoredOrderItem = {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        laundryItemId: selectedItem.id,
        itemName: selectedItem.name,
        price: selectedItem.price,
        quantity: 1,
      };

      writeStoredItems([
        ...storedItems,
        storedItem,
      ]);

      return {
        ...current,
        items: updatedItems,
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

    const storedItems =
      readStoredItems();

    const updatedStoredItems =
      storedItems.filter(
        (item) =>
          item.laundryItemId !==
          laundryItemId
      );

    writeStoredItems(
      updatedStoredItems
    );
  };

  const updateQuantity = (laundryItemId: number, quantity: number) => {
    const safeQuantity =
      Math.max(1, quantity);

    setForm((current) => ({
      ...current,

      items: current.items.map((item) =>
        item.laundryItemId === laundryItemId
          ? {
              ...item,
              quantity: safeQuantity,
            }
          : item
      ),
    }));

    const storedItems =
      readStoredItems();

    const updatedStoredItems =
      storedItems.map((item) =>
        item.laundryItemId ===
        laundryItemId
          ? {
              ...item,
              quantity:
                safeQuantity,
            }
          : item
      );

    writeStoredItems(
      updatedStoredItems
    );
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
    clearStoredItems();

    setForm(initialFormState);

    setSelectedServiceId(0);
  };

  const selectedItems =
    readStoredItems();

  return {
    /*
     * Form
     */
    form,
    selectedServiceId,
    selectedItems,
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
