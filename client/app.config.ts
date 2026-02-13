import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "React Native Airborne",
  slug: "react-native-airborne",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "airborne",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.airborne.starter",
  },
  android: {
    package: "com.airborne.starter",
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      backgroundColor: "#f4f4f5",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
  },
  plugins: ["expo-router", "expo-notifications", "expo-secure-store"],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
    convexUrl: process.env.EXPO_PUBLIC_CONVEX_URL ?? "",
    easProjectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? "",
  },
});
