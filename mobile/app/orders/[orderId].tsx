import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useGetOrderByIdQuery,
  type OrderStatus,
} from "@/redux/slices/orderApiSlice";
import { formatCurrency } from "@/utils/currency";
import { formatOrderDate } from "@/utils/date";

function getStatusStyles(status: OrderStatus): {
  background: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
} {
  switch (status) {
    case "Pending":
      return {
        background: "bg-amber-100",
        text: "text-amber-700",
        icon: "time-outline",
        iconColor: "#B45309",
      };

    case "Processing":
      return {
        background: "bg-blue-100",
        text: "text-blue-700",
        icon: "sync-outline",
        iconColor: "#1D4ED8",
      };

    case "Completed":
      return {
        background: "bg-emerald-100",
        text: "text-emerald-700",
        icon: "checkmark-circle-outline",
        iconColor: "#047857",
      };

    case "Cancelled":
      return {
        background: "bg-red-100",
        text: "text-red-700",
        icon: "close-circle-outline",
        iconColor: "#B91C1C",
      };

    default:
      return {
        background: "bg-slate-100",
        text: "text-slate-700",
        icon: "ellipse-outline",
        iconColor: "#475569",
      };
  }
}

function StatusCard({
  status,
  createdAt,
}: {
  status: OrderStatus;
  createdAt: string;
}) {
  const styles = getStatusStyles(status);

  return (
    <View className="rounded-2xl bg-white p-5">
      <View className="flex-row items-center">
        <View
          className={`h-14 w-14 items-center justify-center rounded-full ${styles.background}`}
        >
          <Ionicons name={styles.icon} size={28} color={styles.iconColor} />
        </View>

        <View className="ml-4 flex-1">
          <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Current status
          </Text>

          <Text className={`mt-1 text-xl font-bold ${styles.text}`}>
            {status}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row items-center border-t border-slate-100 pt-4">
        <Ionicons name="calendar-outline" size={17} color="#64748B" />

        <Text className="ml-2 text-sm text-slate-500">
          Ordered {formatOrderDate(createdAt)}
        </Text>
      </View>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
        <Ionicons name={icon} size={19} color="#475569" />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-xs text-slate-400">{label}</Text>

        <Text className="mt-1 text-sm font-medium leading-5 text-slate-800">
          {value}
        </Text>
      </View>
    </View>
  );
}

function OrderItemRow({
  item,
}: {
  item: {
    laundryItemId: number;
    laundryItemName: string;
    laundryServiceName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  };
}) {
  return (
    <View className="border-b border-slate-100 py-4 last:border-b-0">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-sm font-bold text-slate-900">
            {item.laundryItemName}
          </Text>

          <Text className="mt-1 text-xs text-slate-500">
            {item.laundryServiceName}
          </Text>
        </View>

        <Text className="text-sm font-bold text-slate-900">
          {formatCurrency(item.totalPrice)}
        </Text>
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-xs text-slate-400">
          {item.quantity} × {formatCurrency(item.unitPrice)}
        </Text>
      </View>
    </View>
  );
}

function PriceRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between py-1.5">
      <Text
        className={`text-sm ${
          bold ? "font-bold text-slate-900" : "text-slate-500"
        }`}
      >
        {label}
      </Text>

      <Text
        className={`text-sm ${
          bold ? "font-bold text-slate-900" : "font-medium text-slate-700"
        }`}
      >
        {value}
      </Text>
    </View>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) {
  return (
    <View className="mb-4 flex-row items-center">
      <Ionicons name={icon} size={20} color="#2563EB" />

      <Text className="ml-2 text-base font-bold text-slate-900">{title}</Text>
    </View>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <Ionicons name="alert-circle-outline" size={32} color="#DC2626" />
      </View>

      <Text className="mt-5 text-xl font-bold text-slate-900">
        Unable to load order
      </Text>

      <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
        We couldn&apos;t retrieve this order right now. Please try again.
      </Text>

      <Pressable
        onPress={onRetry}
        className="mt-5 rounded-xl bg-blue-600 px-6 py-3 active:opacity-80"
      >
        <Text className="font-semibold text-white">Try again</Text>
      </Pressable>
    </View>
  );
}

