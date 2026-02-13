import { useEffect } from "react";
import { Uniwind } from "uniwind";
import { usePreferencesStore } from "@/src/store/preferences-store";

export function useThemeSync() {
  const theme = usePreferencesStore((state) => state.theme);

  useEffect(() => {
    Uniwind.setTheme(theme);
  }, [theme]);
}
