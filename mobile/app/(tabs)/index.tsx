import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { useAppSelector } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/slices/authApiSlice";

export default function HomeScreen() {
  const router = useRouter();

  const user = useAppSelector((state) => state.app.user);

  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout().unwrap();
    } catch {
      // The logout mutation clears local auth state in finally,
      // even if the server request fails.
    } finally {
      router.replace("/(auth)/signin");
    }
  };

  const confirmLogout = (): void => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out of your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log out",
          style: "destructive",
          onPress: () => {
            void handleLogout();
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#0F172A] px-6">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-16">
        <View>
          <Text className="text-sm text-gray-400">
            LaundryApp
          </Text>

          <Text className="text-2xl font-bold text-white">
            Dashboard
          </Text>
        </View>

        <Pressable
          onPress={confirmLogout}
          disabled={isLoading}
          className={`h-11 rounded-xl border border-red-500/40 bg-red-500/10 px-4 items-center justify-center ${
            isLoading ? "opacity-50" : "active:bg-red-500/20"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color="#F87171"
            />
          ) : (
            <Text className="font-semibold text-red-400">
              Log out
            </Text>
          )}
        </Pressable>
      </View>

      {/* Welcome section */}
      <View className="flex-1 justify-center items-center">
        <View className="w-full rounded-3xl bg-[#1E293B] p-6">
          <Text className="text-3xl font-bold text-white mb-3">
            Welcome to the Laundry App
          </Text>

          <Text className="text-gray-400 mb-6">
            You are successfully authenticated.
          </Text>

          <View className="rounded-2xl bg-[#0F172A] p-4">
            <Text className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              User ID
            </Text>

            <Text className="text-purple-400">
              {user?.userId ?? "Unknown"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}