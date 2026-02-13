import type { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({ children }: PropsWithChildren) {
  return <SafeAreaView className="flex-1 bg-white p-4 dark:bg-zinc-950">{children}</SafeAreaView>;
}
