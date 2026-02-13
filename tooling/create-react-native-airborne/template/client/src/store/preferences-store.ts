import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { ThemePreference } from "@/src/types/theme";

const mmkv = createMMKV({ id: "airborne-preferences" });

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    mmkv.set(name, value);
  },
  getItem: (name) => mmkv.getString(name) ?? null,
  removeItem: (name) => {
    mmkv.remove(name);
  },
};

type PreferencesState = {
  theme: ThemePreference;
  lastPushToken: string | null;
  setTheme: (theme: ThemePreference) => void;
  setLastPushToken: (token: string | null) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "system",
      lastPushToken: null,
      setTheme: (theme) => set({ theme }),
      setLastPushToken: (lastPushToken) => set({ lastPushToken }),
    }),
    {
      name: "airborne-preferences-store",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        theme: state.theme,
        lastPushToken: state.lastPushToken,
      }),
    },
  ),
);
