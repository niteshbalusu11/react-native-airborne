import { useAction, useMutation } from "convex/react";
import { useState } from "react";
import { Platform, Text, View } from "react-native";
import { PrimaryButton } from "@/src/components/primary-button";
import { Screen } from "@/src/components/screen";
import { registerForPushNotificationsAsync } from "@/src/lib/notifications";
import { usePreferencesStore } from "@/src/store/preferences-store";
import { api } from "../../../server/convex/_generated/api";

export default function PushScreen() {
  const [status, setStatus] = useState<string>("Idle");
  const lastPushToken = usePreferencesStore((state) => state.lastPushToken);
  const setLastPushToken = usePreferencesStore((state) => state.setLastPushToken);

  const registerToken = useMutation(api.push.registerToken);
  const unregisterToken = useMutation(api.push.unregisterToken);
  const sendTestNotification = useAction(api.push.sendTestNotification);

  const onRegister = async () => {
    try {
      setStatus("Requesting notification permissions...");
      const token = await registerForPushNotificationsAsync();
      setStatus("Registering token in Convex...");
      await registerToken({ token, platform: Platform.OS === "ios" ? "ios" : "android" });
      setLastPushToken(token);
      setStatus("Token registered.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to register push token.");
    }
  };

  const onSendTest = async () => {
    try {
      setStatus("Sending test notification...");
      const response = await sendTestNotification({});
      setStatus(`Sent. Status ${response.status}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to send notification.");
    }
  };

  const onUnregister = async () => {
    if (!lastPushToken) {
      setStatus("No token stored to remove.");
      return;
    }

    try {
      await unregisterToken({ token: lastPushToken });
      setLastPushToken(null);
      setStatus("Token removed.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to remove token.");
    }
  };

  return (
    <Screen>
      <View className="flex-1 gap-4">
        <Text className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Push Demo</Text>

        <Text className="text-sm text-zinc-600 dark:text-zinc-300">Status: {status}</Text>
        <Text className="text-xs text-zinc-500 dark:text-zinc-400">
          Last token: {lastPushToken ?? "Not registered yet"}
        </Text>

        <View className="gap-3">
          <PrimaryButton onPress={onRegister}>Register push token</PrimaryButton>
          <PrimaryButton onPress={onSendTest}>Send test notification</PrimaryButton>
          <PrimaryButton onPress={onUnregister}>Remove token</PrimaryButton>
        </View>
      </View>
    </Screen>
  );
}
