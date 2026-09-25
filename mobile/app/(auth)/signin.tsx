import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { useLoginMutation } from "../../redux/slices/authApiSlice";

interface ApiErrorResponse {
  success: boolean;
  errorCode: string;
  message: string;
  details: string[];
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error
  ) {
    const apiError = error as FetchBaseQueryError;

    if (
      typeof apiError.data === "object" &&
      apiError.data !== null &&
      "message" in apiError.data
    ) {
      const data = apiError.data as ApiErrorResponse;

      return data.message;
    }
  }

  return "Unable to sign in. Please check your credentials and try again.";
}

export default function SignInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (): Promise<void> => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      Alert.alert("Sign in", "Please enter your email address.");
      return;
    }

    if (!password) {
      Alert.alert("Sign in", "Please enter your password.");
      return;
    }

    try {
      await login({
        email: normalizedEmail,
        password,
      }).unwrap();

      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Sign in failed", getErrorMessage(error));
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        // contentContainerStyle="flex-grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-20 pb-10">
          {/* Logo / Brand */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 rounded-3xl bg-blue-600 items-center justify-center mb-5">
              <Text className="text-4xl">🧺</Text>
            </View>

            <Text className="text-3xl font-bold text-slate-900">
              LaundryApp
            </Text>

            <Text className="text-base text-slate-500 mt-2 text-center">
              Fresh clothes. Less stress.
            </Text>
          </View>

          {/* Heading */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-slate-900">
              Welcome back
            </Text>

            <Text className="text-base text-slate-500 mt-2">
              Sign in to manage your laundry orders.
            </Text>
          </View>

          {/* Email */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-slate-700 mb-2">
              Email address
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              editable={!isLoading}
              className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900"
            />
          </View>

          {/* Password */}
          <View className="mb-3">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-semibold text-slate-700">
                Password
              </Text>

              <Pressable
                onPress={() => {
                  Alert.alert(
                    "Forgot password",
                    "Password recovery will be available soon."
                  );
                }}
                disabled={isLoading}
              >
                <Text className="text-sm font-semibold text-blue-600">
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              editable={!isLoading}
              className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900"
            />
          </View>

          {/* Sign in button */}
          <Pressable
            onPress={() => {
              void handleLogin();
            }}
            disabled={isLoading}
            className={`mt-5 h-14 w-full items-center justify-center rounded-2xl bg-blue-600 ${
              isLoading ? "opacity-60" : "active:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text className="ml-3 text-base font-bold text-white">
                  Signing in...
                </Text>
              </View>
            ) : (
              <Text className="text-base font-bold text-white">
                Sign in
              </Text>
            )}
          </Pressable>

          {/* Register */}
          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-base text-slate-500">
              Don&apos;t have an account?
            </Text>

            <Pressable
              onPress={() => router.push("/(auth)/signup")}
              disabled={isLoading}
              className="ml-2"
            >
              <Text className="text-base font-bold text-blue-600">
                Create account
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View className="items-center mt-auto pt-12">
            <Text className="text-xs text-slate-400">
              © {new Date().getFullYear()} LaundryApp
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}