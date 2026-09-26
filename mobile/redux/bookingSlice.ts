import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BookingItem {
  laundryItemId: number;
  laundryItemName: string;
  laundryServiceId: number;
  laundryServiceName: string;
  unitPrice: number;
  quantity: number;
}

export interface BookingState {
  selectedServiceIds: number[];
  selectedItems: BookingItem[];
  laundryLocationId: number | null;
  deliveryMethodId: number | null;
  pickupAddress: string;
  deliveryAddress: string;
}

const initialState: BookingState = {
  selectedServiceIds: [],
  selectedItems: [],
  laundryLocationId: null,
  deliveryMethodId: null,
  pickupAddress: "",
  deliveryAddress: "",
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    toggleService(
      state,
      action: PayloadAction<number>
    ) {
      const serviceId = action.payload;

      if (state.selectedServiceIds.includes(serviceId)) {
        state.selectedServiceIds =
          state.selectedServiceIds.filter(
            (id) => id !== serviceId
          );
      } else {
        state.selectedServiceIds.push(serviceId);
      }
    },

    setSelectedServices(
      state,
      action: PayloadAction<number[]>
    ) {
      state.selectedServiceIds = action.payload;
    },

    addItem(
      state,
      action: PayloadAction<BookingItem>
    ) {
      const existingItem = state.selectedItems.find(
        (item) =>
          item.laundryItemId ===
          action.payload.laundryItemId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        return;
      }

      state.selectedItems.push(action.payload);
    },

    setItemQuantity(
      state,
      action: PayloadAction<{
        laundryItemId: number;
        quantity: number;
      }>
    ) {
      const item = state.selectedItems.find(
        (selectedItem) =>
          selectedItem.laundryItemId ===
          action.payload.laundryItemId
      );

      if (!item) return;

      if (action.payload.quantity <= 0) {
        state.selectedItems =
          state.selectedItems.filter(
            (selectedItem) =>
              selectedItem.laundryItemId !==
              action.payload.laundryItemId
          );

        return;
      }

      item.quantity = action.payload.quantity;
    },

    increaseItemQuantity(
      state,
      action: PayloadAction<number>
    ) {
      const item = state.selectedItems.find(
        (selectedItem) =>
          selectedItem.laundryItemId === action.payload
      );

      if (item) {
        item.quantity += 1;
      }
    },

    decreaseItemQuantity(
      state,
      action: PayloadAction<number>
    ) {
      const item = state.selectedItems.find(
        (selectedItem) =>
          selectedItem.laundryItemId === action.payload
      );

      if (!item) return;

      if (item.quantity <= 1) {
        state.selectedItems =
          state.selectedItems.filter(
            (selectedItem) =>
              selectedItem.laundryItemId !==
              action.payload
          );

        return;
      }

      item.quantity -= 1;
    },

    removeItem(
      state,
      action: PayloadAction<number>
    ) {
      state.selectedItems =
        state.selectedItems.filter(
          (item) =>
            item.laundryItemId !== action.payload
        );
    },

    setLaundryLocation(
      state,
      action: PayloadAction<number>
    ) {
      state.laundryLocationId = action.payload;
    },

    setDeliveryMethod(
      state,
      action: PayloadAction<number>
    ) {
      state.deliveryMethodId = action.payload;
    },

    setPickupAddress(
      state,
      action: PayloadAction<string>
    ) {
      state.pickupAddress = action.payload;
    },

    setDeliveryAddress(
      state,
      action: PayloadAction<string>
    ) {
      state.deliveryAddress = action.payload;
    },

    resetBooking() {
      return initialState;
    },
  },
});

export const {
  toggleService,
  setSelectedServices,
  addItem,
  setItemQuantity,
  increaseItemQuantity,
  decreaseItemQuantity,
  removeItem,
  setLaundryLocation,
  setDeliveryMethod,
  setPickupAddress,
  setDeliveryAddress,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;