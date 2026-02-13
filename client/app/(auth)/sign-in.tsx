import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { AuthShell } from "@/src/components/auth-shell";
import { FormInput } from "@/src/components/form-input";
import { PrimaryButton } from "@/src/components/primary-button";

type ClerkError = {
  errors?: { code?: string; longMessage?: string; message?: string }[];
};

function getClerkErrorMessage(error: unknown, fallback: string) {
  const clerkError = error as ClerkError;
  return clerkError.errors?.[0]?.longMessage ?? clerkError.errors?.[0]?.message ?? fallback;
}

function getClerkErrorCode(error: unknown) {
  const clerkError = error as ClerkError;
  return clerkError.errors?.[0]?.code?.toLowerCase() ?? null;
}

function messageIndicatesSignedIn(message: string) {
  return message.toLowerCase().includes("already signed in");
}

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

  if (!isAuthLoaded) {
    return null;
  }

  if (isAuthLoaded && isSignedIn) {
    return <Redirect href="/" />;
  }

  const activateSession = async (createdSessionId: string | null) => {
    if (!setActive || !createdSessionId) {
      setError("Sign-in completed, but no session could be activated.");
      return;
    }

    await setActive({ session: createdSessionId });
    router.replace("/");
  };

  const beginEmailCodeSecondFactor = async (
    supportedSecondFactors:
      | {
          strategy: string;
          emailAddressId?: string;
        }[]
      | null
      | undefined,
  ) => {
    if (!signIn) {
      return false;
    }

    const emailCodeFactor = supportedSecondFactors?.find(
      (factor) => factor.strategy === "email_code" && Boolean(factor.emailAddressId),
    );

    if (!emailCodeFactor?.emailAddressId) {
      return false;
    }

    await signIn.prepareSecondFactor({
      strategy: "email_code",
      emailAddressId: emailCodeFactor.emailAddressId,
    });
    setShowEmailCode(true);
    return true;
  };

  const onSignInPress = async () => {
    if (!isLoaded || !setActive || !signIn) {
      return;
    }

    if (isSignedIn) {
      router.replace("/");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const identifier = emailAddress.trim();
      let signInAttempt: Awaited<ReturnType<typeof signIn.create>>;

      try {
        signInAttempt = await signIn.create({
          strategy: "password",
          identifier,
          password,
        });
      } catch (createErr) {
        const createCode = getClerkErrorCode(createErr);
        getClerkErrorMessage(createErr, "Unable to start password sign-in.");

        if (createCode !== "form_param_format_invalid") {
          throw createErr;
        }

        signInAttempt = await signIn.create({
          identifier,
        });
      }

      const firstFactorStrategies = signInAttempt.supportedFirstFactors?.map(
        (factor) => factor.strategy,
      );
      const secondFactors = signInAttempt.supportedSecondFactors?.map((factor) => ({
        strategy: factor.strategy,
        emailAddressId: "emailAddressId" in factor ? factor.emailAddressId : undefined,
      }));

      if (signInAttempt.status === "complete") {
        await activateSession(signInAttempt.createdSessionId);
        return;
      }

      if (signInAttempt.status === "needs_first_factor") {
        const hasPasswordFactor = firstFactorStrategies?.includes("password");

        if (!hasPasswordFactor) {
          setError(
            "Password sign-in is not enabled for this Clerk app. Enable Password sign-in in Clerk Dashboard.",
          );
          return;
        }

        const passwordAttempt = await signIn.attemptFirstFactor({
          strategy: "password",
          password,
        });
        const passwordAttemptSecondFactors = passwordAttempt.supportedSecondFactors?.map(
          (factor) => ({
            strategy: factor.strategy,
            emailAddressId: "emailAddressId" in factor ? factor.emailAddressId : undefined,
          }),
        );

        if (passwordAttempt.status === "complete") {
          await activateSession(passwordAttempt.createdSessionId);
          return;
        }

        if (passwordAttempt.status === "needs_second_factor") {
          const startedSecondFactor = await beginEmailCodeSecondFactor(
            passwordAttemptSecondFactors,
          );

          if (startedSecondFactor) {
            return;
          }

          setError(
            "Second-factor authentication is required, but email code is not enabled for this account.",
          );
          return;
        }

        setError(
          `Password verification did not complete sign-in (${passwordAttempt.status ?? "unknown"}).`,
        );
        return;
      }

      if (signInAttempt.status === "needs_second_factor") {
        const startedSecondFactor = await beginEmailCodeSecondFactor(secondFactors);

        if (startedSecondFactor) {
          return;
        }

        setError(
          "Second-factor authentication is required, but email code is not enabled for this account.",
        );
        return;
      }

      if (signInAttempt.status === "needs_new_password") {
        setError("This account requires a password reset before sign-in.");
        return;
      }

      setError(`Sign-in requires an unsupported step: ${signInAttempt.status ?? "unknown"}.`);
    } catch (err) {
      const code = getClerkErrorCode(err);
      const message = getClerkErrorMessage(
        err,
        "Unable to sign in. Check your credentials and Clerk setup.",
      );

      if (messageIndicatesSignedIn(message)) {
        router.replace("/");
        return;
      }

      if (code?.includes("identifier") || message.toLowerCase().includes("invalid identifier")) {
        setError(
          "Invalid identifier. Verify you are using the exact email used at sign-up, and ensure Email is enabled as a sign-in identifier in Clerk Dashboard.",
        );
        return;
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !setActive || !signIn) {
      return;
    }

    if (isSignedIn) {
      router.replace("/");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: code.trim(),
      });

      if (signInAttempt.status === "complete") {
        await activateSession(signInAttempt.createdSessionId);
        return;
      }

      setError(`Verification is not complete yet (${signInAttempt.status ?? "unknown"}).`);
    } catch (err) {
      const message = getClerkErrorMessage(err, "Invalid verification code.");
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
