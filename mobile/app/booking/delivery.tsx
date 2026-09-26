import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  setDeliveryAddress,
  setDeliveryMethod,
  setLaundryLocation,
  setPickupAddress,
} from "@/redux/bookingSlice";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
  useGetDeliveryMethodsQuery,
  useGetLaundryLocationsQuery,
} from "@/redux/slices/bookingApiSlice";

import {
  requiresDeliveryAddress,
  requiresPickupAddress,
} from "@/utils/booking";

import { formatCurrency } from "@/utils/currency";

export default function BookingDeliveryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const {
    laundryLocationId,
    deliveryMethodId,
    pickupAddress,
    deliveryAddress,
  } = useAppSelector((state) => state.booking);

  const { data: locationsResponse, isLoading: isLoadingLocations } =
    useGetLaundryLocationsQuery();

  const { data: methodsResponse, isLoading: isLoadingMethods } =
    useGetDeliveryMethodsQuery();

  const locations = locationsResponse?.data ?? [];
  const methods = methodsResponse?.data ?? [];

  const pickupRequired = requiresPickupAddress(deliveryMethodId);

  const deliveryRequired = requiresDeliveryAddress(deliveryMethodId);

  const canContinue =
    laundryLocationId !== null &&
    deliveryMethodId !== null &&
    (!pickupRequired || pickupAddress.trim().length > 0) &&
    (!deliveryRequired || deliveryAddress.trim().length > 0);

  const handleContinue = (): void => {
    if (!canContinue) return;

    router.push("/booking/review");
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="pb-5 pt-3">
            <Text className="text-sm font-medium text-blue-600">
              Step 3 of 4
            </Text>

            <Text className="mt-1 text-3xl font-bold text-slate-900">
              Pickup & delivery
            </Text>

            <Text className="mt-2 text-sm leading-5 text-slate-500">
              Choose where your order will be processed and how we should
              handle it.
            </Text>
          </View>

          {/* Laundry location */}
          <View className="rounded-2xl bg-white p-5">
            <View className="mb-4 flex-row items-center">
              <Ionicons
                name="location-outline"
                size={21}
                color="#2563EB"
              />

              <Text className="ml-2 text-base font-bold text-slate-900">
                Laundry location
              </Text>
            </View>

            {isLoadingLocations ? (
              <ActivityIndicator color="#2563EB" />
            ) : (
              locations
                .filter((location) => location.isActive)
                .map((location) => {
                  const selected = laundryLocationId === location.id;

                  return (
                    <Pressable
                      key={location.id}
                      onPress={() =>
                        dispatch(setLaundryLocation(location.id))
                      }
                      className={`mb-3 rounded-xl border p-4 ${
                        selected
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200"
                      }`}
                    >
                      <View className="flex-row items-start">
                        <View className="flex-1">
                          <Text className="text-sm font-bold text-slate-900">
                            {location.name}
                          </Text>

                          <Text className="mt-1 text-xs leading-4 text-slate-500">
                            {location.address}
                          </Text>

                          <Text className="mt-1 text-xs text-slate-400">
                            {location.city}, {location.state}
                          </Text>
                        </View>

                        <View
                          className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                            selected
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300"
                          }`}
                        >
                          {selected && (
                            <Ionicons
                              name="checkmark"
                              size={15}
                              color="#FFFFFF"
                            />
                          )}
                        </View>
                      </View>
                    </Pressable>
                  );
                })
            )}
          </View>

          {/* Delivery method */}
          <View className="mt-4 rounded-2xl bg-white p-5">
            <View className="mb-4 flex-row items-center">
              <Ionicons name="car-outline" size={21} color="#2563EB" />

              <Text className="ml-2 text-base font-bold text-slate-900">
                Delivery method
              </Text>
            </View>

            {isLoadingMethods ? (
              <ActivityIndicator color="#2563EB" />
            ) : (
              methods
                .filter((method) => method.isActive)
                .map((method) => {
                  const selected = deliveryMethodId === method.id;

                  return (
                    <Pressable
                      key={method.id}
                      onPress={() =>
                        dispatch(setDeliveryMethod(method.id))
                      }
                      className={`mb-3 rounded-xl border p-4 ${
                        selected
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200"
                      }`}
                    >
                      <View className="flex-row items-start">
                        <View className="flex-1 pr-3">
                          <View className="flex-row items-center justify-between">
                            <Text className="flex-1 text-sm font-bold text-slate-900">
                              {method.name}
                            </Text>

                            <Text className="ml-2 text-sm font-bold text-blue-600">
                              {method.price === 0
                                ? "Free"
                                : formatCurrency(method.price)}
                            </Text>
                          </View>

                          <Text className="mt-2 text-xs leading-4 text-slate-500">
                            {method.description}
                          </Text>
                        </View>

                        <View
                          className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                            selected
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300"
                          }`}
                        >
                          {selected && (
                            <Ionicons
                              name="checkmark"
                              size={15}
                              color="#FFFFFF"
                            />
                          )}
                        </View>
                      </View>
                    </Pressable>
                  );
                })
            )}
          </View>

          {/* Pickup address */}
          {pickupRequired && (
            <View className="mt-4 rounded-2xl bg-white p-5">
              <Text className="text-base font-bold text-slate-900">
                Pickup address
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Where should we collect your laundry?
              </Text>

              <TextInput
                value={pickupAddress}
                onChangeText={(value) =>
                  dispatch(setPickupAddress(value))
                }
                placeholder="Enter pickup address"
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                className="mt-4 min-h-28 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              />
            </View>
          )}

          {/* Delivery address */}
          {deliveryRequired && (
            <View className="mt-4 rounded-2xl bg-white p-5">
              <Text className="text-base font-bold text-slate-900">
                Delivery address
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Where should we deliver your laundry?
              </Text>

              <TextInput
                value={deliveryAddress}
                onChangeText={(value) =>
                  dispatch(setDeliveryAddress(value))
                }
                placeholder="Enter delivery address"
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                className="mt-4 min-h-28 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              />
            </View>
          )}
        </ScrollView>

        {/* Fixed bottom action */}
        <View
          className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-slate-50 px-5 pt-4"
          style={{
            paddingBottom: insets.bottom + 16,
          }}
        >
          <Pressable
            disabled={!canContinue}
            onPress={handleContinue}
            className={`items-center rounded-2xl py-4 ${
              canContinue ? "bg-blue-600" : "bg-slate-200"
            }`}
          >
            <Text
              className={`text-base font-bold ${
                canContinue ? "text-white" : "text-slate-400"
              }`}
            >
              Review order
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}