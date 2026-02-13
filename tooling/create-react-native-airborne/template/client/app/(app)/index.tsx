import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { PrimaryButton } from "@/src/components/primary-button";
import { Screen } from "@/src/components/screen";
import { api } from "../../../server/convex/_generated/api";

export default function HomeScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const currentUser = useQuery(api.users.current, {});
  const bootstrapUser = useMutation(api.users.bootstrap);
  const didBootstrap = useRef(false);

  useEffect(() => {
    if (!user || currentUser !== null || didBootstrap.current) {
      return;
    }

    didBootstrap.current = true;
    void bootstrapUser({
      email: user.primaryEmailAddress?.emailAddress,
      name: user.fullName ?? undefined,
      imageUrl: user.imageUrl ?? undefined,
    });
  }, [bootstrapUser, currentUser, user]);

  return (
    <Screen>
      <View className="flex-1 gap-5">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            React Native Airborne
          </Text>
          <Text className="text-zinc-600 dark:text-zinc-300">
            Opinionated Expo + Convex + Clerk starter with Uniwind.
          </Text>
        </View>

        <View className="rounded-xl border border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">Authenticated user</Text>
          <Text className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {currentUser?.email ?? "Loading profile..."}
          </Text>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            Clerk ID: {currentUser?.clerkUserId ?? "..."}
          </Text>
        </View>

        <View className="gap-3">
          <Link href="/(app)/settings" className="text-base font-medium text-blue-600">
            Open Settings (theme)
          </Link>
          <Link href="/(app)/push" className="text-base font-medium text-blue-600">
            Open Push Demo
          </Link>
        </View>

        <PrimaryButton
          onPress={() => {
            void signOut();
          }}
        >
          Sign out
        </PrimaryButton>
      </View>
    </Screen>
  );
}
