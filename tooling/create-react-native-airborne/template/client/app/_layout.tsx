import "../global.css";
import "react-native-reanimated";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useThemeSync } from "@/src/hooks/use-theme-sync";
import { convexClient } from "@/src/lib/convex";
import { getClientEnv } from "@/src/lib/env";

const env = getClientEnv();

function ThemeBootstrap() {
  useThemeSync();
  return null;
}

export default function RootLayout() {
  return (
    // tokenCache persists Clerk session tokens in Expo Secure Store (Keychain/Keystore).
    <ClerkProvider publishableKey={env.clerkPublishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
        <SafeAreaProvider>
          <ThemeBootstrap />
          <Slot />
        </SafeAreaProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
