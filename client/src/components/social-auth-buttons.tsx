import type { ReactNode } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, Text, View, useColorScheme } from "react-native";

type SocialAuthButtonsProps = {
  actionLabel: "Sign in" | "Sign up";
  onGooglePress: () => void | Promise<void>;
  onApplePress: () => void | Promise<void>;
  disabled?: boolean;
};

type SocialIconButtonProps = {
  icon: ReactNode;
  onPress: () => void | Promise<void>;
  disabled: boolean;
  label: string;
};

function SocialIconButton({ icon, onPress, disabled, label }: SocialIconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      className={`h-14 flex-1 items-center justify-center rounded-2xl border ${
        disabled
          ? "border-zinc-300 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800"
          : "border-zinc-300 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      {icon}
    </Pressable>
  );
}

export function SocialAuthButtons({
  actionLabel,
  onGooglePress,
  onApplePress,
  disabled = false,
}: SocialAuthButtonsProps) {
  const isDark = useColorScheme() === "dark";
  const appleColor = isDark ? "#f4f4f5" : "#09090b";

  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-4">
        <View className="h-px flex-1 bg-zinc-300 dark:bg-zinc-800" />
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">or</Text>
        <View className="h-px flex-1 bg-zinc-300 dark:bg-zinc-800" />
      </View>

      <View className="flex-row items-center gap-3">
        {Platform.OS === "ios" ? (
          <SocialIconButton
            label={`${actionLabel} with Apple`}
            onPress={onApplePress}
            disabled={disabled}
            icon={<Ionicons name="logo-apple" size={28} color={appleColor} />}
          />
        ) : null}

        <SocialIconButton
          label={`${actionLabel} with Google`}
          onPress={onGooglePress}
          disabled={disabled}
          icon={<FontAwesome name="google" size={26} color="#4285F4" />}
        />
      </View>
    </View>
  );
}
