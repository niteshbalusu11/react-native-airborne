import type { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(SafeAreaView);

type ScreenProps = PropsWithChildren<{
  className?: string;
}>;

export function Screen({ children, className = "" }: ScreenProps) {
  return (
    <StyledSafeAreaView className={`flex-1 bg-white p-4 dark:bg-zinc-950 ${className}`}>
      {children}
    </StyledSafeAreaView>
  );
}
