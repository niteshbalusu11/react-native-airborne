import { SignedIn, SignedOut, useSession, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/src/components/screen";
import { SignOutButton } from "@/src/components/sign-out-button";

export default function IndexRoute() {
  const { user } = useUser();
  const { session } = useSession();

  return (
    <Screen className="bg-slate-100 px-5 py-4 dark:bg-zinc-950">
      <View className="flex-1">
        <View className="absolute -top-24 -left-16 h-56 w-56 rounded-full bg-cyan-200 dark:bg-cyan-900" />
        <View className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-sky-200 dark:bg-sky-900" />

        <View className="flex-1 justify-center">
          <SignedOut>
            <View
              style={styles.cardShadow}
              className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <View className="gap-3">
                <Text className="text-xs font-semibold uppercase tracking-[2px] text-sky-700 dark:text-sky-300">
                  React Native Airborne
                </Text>
                <Text className="text-4xl font-black leading-tight text-zinc-900 dark:text-zinc-50">
                  Start fast. Ship clean.
                </Text>
                <Text className="text-base leading-6 text-zinc-600 dark:text-zinc-300">
                  Expo Router, Clerk auth, Convex backend, push notifications, and Uniwind in one
                  starter.
                </Text>
              </View>

              <View className="mt-7 gap-3">
                <Link href="/(auth)/sign-up" asChild>
                  <Pressable className="rounded-2xl border border-sky-700 bg-sky-600 px-4 py-3.5">
                    <Text className="text-center text-base font-semibold text-white">
                      Create account
                    </Text>
                  </Pressable>
                </Link>

                <Link href="/(auth)/sign-in" asChild>
                  <Pressable className="rounded-2xl border border-zinc-300 bg-zinc-100 px-4 py-3.5 dark:border-zinc-700 dark:bg-zinc-800">
                    <Text className="text-center text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      I already have an account
                    </Text>
                  </Pressable>
                </Link>
              </View>

              <View className="mt-7 flex-row flex-wrap gap-2">
                <View className="rounded-full bg-sky-100 px-3 py-1 dark:bg-sky-900">
                  <Text className="text-xs font-semibold text-sky-700 dark:text-sky-200">
                    Expo Router
                  </Text>
                </View>
                <View className="rounded-full bg-emerald-100 px-3 py-1 dark:bg-emerald-900">
                  <Text className="text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                    Clerk
                  </Text>
                </View>
                <View className="rounded-full bg-indigo-100 px-3 py-1 dark:bg-indigo-900">
                  <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-200">
                    Convex
                  </Text>
                </View>
                <View className="rounded-full bg-amber-100 px-3 py-1 dark:bg-amber-900">
                  <Text className="text-xs font-semibold text-amber-700 dark:text-amber-200">
                    Uniwind
                  </Text>
                </View>
              </View>
            </View>
          </SignedOut>

          <SignedIn>
            <View
              style={styles.cardShadow}
              className="gap-5 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <View className="gap-2">
                <Text className="text-xs font-semibold uppercase tracking-[2px] text-sky-700 dark:text-sky-300">
                  Welcome
                </Text>
                <Text className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
                  Hello {user?.primaryEmailAddress?.emailAddress}
                </Text>
                <Text className="text-zinc-600 dark:text-zinc-300">
                  Open your dashboard to continue.
                </Text>
              </View>

              {session?.currentTask ? (
                <Text className="rounded-xl bg-amber-100 px-3 py-2 text-sm text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  Session task pending: {session.currentTask.key}
                </Text>
              ) : null}

              <Link href="/(app)" asChild>
                <Pressable className="rounded-2xl border border-sky-700 bg-sky-600 px-4 py-3.5">
                  <Text className="text-center text-base font-semibold text-white">
                    Open app dashboard
                  </Text>
                </Pressable>
              </Link>

              <SignOutButton />
            </View>
          </SignedIn>
        </View>
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
