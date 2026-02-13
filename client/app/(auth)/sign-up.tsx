import { Link, Redirect } from "expo-router";
import { Text, View } from "react-native";
import { AuthShell } from "@/src/components/auth-shell";
import { FormInput } from "@/src/components/form-input";
import { PrimaryButton } from "@/src/components/primary-button";
import { SocialAuthButtons } from "@/src/components/social-auth-buttons";
import { useSignUpFlow } from "@/src/features/auth/use-sign-up-flow";

export default function SignUpScreen() {
  const {
    isAuthLoaded,
    isSignedIn,
    isLoaded,
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    pendingVerification,
    code,
    setCode,
    submitting,
    error,
    onSignUpPress,
    onVerifyPress,
    onGooglePress,
    onApplePress,
  } = useSignUpFlow();

  if (!isAuthLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

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
              className="text-sm font-semibold text-zinc-900 underline dark:text-zinc-100"
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
      subtitle="Set up your account to continue."
      footer={
        <View className="items-center">
          <Text className="text-sm text-zinc-600 dark:text-zinc-300">Already have an account?</Text>
          <Link
            href="/(auth)/sign-in"
            className="text-sm font-semibold text-zinc-900 underline dark:text-zinc-100"
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

      <SocialAuthButtons
        actionLabel="Sign up"
        onGooglePress={onGooglePress}
        onApplePress={onApplePress}
        disabled={submitting || !isLoaded}
      />
    </AuthShell>
  );
}
