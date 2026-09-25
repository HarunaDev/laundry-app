import { Stack } from "expo-router";
// import { useAppSelector } from "../../redux/hooks";
// import { useEffect } from "react";
// import { useRouter } from "expo-router";
import { GuestGuard } from "../../components/AuthGuard";

export default function AuthLayout() {
  // const user = useAppSelector((state) => state.app.user);
  // const router = useRouter();

  // useEffect(() => {
  //   if (user) {
  //     router.replace("/(tabs)");
  //   }
  // }, [user, router])

  // ✅ Already logged in → go to app
  // if (user) {
  //   return <Redirect href="/(tabs)" />;
  // }

  return (
    <GuestGuard redirectTo="/(tabs)">
      <Stack screenOptions={{ headerShown: false }} />
    </GuestGuard>
  );
}
