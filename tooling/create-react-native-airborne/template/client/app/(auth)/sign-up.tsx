import { useAuth, useSignUp } from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { AuthShell } from "@/src/components/auth-shell";
import { FormInput } from "@/src/components/form-input";
import { PrimaryButton } from "@/src/components/primary-button";

type ClerkError = {
  errors?: { longMessage?: string; message?: string }[];
};

export default function SignUpScreen() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthLoaded && isSignedIn) {
    return <Redirect href="/(app)" />;
  }

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
          navigate: async () => {
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
      <AuthShell
        badge="Almost done"
        title="Verify your email"
        subtitle="Enter the code from your inbox to activate your account."
        footer={
          <View className="flex-row items-center gap-1">
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">Already verified?</Text>
            <Link
              href="/(auth)/sign-in"
              className="text-sm font-semibold text-sky-600 dark:text-sky-400"
            >
              Sign in
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
      badge="Get started"
      title="Create your account"
      subtitle="Use your email and a password. We'll send a verification code next."
      footer={
        <View className="flex-row items-center gap-1">
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">Already have an account?</Text>
          <Link
            href="/(auth)/sign-in"
            className="text-sm font-semibold text-sky-600 dark:text-sky-400"
          >
            Sign in
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
        hint="Use at least 8 characters for stronger security."
      />

      {error ? (
        <Text className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
          {error}
        </Text>
      ) : null}

      <PrimaryButton
        onPress={onSignUpPress}
        disabled={submitting || !isLoaded || !emailAddress || !password}
      >
        {submitting ? "Creating account..." : "Continue"}
      </PrimaryButton>
    </AuthShell>
  );
}
