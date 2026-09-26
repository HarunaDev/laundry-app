import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
//   SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { useGetLaundryItemsByServiceQuery, useGetLaundryServicesQuery } from "@/redux/slices/serviceApiSlice";
// import {  } from "@/redux/slices/userApiSlice";
import {
  addItem,
  decreaseItemQuantity,
  increaseItemQuantity,
} from "@/redux/bookingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { formatCurrency } from "@/utils/currency";
import { useSafeAreaInsets, SafeAreaView} from "react-native-safe-area-context";

export default function BookingItemsScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const { selectedServiceIds, selectedItems } = useAppSelector(
    (state) => state.booking
  );

  const [activeServiceId, setActiveServiceId] = useState<number | null>(
    selectedServiceIds[0] ?? null
  );

  const { data: servicesResponse, isLoading: servicesLoading } =
    useGetLaundryServicesQuery();

  const {
    data: itemsResponse,
    isLoading: itemsLoading,
    isFetching,
    isError,
  } = useGetLaundryItemsByServiceQuery(activeServiceId as number, {
    skip: activeServiceId === null,
  });

  const services = servicesResponse?.data ?? [];
  const items = itemsResponse?.data ?? [];

  const getQuantity = (itemId: number): number => {
    return (
      selectedItems.find((item) => item.laundryItemId === itemId)?.quantity ?? 0
    );
  };

  const handleIncrease = (
    itemId: number,
    name: string,
    price: number,
    serviceId: number,
    serviceName: string
  ) => {
    const existingItem = selectedItems.find(
      (item) => item.laundryItemId === itemId
    );

    if (!existingItem) {
      dispatch(
        addItem({
          laundryItemId: itemId,
          laundryItemName: name,
          laundryServiceId: serviceId,
          laundryServiceName: serviceName,
          unitPrice: price,
          quantity: 1,
        })
      );

      return;
    }

    dispatch(increaseItemQuantity(itemId));
  };

  const handleDecrease = (itemId: number) => {
    dispatch(decreaseItemQuantity(itemId));
  };

  const canContinue = selectedItems.length > 0;

  if (servicesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold text-slate-900">
            Select your items
          </Text>

          <Text className="mt-2 text-sm leading-5 text-slate-500">
            Choose the items you want us to process and set the quantity for
            each item.
          </Text>

          {/* Service selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-6"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View className="flex-row gap-3">
              {selectedServiceIds.map((serviceId) => {
                const service = services.find((item) => item.id === serviceId);

                const isActive = activeServiceId === serviceId;

                return (
                  <Pressable
                    key={serviceId}
                    onPress={() => setActiveServiceId(serviceId)}
                    className={`rounded-full px-5 py-3 ${
                      isActive ? "bg-blue-600" : "bg-white"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        isActive ? "text-white" : "text-slate-700"
                      }`}
                    >
                      {service?.name ?? `Service ${serviceId}`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Items */}
          <View className="mt-6">
            {itemsLoading || isFetching ? (
              <View className="items-center py-10">
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : isError ? (
              <View className="rounded-2xl bg-white p-5">
                <Text className="text-center text-sm text-red-500">
                  Unable to load items for this service.
                </Text>
              </View>
            ) : items.length === 0 ? (
              <View className="rounded-2xl bg-white p-6">
                <Text className="text-center font-semibold text-slate-800">
                  No items available
                </Text>

                <Text className="mt-2 text-center text-sm text-slate-500">
                  There are currently no laundry items for this service.
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {items.map((item) => {
                  const quantity = getQuantity(item.id);

                  return (
                    <View
                      key={item.id}
                      className="flex-row items-center justify-between rounded-2xl bg-white p-4"
                    >
                      <View className="flex-1 pr-4">
                        <Text className="text-base font-semibold text-slate-900">
                          {item.name}
                        </Text>

                        <Text className="mt-1 text-sm text-slate-500">
                          {formatCurrency(item.price)} per item
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <Pressable
                          onPress={() => handleDecrease(item.id)}
                          disabled={quantity === 0}
                          className={`h-10 w-10 items-center justify-center rounded-full ${
                            quantity === 0 ? "bg-slate-100" : "bg-slate-200"
                          }`}
                        >
                          <Text
                            className={`text-xl font-semibold ${
                              quantity === 0
                                ? "text-slate-300"
                                : "text-slate-800"
                            }`}
                          >
                            −
                          </Text>
                        </Pressable>

                        <Text className="mx-4 min-w-5 text-center text-base font-bold text-slate-900">
                          {quantity}
                        </Text>

                        <Pressable
                          onPress={() =>
                            handleIncrease(
                              item.id,
                              item.name,
                              item.price,
                              item.laundryServiceId,
                              item.laundryServiceName
                            )
                          }
                          className="h-10 w-10 items-center justify-center rounded-full bg-blue-600"
                        >
                          <Text className="text-xl font-semibold text-white">
                            +
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {selectedItems.length > 0 && (
            <View className="mt-6 rounded-2xl bg-blue-50 p-4">
              <Text className="font-semibold text-blue-900">
                {selectedItems.length} item type
                {selectedItems.length === 1 ? "" : "s"} selected
              </Text>

              <Text className="mt-1 text-sm text-blue-700">
                {selectedItems.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}{" "}
                item
                {selectedItems.reduce(
                  (total, item) => total + item.quantity,
                  0
                ) === 1
                  ? ""
                  : "s"}{" "}
                in total
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom action */}
        <View className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-slate-50 px-5 pt-4" style={{
            paddingBottom: insets.bottom + 16,
          }}>
          <Pressable
            disabled={!canContinue}
            onPress={() => router.push("/booking/delivery")}
            className={`items-center rounded-2xl py-4 ${
              canContinue ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <Text
              className={`text-base font-bold ${
                canContinue ? "text-white" : "text-slate-500"
              }`}
            >
              Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
