import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAppSelector } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/slices/authApiSlice";
import {
  useGetCurrentUserQuery,
} from "@/redux/slices/userApiSlice";
import { useGetLaundryServicesQuery } from "@/redux/slices/serviceApiSlice";

export default function HomeScreen() {
  const router = useRouter();

  const authUser = useAppSelector((state) => state.app.user);

  const {
    data: userResponse,
    isLoading: isUserLoading,
    isError: isUserError,
    refetch: refetchUser,
  } = useGetCurrentUserQuery();

  const {
    data: servicesResponse,
    isLoading: isServicesLoading,
    isError: isServicesError,
    refetch: refetchServices,
  } = useGetLaundryServicesQuery();

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const user = userResponse?.data;
  const services = servicesResponse?.data ?? [];

  const isLoading = isUserLoading || isServicesLoading;
  const isRefreshing =
    isUserLoading ||
    isServicesLoading;

  const hasError = isUserError || isServicesError;

  const handleRefresh = async (): Promise<void> => {
    await Promise.all([
      refetchUser(),
      refetchServices(),
    ]);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout().unwrap();
    } catch {
      // The logout mutation clears local authentication
      // state in its finally block.
    } finally {
      router.replace("/(auth)/signin");
    }
  };

  const displayName =
    user?.userName?.trim() ||
    authUser?.userId ||
    "there";

  if (isLoading && !user) {
    return (
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top"]}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />

          <Text className="mt-4 text-sm text-slate-500">
            Loading your dashboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasError && !user) {
    return (
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top"]}
      >
        <View className="flex-1 items-center justify-center px-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Ionicons
              name="cloud-offline-outline"
              size={30}
              color="#DC2626"
            />
          </View>

          <Text className="mt-5 text-xl font-bold text-slate-900">
            Something went wrong
          </Text>

          <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
            We couldn&apos;t load your dashboard. Please check your
            connection and try again.
          </Text>

          <Pressable
            onPress={() => {
              void handleRefresh();
            }}
            className="mt-6 h-12 items-center justify-center rounded-xl bg-blue-600 px-8 active:bg-blue-700"
          >
            <Text className="font-semibold text-white">
              Try again
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50"
      edges={["top"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              void handleRefresh();
            }}
            tintColor="#2563EB"
          />
        }
      >
        {/* Header */}
        <View className="px-5 pb-5 pt-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-sm text-slate-500">
                Welcome back
              </Text>

              <Text
                className="mt-1 text-2xl font-bold text-slate-900"
                numberOfLines={1}
              >
                {displayName} 👋
              </Text>
            </View>

            <Pressable
              onPress={() => {
                void handleLogout();
              }}
              disabled={isLoggingOut}
              className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
            >
              {isLoggingOut ? (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                />
              ) : (
                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color="#475569"
                />
              )}
            </Pressable>
          </View>
        </View>

        {/* Account summary */}
        <View className="px-5">
          <View className="overflow-hidden rounded-3xl bg-blue-600 p-5">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-sm font-medium text-blue-100">
                  LaundryApp
                </Text>

                <Text className="mt-2 text-2xl font-bold text-white">
                  Clean clothes,
                  {"\n"}
                  less hassle.
                </Text>

                <Text className="mt-3 text-sm leading-5 text-blue-100">
                  Let us take care of your laundry while you
                  focus on what matters.
                </Text>
              </View>

              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Ionicons
                  name="shirt-outline"
                  size={30}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <View className="mt-5 flex-row items-center">
              <View className="mr-3 flex-1 rounded-2xl bg-white/10 p-3">
                <Text className="text-xs text-blue-100">
                  Total orders
                </Text>

                <Text className="mt-1 text-xl font-bold text-white">
                  {user?.totalOrders ?? 0}
                </Text>
              </View>

              <View className="flex-1 rounded-2xl bg-white/10 p-3">
                <Text className="text-xs text-blue-100">
                  Account status
                </Text>

                <Text className="mt-1 text-xl font-bold text-white">
                  {user?.status ?? "Active"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <View className="mt-7 px-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-900">
              Quick actions
            </Text>
          </View>

          <View className="flex-row">
            <Pressable
              onPress={() => {
                // Booking flow will be connected when its
                // backend contract is ready.
              }}
              className="mr-3 flex-1 rounded-2xl bg-white p-4 shadow-sm active:bg-slate-100"
            >
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color="#2563EB"
                />
              </View>

              <Text className="mt-3 font-semibold text-slate-900">
                Book a pickup
              </Text>

              <Text className="mt-1 text-xs leading-4 text-slate-500">
                Schedule a laundry service
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                router.push("/");
              }}
              className="flex-1 rounded-2xl bg-white p-4 shadow-sm active:bg-slate-100"
            >
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
                <Ionicons
                  name="receipt-outline"
                  size={24}
                  color="#7C3AED"
                />
              </View>

              <Text className="mt-3 font-semibold text-slate-900">
                My orders
              </Text>

              <Text className="mt-1 text-xs leading-4 text-slate-500">
                View your laundry orders
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Services */}
        <View className="mt-7 px-5">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-slate-900">
                Our services
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Choose a service for your laundry
              </Text>
            </View>

            <View className="rounded-full bg-blue-50 px-3 py-1.5">
              <Text className="text-xs font-semibold text-blue-600">
                {services.length} available
              </Text>
            </View>
          </View>

          {services.length === 0 ? (
            <View className="items-center rounded-2xl bg-white px-5 py-8">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Ionicons
                  name="shirt-outline"
                  size={26}
                  color="#64748B"
                />
              </View>

              <Text className="mt-4 font-semibold text-slate-900">
                No services available
              </Text>

              <Text className="mt-1 text-center text-sm text-slate-500">
                There are currently no active laundry services.
              </Text>
            </View>
          ) : (
            <View>
              {services
                .filter((service) => service.isActive)
                .map((service) => (
                  <Pressable
                    key={service.id}
                    onPress={() => {
                      // Service selection will be connected to
                      // the booking flow when that module begins.
                    }}
                    className="mb-3 flex-row items-center rounded-2xl bg-white p-4 shadow-sm active:bg-slate-100"
                  >
                    <View className="h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                      <Ionicons
                        name="shirt-outline"
                        size={27}
                        color="#2563EB"
                      />
                    </View>

                    <View className="ml-4 flex-1">
                      <Text
                        className="font-semibold text-slate-900"
                        numberOfLines={1}
                      >
                        {service.name}
                      </Text>

                      <Text
                        className="mt-1 text-sm leading-5 text-slate-500"
                        numberOfLines={2}
                      >
                        {service.description ||
                          "Professional laundry service for your clothes."}
                      </Text>
                    </View>

                    <View className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-slate-50">
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#64748B"
                      />
                    </View>
                  </Pressable>
                ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}