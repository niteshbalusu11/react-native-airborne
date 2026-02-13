import { Link, Redirect } from "expo-router";
import { Text, View } from "react-native";
import { AuthShell } from "@/src/components/auth-shell";
import { FormInput } from "@/src/components/form-input";
import { PrimaryButton } from "@/src/components/primary-button";
import { SocialAuthButtons } from "@/src/components/social-auth-buttons";
import { useSignInFlow } from "@/src/features/auth/use-sign-in-flow";

export default function SignInScreen() {
  const {
    isAuthLoaded,
    isSignedIn,
    isLoaded,
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    code,
    setCode,
    showEmailCode,
    error,
    submitting,
    onSignInPress,
    onVerifyPress,
    onGooglePress,
    onApplePress,
  } = useSignInFlow();

  if (!isAuthLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

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
              className="text-sm font-semibold text-zinc-900 underline dark:text-zinc-100"
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
      title="Sign in to your app"
      subtitle="Welcome back! Please sign in to continue."
      footer={
        <View className="items-center">
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">
            Don&apos;t have an account?
          </Text>
          <Link
            href="/(auth)/sign-up"
            className="text-sm font-semibold text-zinc-900 underline dark:text-zinc-100"
          >
            Sign up
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
        {submitting ? "Signing in..." : "Continue"}
      </PrimaryButton>

      <SocialAuthButtons
        actionLabel="Sign in"
        onGooglePress={onGooglePress}
        onApplePress={onApplePress}
        disabled={submitting || !isLoaded}
      />
    </AuthShell>
  );
}
