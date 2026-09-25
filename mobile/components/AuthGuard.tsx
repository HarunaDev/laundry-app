import type { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import {
  Href,
  Redirect,
} from "expo-router";

import { useAppSelector } from "../redux/hooks";

interface GuardProps {
  children: ReactNode;
  redirectTo: Href;
}

export function AuthGuard({
  children,
  redirectTo,
}: GuardProps) {
  const {
    user,
    authInitialized,
  } = useAppSelector((state) => state.app);

  if (!authInitialized) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0B0F2A]">
        <ActivityIndicator
          size="large"
          color="#8B5CF6"
        />
      </View>
    );
  }

  if (!user) {
    return <Redirect href={redirectTo} />;
  }

  return <>{children}</>;
}

export function GuestGuard({
  children,
  redirectTo,
}: GuardProps) {
  const {
    user,
    authInitialized,
  } = useAppSelector((state) => state.app);

  if (!authInitialized) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0B0F2A]">
        <ActivityIndicator
          size="large"
          color="#8B5CF6"
        />
      </View>
    );
  }

  if (user) {
    return <Redirect href={redirectTo} />;
  }

  return <>{children}</>;
}