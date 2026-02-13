import type { PropsWithChildren } from "react";
import { Pressable, Text } from "react-native";

type PrimaryButtonProps = PropsWithChildren<{
  onPress: () => void | Promise<void>;
  disabled?: boolean;
}>;

export function PrimaryButton({
  children,
  onPress,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`rounded-xl px-4 py-3 ${
        disabled ? "bg-zinc-400" : "bg-zinc-900 dark:bg-zinc-100"
      }`}
    >
      <Text
        className={`text-center font-semibold ${
          disabled ? "text-zinc-700" : "text-white dark:text-zinc-900"
        }`}
      >
        {children}
      </Text>
    </Pressable>
  );
}