export default function OrderDetailsScreen() {
  const router = useRouter();

  const { orderId } = useLocalSearchParams<{
    orderId: string;
  }>();

  const numericOrderId = Number(orderId);

  const isValidOrderId = Number.isInteger(numericOrderId) && numericOrderId > 0;

  const {
    data: order,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetOrderByIdQuery(numericOrderId, {
    skip: !isValidOrderId,
  });

  const formattedDeliveryAddress = useMemo(() => {
    if (!order?.deliveryAddress) {
      return "Not provided";
    }

    return order.deliveryAddress;
  }, [order?.deliveryAddress]);

  if (!isValidOrderId) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-slate-50">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-xl font-bold text-slate-900">
            Invalid order
          </Text>

          <Text className="mt-2 text-center text-sm text-slate-500">
            The order ID provided is not valid.
          </Text>

          <Pressable
            onPress={() => router.back()}
            className="mt-5 rounded-xl bg-blue-600 px-6 py-3"
          >
            <Text className="font-semibold text-white">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-slate-50">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />

          <Text className="mt-4 text-sm text-slate-500">Loading order...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !order) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-slate-50">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <View className="flex-row items-center px-5 py-3">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white active:opacity-70"
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </Pressable>

          <Text className="ml-3 text-lg font-bold text-slate-900">
            Order #{numericOrderId}
          </Text>
        </View>

        <ErrorState onRetry={() => void refetch()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-50">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-white active:opacity-70"
        >
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </Pressable>

        <View className="ml-3 flex-1">
          <Text className="text-lg font-bold text-slate-900">
            Order #{order.id}
          </Text>

          <Text className="text-xs text-slate-500">Order details</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 32,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => void refetch()}
            tintColor="#2563EB"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2">
          <StatusCard status={order.status} createdAt={order.createdAt} />
        </View>

        <View className="mt-4 rounded-2xl bg-white p-5">
          <SectionTitle
            icon="information-circle-outline"
            title="Order information"
          />

          <View className="gap-5">
            <InfoRow
              icon="car-outline"
              label="Delivery method"
              value={order.deliveryMethod}
            />

            <InfoRow
              icon="location-outline"
              label="Laundry location"
              value={order.laundryLocation}
            />
          </View>
        </View>

        <View className="mt-4 rounded-2xl bg-white p-5">
          <SectionTitle icon="shirt-outline" title="Laundry items" />

          {order.items.length === 0 ? (
            <Text className="text-sm text-slate-500">
              No laundry items were found for this order.
            </Text>
          ) : (
            <View>
              {order.items.map((item) => (
                <OrderItemRow
                  key={`${item.laundryItemId}-${item.laundryServiceName}`}
                  item={item}
                />
              ))}
            </View>
          )}
        </View>

        <View className="mt-4 rounded-2xl bg-white p-5">
          <SectionTitle icon="navigate-outline" title="Pickup & delivery" />

          <View className="gap-5">
            <InfoRow
              icon="arrow-up-circle-outline"
              label="Pickup address"
              value={order.pickupAddress}
            />

            <InfoRow
              icon="arrow-down-circle-outline"
              label="Delivery address"
              value={formattedDeliveryAddress}
            />
          </View>
        </View>

        <View className="mt-4 rounded-2xl bg-white p-5">
          <SectionTitle icon="receipt-outline" title="Price summary" />

          <PriceRow
            label="Items total"
            value={formatCurrency(order.itemsTotal)}
          />

          <PriceRow
            label="Delivery"
            value={formatCurrency(order.deliveryPrice)}
          />

          <View className="my-3 h-px bg-slate-100" />

          <PriceRow
            label="Grand total"
            value={formatCurrency(order.grandTotal)}
            bold
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
