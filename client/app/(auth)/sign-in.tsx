import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { FormInput } from "@/src/components/form-input";
import { PrimaryButton } from "@/src/components/primary-button";
import { Screen } from "@/src/components/screen";

type ClerkError = {
  errors?: { longMessage?: string; message?: string }[];
};

export default function SignInScreen() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isSignedIn) {
    return <Redirect href="/(app)" />;
  }

  const onSubmit = async () => {
    if (!isLoaded || !signIn || !setActive) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status !== "complete") {
        setError("Sign-in requires an additional step. Update this flow if needed.");
        return;
      }

      await setActive({ session: result.createdSessionId });
      router.replace("/(app)");
    } catch (err) {
      const clerkError = err as ClerkError;
      const message =
        clerkError.errors?.[0]?.longMessage ??
        clerkError.errors?.[0]?.message ??
        "Unable to sign in. Check your credentials and Clerk setup.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 justify-center gap-5">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Welcome to Airborne
          </Text>
          <Text className="text-zinc-600 dark:text-zinc-300">
            Sign in with your Clerk email and password.
          </Text>
        </View>

        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
        />

        <FormInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />

        {error ? <Text className="text-sm text-red-500">{error}</Text> : null}

        <PrimaryButton onPress={onSubmit} disabled={submitting || !isLoaded}>
          {submitting ? "Signing in..." : "Sign in"}
        </PrimaryButton>

        {!isLoaded ? <ActivityIndicator size="small" /> : null}

        <Text className="text-sm text-zinc-500 dark:text-zinc-400">
          Need an account? Create one in your Clerk dashboard and sign in here.
        </Text>

        <Link href="https://dashboard.clerk.com" className="text-sm font-medium text-blue-600">
          Open Clerk Dashboard
        </Link>
      </View>
    </Screen>
  );
}
