import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "__APP_NAME__",
  slug: "__APP_SLUG__",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "airborne",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "__APP_BUNDLE_ID__",
  },
  android: {
    package: "__APP_BUNDLE_ID__",
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
});
