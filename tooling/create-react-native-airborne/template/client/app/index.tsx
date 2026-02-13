import { SignedIn, SignedOut, useSession, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Screen } from "@/src/components/screen";
import { SignOutButton } from "@/src/components/sign-out-button";

export default function IndexRoute() {
  const { user } = useUser();
  const { session } = useSession();

  return (
    <Screen>
      <View className="flex-1 justify-center gap-5">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            React Native Airborne
          </Text>
          <Text className="text-zinc-600 dark:text-zinc-300">
            Expo + Convex starter with Clerk custom flows.
          </Text>
        </View>

        <SignedOut>
          <View className="gap-3">
            <Link href="/(auth)/sign-in" className="text-base font-semibold text-blue-600">
              Sign in
            </Link>
            <Link href="/(auth)/sign-up" className="text-base font-semibold text-blue-600">
              Sign up
            </Link>
          </View>
        </SignedOut>

        <SignedIn>
          <View className="gap-3">
            <Text className="text-zinc-700 dark:text-zinc-200">
              Hello {user?.primaryEmailAddress?.emailAddress}
            </Text>
            {session?.currentTask ? (
              <Text className="text-sm text-amber-600">
                Session task pending: {session.currentTask.key}
              </Text>
            ) : null}
            <Link href="/(app)" className="text-base font-semibold text-blue-600">
              Open app dashboard
            </Link>
            <SignOutButton />
          </View>
        </SignedIn>
      </View>
    </Screen>
  );
}
