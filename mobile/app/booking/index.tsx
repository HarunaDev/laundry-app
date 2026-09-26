import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
// import {  } from "react-native-safe-area-context";
import { useGetLaundryServicesQuery } from "@/redux/slices/serviceApiSlice";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { toggleService } from "@/redux/bookingSlice";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function BookingServicesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const selectedServiceIds = useAppSelector(
    (state) => state.booking.selectedServiceIds
  );

  const { data, isLoading, isError, refetch } = useGetLaundryServicesQuery();

  const services = data?.data ?? [];

//   const handleContinue = (): void => {
//     if (selectedServiceIds.length === 0) {
//       return;
//     }

//     router.push("/booking/items");
//   };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-50">
      <View className="flex-1">
        <View className="px-5 pb-4 pt-3">
          <Text className="text-sm font-medium text-blue-600">Step 1 of 4</Text>

          <Text className="mt-1 text-3xl font-bold text-slate-900">
            What do you need?
          </Text>

          <Text className="mt-2 text-sm leading-5 text-slate-500">
            Select one or more laundry services for your order.
          </Text>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="cloud-offline-outline" size={42} color="#DC2626" />

            <Text className="mt-4 text-lg font-bold text-slate-900">
              Unable to load services
            </Text>

            <Pressable
              onPress={() => void refetch()}
              className="mt-5 rounded-xl bg-blue-600 px-6 py-3"
            >
              <Text className="font-semibold text-white">Try again</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
          >
            {services
              .filter((service) => service.isActive)
              .map((service) => {
                const selected = selectedServiceIds.includes(service.id);

                return (
                  <Pressable
                    key={service.id}
                    onPress={() => dispatch(toggleService(service.id))}
                    className={`mb-4 rounded-2xl border p-5 ${
                      selected
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <View className="flex-row items-start">
                      <View
                        className={`h-12 w-12 items-center justify-center rounded-xl ${
                          selected ? "bg-blue-600" : "bg-slate-100"
                        }`}
                      >
                        <Ionicons
                          name="shirt-outline"
                          size={24}
                          color={selected ? "#FFFFFF" : "#475569"}
                        />
                      </View>

                      <View className="ml-4 flex-1">
                        <View className="flex-row items-center justify-between">
                          <Text className="flex-1 text-base font-bold text-slate-900">
                            {service.name}
                          </Text>

                          <View
                            className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                              selected
                                ? "border-blue-600 bg-blue-600"
                                : "border-slate-300 bg-white"
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

                        <Text className="mt-2 text-sm leading-5 text-slate-500">
                          {service.description}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
          </ScrollView>
        )}

        <View
          className="border-t border-slate-200 bg-slate-50 px-5 pt-4"
          style={{
            paddingBottom: insets.bottom + 16,
          }}
        >
          <Pressable
            disabled={selectedServiceIds.length === 0}
            onPress={() => router.push("/booking/items")}
            className={`items-center rounded-2xl py-4 ${
              selectedServiceIds.length > 0 ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <Text
              className={`text-base font-bold ${
                selectedServiceIds.length > 0 ? "text-white" : "text-slate-500"
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
