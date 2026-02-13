import type { PropsWithChildren, ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/src/components/screen";

type AuthShellProps = PropsWithChildren<{
  badge: string;
  title: string;
  subtitle: string;
  footer?: ReactNode;
}>;

export function AuthShell({ badge, title, subtitle, footer, children }: AuthShellProps) {
  return (
    <Screen className="bg-zinc-100 px-5 py-4 dark:bg-black">
      <View className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center"
        >
          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="flex-grow justify-center py-6"
          >
            <View
              style={[styles.cardWidth, styles.cardShadow]}
              className="self-center rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <View className="mb-6 gap-2">
                <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-zinc-500 dark:text-zinc-400">
                  {badge}
                </Text>
                <Text className="text-4xl font-black leading-tight text-zinc-900 dark:text-zinc-50">
                  {title}
                </Text>
                <Text className="text-base leading-6 text-zinc-600 dark:text-zinc-300">
                  {subtitle}
                </Text>
              </View>

              <View className="gap-4">{children}</View>

              {footer ? <View className="mt-6">{footer}</View> : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardWidth: {
    width: "100%",
    maxWidth: 540,
  },
  cardShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
});
