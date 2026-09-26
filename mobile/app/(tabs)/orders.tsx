import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { LaundryOrder, OrderStatus } from "@/redux/slices/orderApiSlice";
import { useGetMyOrdersQuery } from "@/redux/slices/orderApiSlice";
import { formatCurrency } from "@/utils/currency";
import { formatOrderDate } from "@/utils/date";

type OrderFilter = "All" | "Pending" | "InProgress" | "Completed" | "Cancelled";

const filters: OrderFilter[] = [
  "All",
  "Pending",
  "InProgress",
  "Completed",
  "Cancelled",
];

function getStatusStyles(status: OrderStatus): {
  container: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
} {
  switch (status) {
    case "Pending":
      return {
        container: "bg-amber-100",
        text: "text-amber-700",
        icon: "time-outline",
      };

    case "Processing":
      return {
        container: "bg-blue-100",
        text: "text-blue-700",
        icon: "sync-outline",
      };

    case "Completed":
      return {
        container: "bg-emerald-100",
        text: "text-emerald-700",
        icon: "checkmark-circle-outline",
      };

    case "Cancelled":
      return {
        container: "bg-red-100",
        text: "text-red-700",
        icon: "close-circle-outline",
      };

    default:
      return {
        container: "bg-slate-100",
        text: "text-slate-700",
        icon: "ellipse-outline",
      };
  }
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles = getStatusStyles(status);

  return (
    <View
      className={`flex-row items-center rounded-full px-3 py-1.5 ${styles.container}`}
    >
      <Ionicons
        name={styles.icon}
        size={14}
        color={
          status === "Pending"
            ? "#B45309"
            : status === "Processing"
              ? "#1D4ED8"
              : status === "Completed"
                ? "#047857"
                : status === "Cancelled"
                  ? "#B91C1C"
                  : "#475569"
        }
      />

      <Text className={`ml-1.5 text-xs font-semibold ${styles.text}`}>
        {status}
      </Text>
    </View>
  );
}

function OrderCard({
  order,
  onPress,
}: {
  order: LaundryOrder;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 active:opacity-80"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-base font-bold text-slate-900">
            Order #{order.id}
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            {formatOrderDate(order.createdAt)}
          </Text>
        </View>

        <StatusBadge status={order.status} />
      </View>

      <View className="my-4 h-px bg-slate-100" />

      <View className="gap-3">
        <View className="flex-row items-center">
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
            <Ionicons name="car-outline" size={18} color="#2563EB" />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-xs text-slate-400">Delivery method</Text>

            <Text
              className="mt-0.5 text-sm font-medium text-slate-800"
              numberOfLines={1}
            >
              {order.deliveryMethod}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
            <Ionicons name="location-outline" size={18} color="#7C3AED" />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-xs text-slate-400">Laundry location</Text>

            <Text
              className="mt-0.5 text-sm font-medium text-slate-800"
              numberOfLines={1}
            >
              {order.laundryLocation}
            </Text>
          </View>
        </View>
      </View>

      <View className="my-4 h-px bg-slate-100" />

      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs text-slate-400">Order total</Text>

          <Text className="mt-1 text-lg font-bold text-slate-900">
            {formatCurrency(order.grandTotal)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className="mr-1 text-sm font-semibold text-blue-600">
            View details
          </Text>

          <Ionicons name="chevron-forward" size={18} color="#2563EB" />
        </View>
      </View>
    </Pressable>
  );
}

function LoadingState() {
  return (
    <View>
      {[1, 2, 3].map((item) => (
        <View
          key={item}
          className="mb-4 rounded-2xl border border-slate-200 bg-white p-4"
        >
          <View className="flex-row justify-between">
            <View>
              <View className="h-5 w-24 rounded-md bg-slate-200" />
              <View className="mt-2 h-3 w-28 rounded-md bg-slate-100" />
            </View>

            <View className="h-7 w-24 rounded-full bg-slate-100" />
          </View>

          <View className="my-4 h-px bg-slate-100" />

          <View className="h-10 rounded-xl bg-slate-100" />
          <View className="mt-3 h-10 rounded-xl bg-slate-100" />

          <View className="my-4 h-px bg-slate-100" />

          <View className="h-8 rounded-lg bg-slate-100" />
        </View>
      ))}
    </View>
  );
}

function EmptyState() {
  return (
    <View className="items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-50">
        <Ionicons name="shirt-outline" size={30} color="#2563EB" />
      </View>

      <Text className="mt-5 text-lg font-bold text-slate-900">
        No orders yet
      </Text>

      <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
        You haven&apos;t placed a laundry order yet. Your orders will appear
        here once you do.
      </Text>
    </View>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="items-center justify-center rounded-2xl border border-red-100 bg-white px-6 py-10">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <Ionicons name="cloud-offline-outline" size={28} color="#DC2626" />
      </View>

      <Text className="mt-4 text-lg font-bold text-slate-900">
        Unable to load orders
      </Text>

      <Text className="mt-2 text-center text-sm text-slate-500">
        Something went wrong while loading your orders.
      </Text>

      <Pressable
        onPress={onRetry}
        className="mt-5 rounded-xl bg-blue-600 px-5 py-3 active:opacity-80"
      >
        <Text className="font-semibold text-white">Try again</Text>
      </Pressable>
    </View>
  );
}

export default function OrdersScreen() {
  const router = useRouter();

  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>("All");

  const {
    data: orders = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetMyOrdersQuery();

  const filteredOrders = useMemo(() => {
    if (selectedFilter === "All") {
      return orders;
    }

    return orders.filter((order) => order.status === selectedFilter);
  }, [orders, selectedFilter]);

  const handleRefresh = async (): Promise<void> => {
    await refetch();
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 32,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={handleRefresh}
            tintColor="#2563EB"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="pb-5 pt-3">
          <Text className="text-3xl font-bold text-slate-900">My Orders</Text>

          <Text className="mt-1 text-sm text-slate-500">
            Track and manage your laundry orders
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-1 mb-5"
          contentContainerStyle={{
            paddingHorizontal: 4,
          }}
        >
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                className={`mr-2 rounded-full px-4 py-2.5 ${
                  isSelected
                    ? "bg-blue-600"
                    : "border border-slate-200 bg-white"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    isSelected ? "text-white" : "text-slate-600"
                  }`}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : filteredOrders.length === 0 ? (
          <EmptyState />
        ) : (
          <View>
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={() =>
                  router.push({
                    pathname: "/orders/[orderId]",
                    params: {
                      orderId: String(order.id),
                    },
                  })
                }
              />
            ))}
          </View>
        )}

        {isFetching && !isLoading ? (
          <View className="items-center py-3">
            <ActivityIndicator size="small" color="#2563EB" />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
