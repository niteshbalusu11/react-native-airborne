import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { AuthShell } from "@/src/components/auth-shell";
import { FormInput } from "@/src/components/form-input";
import { PrimaryButton } from "@/src/components/primary-button";

type ClerkError = {
  errors?: { longMessage?: string; message?: string }[];
};

export default function SignInScreen() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showEmailCode, setShowEmailCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthLoaded && isSignedIn) {
    return <Redirect href="/(app)" />;
  }

  const onSignInPress = async () => {
    if (!isLoaded || !setActive) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async () => {
            router.replace("/(app)");
          },
        });
        return;
      }

      if (signInAttempt.status === "needs_second_factor") {
        const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code" && "emailAddressId" in factor,
        );

        if (emailCodeFactor && "emailAddressId" in emailCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });
          setShowEmailCode(true);
          return;
        }
      }

      setError("Sign-in requires an unsupported additional step.");
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

  const onVerifyPress = async () => {
    if (!isLoaded || !setActive) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async () => {
            router.replace("/(app)");
          },
        });
        return;
      }

      setError("Verification was not completed. Try again.");
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

  if (showEmailCode) {
    return (
      <AuthShell
        badge="Two-step verification"
        title="Check your inbox"
        subtitle="Enter the 6-digit code we sent to your email to finish signing in."
        footer={
          <View className="flex-row items-center gap-1">
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              Need a different account?
            </Text>
            <Link
              href="/(auth)/sign-in"
              className="text-sm font-semibold text-sky-600 dark:text-sky-400"
            >
              Start over
            </Link>
          </View>
        }
      >
        <FormInput
          label="Verification code"
          value={code}
          onChangeText={setCode}
          placeholder="123456"
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
        />

        {error ? (
          <Text className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
            {error}
          </Text>
        ) : null}

        <PrimaryButton
          onPress={onVerifyPress}
          disabled={submitting || !isLoaded || code.length === 0}
        >
          {submitting ? "Verifying..." : "Verify and continue"}
        </PrimaryButton>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      badge="Welcome back"
      title="Sign in"
      subtitle="Continue building with your existing account."
      footer={
        <View className="flex-row items-center gap-1">
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">
            Don&apos;t have an account?
          </Text>
          <Link
            href="/(auth)/sign-up"
            className="text-sm font-semibold text-sky-600 dark:text-sky-400"
          >
            Create one
          </Link>
        </View>
      }
    >
      <FormInput
        label="Email address"
        value={emailAddress}
        onChangeText={setEmailAddress}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />

      <FormInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
        autoComplete="password"
        textContentType="password"
      />

      {error ? (
        <Text className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
          {error}
        </Text>
      ) : null}

      <PrimaryButton
        onPress={onSignInPress}
        disabled={submitting || !isLoaded || !emailAddress || !password}
      >
        {submitting ? "Signing in..." : "Sign in"}
      </PrimaryButton>
    </AuthShell>
  );
}
