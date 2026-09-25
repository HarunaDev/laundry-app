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

import { useRegisterMutation } from "../../redux/slices/authApiSlice";

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

  return "Unable to create your account. Please try again.";
}

export default function SignUpScreen() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [register, { isLoading }] = useRegisterMutation();

  const handleRegister = async (): Promise<void> => {
    const normalizedUserName = userName.trim();
    const normalizedEmail = email.trim();

    if (!normalizedUserName) {
      Alert.alert("Create account", "Please enter your name.");
      return;
    }

    if (!normalizedEmail) {
      Alert.alert("Create account", "Please enter your email address.");
      return;
    }

    if (!password) {
      Alert.alert("Create account", "Please enter a password.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Create account",
        "Your password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Create account",
        "Your passwords do not match."
      );
      return;
    }

    try {
      await register({
        userName: normalizedUserName,
        email: normalizedEmail,
        password,
      }).unwrap();

      Alert.alert(
        "Account created",
        "Your LaundryApp account has been created successfully.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.replace("/(auth)/signin");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Registration failed",
        getErrorMessage(error)
      );
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        // contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-14 pb-10">
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            disabled={isLoading}
            className="mb-8 h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200"
          >
            <Text className="text-xl text-slate-700">
              ‹
            </Text>
          </Pressable>

          {/* Brand */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-2xl bg-blue-600 items-center justify-center mb-4">
              <Text className="text-3xl">🧺</Text>
            </View>

            <Text className="text-2xl font-bold text-slate-900">
              Create your account
            </Text>

            <Text className="text-base text-slate-500 mt-2 text-center">
              Join LaundryApp and make laundry day easier.
            </Text>
          </View>

          {/* Name */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-slate-700 mb-2">
              Full name
            </Text>

            <TextInput
              value={userName}
              onChangeText={setUserName}
              placeholder="Enter your name"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isLoading}
              className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900"
            />
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
          <View className="mb-5">
            <Text className="text-sm font-semibold text-slate-700 mb-2">
              Password
            </Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              editable={!isLoading}
              className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900"
            />
          </View>

          {/* Confirm password */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-slate-700 mb-2">
              Confirm password
            </Text>

            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              editable={!isLoading}
              className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900"
            />
          </View>

          {/* Create account */}
          <Pressable
            onPress={() => {
              void handleRegister();
            }}
            disabled={isLoading}
            className={`h-14 w-full items-center justify-center rounded-2xl bg-blue-600 ${
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
                  Creating account...
                </Text>
              </View>
            ) : (
              <Text className="text-base font-bold text-white">
                Create account
              </Text>
            )}
          </Pressable>

          {/* Sign in */}
          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-base text-slate-500">
              Already have an account?
            </Text>

            <Pressable
              onPress={() => router.replace("/(auth)/signin")}
              disabled={isLoading}
              className="ml-2"
            >
              <Text className="text-base font-bold text-blue-600">
                Sign in
              </Text>
            </Pressable>
          </View>

          <View className="items-center mt-10">
            <Text className="text-xs text-slate-400 text-center">
              By creating an account, you agree to our terms
              and privacy policy.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}