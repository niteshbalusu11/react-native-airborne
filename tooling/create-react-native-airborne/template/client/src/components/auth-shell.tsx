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
    <Screen className="bg-slate-100 px-5 py-4 dark:bg-zinc-950">
      <View className="flex-1">
        <View className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-cyan-200 dark:bg-cyan-900" />
        <View className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-sky-200 dark:bg-sky-900" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center"
        >
          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="flex-grow justify-center py-10"
          >
            <View
              style={styles.cardShadow}
              className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <View className="mb-6 gap-3">
                <Text className="text-xs font-semibold uppercase tracking-[2px] text-sky-700 dark:text-sky-300">
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
  cardShadow: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
});
