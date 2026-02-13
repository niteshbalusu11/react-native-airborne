import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  getClerkErrorCode,
  getClerkErrorMessage,
  messageIndicatesSignedIn,
} from "@/src/features/auth/clerk-errors";
import { useSocialAuth } from "@/src/features/auth/use-social-auth";

type SecondFactorOption = {
  strategy: string;
  emailAddressId?: string;
};

function toSecondFactorOptions(
  factors: { strategy: string; emailAddressId?: string }[] | null | undefined,
) {
  return factors?.map((factor) => ({
    strategy: factor.strategy,
    emailAddressId: factor.emailAddressId,
  }));
}

export function useSignInFlow() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showEmailCode, setShowEmailCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const goHome = () => {
    router.replace("/");
  };

  const { onSocialPress } = useSocialAuth({
    isLoaded,
    isSignedIn,
    fallbackSetActive: setActive,
    action: "sign-in",
    setSubmitting,
    setError,
    onSignedIn: goHome,
  });

  const activateSession = async (createdSessionId: string | null) => {
    if (!setActive || !createdSessionId) {
      setError("Sign-in completed, but no session could be activated.");
      return;
    }

    await setActive({ session: createdSessionId });
    goHome();
  };

  const beginEmailCodeSecondFactor = async (supportedSecondFactors: SecondFactorOption[]) => {
    if (!signIn) {
      return false;
    }

    const emailCodeFactor = supportedSecondFactors.find(
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
      goHome();
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
        if (getClerkErrorCode(createErr) !== "form_param_format_invalid") {
          throw createErr;
        }

        signInAttempt = await signIn.create({ identifier });
      }

      const firstFactorStrategies = signInAttempt.supportedFirstFactors?.map(
        (factor) => factor.strategy,
      );
      const secondFactors = toSecondFactorOptions(
        signInAttempt.supportedSecondFactors?.map((factor) => ({
          strategy: factor.strategy,
          emailAddressId: "emailAddressId" in factor ? factor.emailAddressId : undefined,
        })),
      );

      if (signInAttempt.status === "complete") {
        await activateSession(signInAttempt.createdSessionId);
        return;
      }

      if (signInAttempt.status === "needs_first_factor") {
        if (!firstFactorStrategies?.includes("password")) {
          setError(
            "Password sign-in is not enabled for this Clerk app. Enable Password sign-in in Clerk Dashboard.",
          );
          return;
        }

        const passwordAttempt = await signIn.attemptFirstFactor({
          strategy: "password",
          password,
        });
        const passwordAttemptSecondFactors = toSecondFactorOptions(
          passwordAttempt.supportedSecondFactors?.map((factor) => ({
            strategy: factor.strategy,
            emailAddressId: "emailAddressId" in factor ? factor.emailAddressId : undefined,
          })),
        );

        if (passwordAttempt.status === "complete") {
          await activateSession(passwordAttempt.createdSessionId);
          return;
        }

        if (passwordAttempt.status === "needs_second_factor") {
          const startedSecondFactor = await beginEmailCodeSecondFactor(
            passwordAttemptSecondFactors ?? [],
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
        const startedSecondFactor = await beginEmailCodeSecondFactor(secondFactors ?? []);

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
        goHome();
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
      goHome();
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
      setError(getClerkErrorMessage(err, "Invalid verification code."));
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
    onGooglePress: () => onSocialPress("oauth_google", "Google"),
    onApplePress: () => onSocialPress("oauth_apple", "Apple"),
  };
}
