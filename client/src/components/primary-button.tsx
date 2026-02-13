import type { PropsWithChildren } from "react";
import { Pressable, Text } from "react-native";

type PrimaryButtonProps = PropsWithChildren<{
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  tone?: "primary" | "muted";
}>;

export function PrimaryButton({
  children,
  onPress,
  disabled = false,
  tone = "primary",
}: PrimaryButtonProps) {
  const activeClassName =
    tone === "primary"
      ? "border border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100"
      : "border border-zinc-300 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900";

  const textClassName =
    tone === "primary" ? "text-zinc-100 dark:text-zinc-950" : "text-zinc-900 dark:text-zinc-100";

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`rounded-2xl px-4 py-3.5 ${disabled ? "border border-zinc-300 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800" : activeClassName}`}
    >
      <Text
        className={`text-center text-base font-semibold ${disabled ? "text-zinc-500 dark:text-zinc-400" : textClassName}`}
      >
        {children}
      </Text>
    </Pressable>
  );
}
