import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { FormInput } from "@/src/components/form-input";
import { PrimaryButton } from "@/src/components/primary-button";
import { Screen } from "@/src/components/screen";

type ClerkError = {
  errors?: { longMessage?: string; message?: string }[];
};

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignUpPress = async () => {
    if (!isLoaded || !signUp) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      const clerkError = err as ClerkError;
      const message =
        clerkError.errors?.[0]?.longMessage ??
        clerkError.errors?.[0]?.message ??
        "Unable to sign up. Check your Clerk configuration.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !setActive) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              return;
            }
            router.replace("/(app)");
          },
        });
        return;
      }

      setError("Verification is not complete yet.");
    } catch (err) {
      const clerkError = err as ClerkError;
      const message =
        clerkError.errors?.[0]?.longMessage ??
        clerkError.errors?.[0]?.message ??
        "Invalid verification code.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (pendingVerification) {
    return (
      <Screen>
        <View className="flex-1 justify-center gap-5">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Verify your email
            </Text>
            <Text className="text-zinc-600 dark:text-zinc-300">
              Enter the verification code sent to your email.
            </Text>
          </View>

          <FormInput
            label="Verification code"
            value={code}
            onChangeText={setCode}
            placeholder="123456"
          />

          {error ? <Text className="text-sm text-red-500">{error}</Text> : null}

          <PrimaryButton
            onPress={onVerifyPress}
            disabled={submitting || !isLoaded || code.length === 0}
          >
            {submitting ? "Verifying..." : "Verify"}
          </PrimaryButton>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-1 justify-center gap-5">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Create account
          </Text>
          <Text className="text-zinc-600 dark:text-zinc-300">
            Sign up with your email and password.
          </Text>
        </View>

        <FormInput
          label="Email"
          value={emailAddress}
          onChangeText={setEmailAddress}
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

        <PrimaryButton
          onPress={onSignUpPress}
          disabled={submitting || !isLoaded || !emailAddress || !password}
        >
          {submitting ? "Creating account..." : "Continue"}
        </PrimaryButton>

        <View className="flex-row items-center gap-1">
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">Already have an account?</Text>
          <Link href="/(auth)/sign-in" className="text-sm font-semibold text-blue-600">
            Sign in
          </Link>
        </View>
      </View>
    </Screen>
  );
}
