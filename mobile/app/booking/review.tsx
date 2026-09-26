import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { resetBooking } from "@/redux/bookingSlice";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
  useCreateLaundryOrderMutation,
  useGetDeliveryMethodsQuery,
  useGetLaundryLocationsQuery,
} from "@/redux/slices/bookingApiSlice";

import { useGetLaundryServicesQuery } from "@/redux/slices/serviceApiSlice";

import { formatCurrency } from "@/utils/currency";

export default function BookingReviewScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const {
    selectedServiceIds,
    selectedItems,
    laundryLocationId,
    deliveryMethodId,
    pickupAddress,
    deliveryAddress,
  } = useAppSelector((state) => state.booking);

  const { data: servicesResponse } = useGetLaundryServicesQuery();

  const { data: locationsResponse } = useGetLaundryLocationsQuery();

  const { data: methodsResponse } = useGetDeliveryMethodsQuery();

  const [createLaundryOrder, { isLoading: isCreatingOrder }] =
    useCreateLaundryOrderMutation();

  const services = servicesResponse?.data ?? [];

  const locations = locationsResponse?.data ?? [];

  const methods = methodsResponse?.data ?? [];

  const selectedLocation = locations.find(
    (location) => location.id === laundryLocationId
  );

  const selectedMethod = methods.find(
    (method) => method.id === deliveryMethodId
  );

  const selectedServiceNames = services
    .filter((service) => selectedServiceIds.includes(service.id))
    .map((service) => service.name);

  const itemsTotal = selectedItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  const deliveryPrice = selectedMethod?.price ?? 0;

  const estimatedTotal = itemsTotal + deliveryPrice;

  const handleCreateOrder = async (): Promise<void> => {
    if (
      laundryLocationId === null ||
      deliveryMethodId === null ||
      selectedItems.length === 0
    ) {
      Alert.alert(
        "Incomplete order",
        "Please complete all required booking information."
      );

      return;
    }

    const payload = {
      deliveryMethodId,
      laundryLocationId,
      ...(pickupAddress.trim()
        ? {
            pickupAddress: pickupAddress.trim(),
          }
        : {}),
      ...(deliveryAddress.trim()
        ? {
            deliveryAddress: deliveryAddress.trim(),
          }
        : {}),
      items: selectedItems.map((item) => ({
        laundryItemId: item.laundryItemId,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await createLaundryOrder(payload).unwrap();

      dispatch(resetBooking());

      Alert.alert(
        "Order placed",
        response.message || "Your laundry order has been created successfully.",
        [
          {
            text: "View orders",
            onPress: () => router.replace("/(tabs)/orders"),
          },
        ]
      );
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "We couldn't create your order. Please try again.";

      Alert.alert("Unable to place order", message);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-50">
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="pb-5 pt-3">
            <Text className="text-sm font-medium text-blue-600">
              Step 4 of 4
            </Text>

            <Text className="mt-1 text-3xl font-bold text-slate-900">
              Review your order
            </Text>

            <Text className="mt-2 text-sm text-slate-500">
              Check everything before placing your order.
            </Text>
          </View>

          <View className="rounded-2xl bg-white p-5">
            <View className="mb-4 flex-row items-center">
              <Ionicons name="shirt-outline" size={21} color="#2563EB" />

              <Text className="ml-2 text-base font-bold text-slate-900">
                Services
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {selectedServiceNames.map((name) => (
                <View key={name} className="rounded-full bg-blue-50 px-3 py-2">
                  <Text className="text-xs font-semibold text-blue-700">
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-4 rounded-2xl bg-white p-5">
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="cart-outline" size={21} color="#2563EB" />

                <Text className="ml-2 text-base font-bold text-slate-900">
                  Items
                </Text>
              </View>

              <Text className="text-sm font-semibold text-slate-500">
                {selectedItems.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}{" "}
                items
              </Text>
            </View>

            {selectedItems.map((item) => (
              <View
                key={item.laundryItemId}
                className="flex-row items-center justify-between border-b border-slate-100 py-3 last:border-b-0"
              >
                <View className="flex-1 pr-4">
                  <Text className="text-sm font-semibold text-slate-900">
                    {item.laundryItemName}
                  </Text>

                  <Text className="mt-1 text-xs text-slate-500">
                    {item.laundryServiceName} · {item.quantity} ×{" "}
                    {formatCurrency(item.unitPrice)}
                  </Text>
                </View>

                <Text className="text-sm font-bold text-slate-900">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-4 rounded-2xl bg-white p-5">
            <View className="mb-4 flex-row items-center">
              <Ionicons name="location-outline" size={21} color="#2563EB" />

              <Text className="ml-2 text-base font-bold text-slate-900">
                Laundry location
              </Text>
            </View>

            <Text className="text-sm font-bold text-slate-900">
              {selectedLocation?.name ?? "Not selected"}
            </Text>

            <Text className="mt-1 text-sm leading-5 text-slate-500">
              {selectedLocation?.address ?? ""}
            </Text>
          </View>

          <View className="mt-4 rounded-2xl bg-white p-5">
            <View className="mb-4 flex-row items-center">
              <Ionicons name="car-outline" size={21} color="#2563EB" />

              <Text className="ml-2 text-base font-bold text-slate-900">
                Delivery
              </Text>
            </View>

            <Text className="text-sm font-bold text-slate-900">
              {selectedMethod?.name ?? "Not selected"}
            </Text>

            {pickupAddress.trim() ? (
              <View className="mt-4">
                <Text className="text-xs text-slate-400">Pickup address</Text>

                <Text className="mt-1 text-sm leading-5 text-slate-700">
                  {pickupAddress}
                </Text>
              </View>
            ) : null}

            {deliveryAddress.trim() ? (
              <View className="mt-4">
                <Text className="text-xs text-slate-400">Delivery address</Text>

                <Text className="mt-1 text-sm leading-5 text-slate-700">
                  {deliveryAddress}
                </Text>
              </View>
            ) : null}
          </View>

          <View className="mt-4 rounded-2xl bg-white p-5">
            <View className="mb-4 flex-row items-center">
              <Ionicons name="receipt-outline" size={21} color="#2563EB" />

              <Text className="ml-2 text-base font-bold text-slate-900">
                Price summary
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-slate-500">Items</Text>

              <Text className="text-sm font-medium text-slate-800">
                {formatCurrency(itemsTotal)}
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-slate-500">Delivery</Text>

              <Text className="text-sm font-medium text-slate-800">
                {formatCurrency(deliveryPrice)}
              </Text>
            </View>

            <View className="my-3 h-px bg-slate-100" />

            <View className="flex-row justify-between">
              <Text className="text-base font-bold text-slate-900">
                Estimated total
              </Text>

              <Text className="text-xl font-bold text-blue-600">
                {formatCurrency(estimatedTotal)}
              </Text>
            </View>
          </View>

          <View
            className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-slate-50 px-5 pt-4"
            style={{
              paddingBottom: insets.bottom + 16,
            }}
          >
            <Pressable
              disabled={isCreatingOrder}
              onPress={() => void handleCreateOrder()}
              className={`items-center rounded-2xl py-4 ${
                isCreatingOrder ? "bg-blue-400" : "bg-blue-600"
              }`}
            >
              {isCreatingOrder ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#FFFFFF" />

                  <Text className="ml-2 text-base font-bold text-white">
                    Placing order...
                  </Text>
                </View>
              ) : (
                <Text className="text-base font-bold text-white">
                  Place order
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
