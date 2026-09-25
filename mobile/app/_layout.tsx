import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AuthBootstrap } from "@/redux/AuthBootstrap";

import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <AuthBootstrap>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
                headerShown: false,
              }}
            />
          </Stack>

          {/* <StatusBar style="dark"/> */}
        </ThemeProvider>
      </AuthBootstrap>
    </Provider>
  );
}
