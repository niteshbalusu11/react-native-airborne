import { useUniwind } from "uniwind";
import { Text, View } from "react-native";
import { PrimaryButton } from "@/src/components/primary-button";
import { Screen } from "@/src/components/screen";
import { usePreferencesStore } from "@/src/store/preferences-store";
import type { ThemePreference } from "@/src/types/theme";

export default function SettingsScreen() {
  const { theme, hasAdaptiveThemes } = useUniwind();
  const selectedTheme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);

  const activeTheme = hasAdaptiveThemes ? "system" : theme;

  const onChangeTheme = (nextTheme: ThemePreference) => {
    setTheme(nextTheme);
  };

  return (
    <Screen>
      <View className="flex-1 gap-4">
        <Text className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Settings</Text>

        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          Active theme: {activeTheme}. Stored preference: {selectedTheme}.
        </Text>

        <View className="gap-3">
          <PrimaryButton onPress={() => onChangeTheme("system")}>Use system theme</PrimaryButton>
          <PrimaryButton onPress={() => onChangeTheme("light")}>Use light theme</PrimaryButton>
          <PrimaryButton onPress={() => onChangeTheme("dark")}>Use dark theme</PrimaryButton>
        </View>
      </View>
    </Screen>
  );
}
