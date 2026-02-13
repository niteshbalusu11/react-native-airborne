import { useAuth, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { getClerkErrorMessage, messageIndicatesSignedIn } from "@/src/features/auth/clerk-errors";
import { useSocialAuth } from "@/src/features/auth/use-social-auth";

export function useSignUpFlow() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goHome = () => {
    router.replace("/");
  };

  const { onSocialPress } = useSocialAuth({
    isLoaded,
    isSignedIn,
    fallbackSetActive: setActive,
    action: "sign-up",
    setSubmitting,
    setError,
    onSignedIn: goHome,
  });

  const activateSession = async (createdSessionId: string | null) => {
    if (!setActive || !createdSessionId) {
      router.replace("/(auth)/sign-in");
      return;
    }

    await setActive({ session: createdSessionId });
    goHome();
  };

  const onSignUpPress = async () => {
    if (!isLoaded || !signUp) {
      return;
    }

    if (isSignedIn) {
      goHome();
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const signUpAttempt = await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (signUpAttempt.status === "complete") {
        await activateSession(signUpAttempt.createdSessionId);
        return;
      }

      if (signUpAttempt.status === "missing_requirements") {
        if (signUpAttempt.unverifiedFields.includes("email_address")) {
          await signUpAttempt.prepareEmailAddressVerification({ strategy: "email_code" });
          setPendingVerification(true);
          return;
        }

        setError(
          "Account created, but additional sign-up requirements are enabled in Clerk. Check your Clerk settings.",
        );
        return;
      }

      setError("Sign-up was abandoned. Please try again.");
    } catch (err) {
      const message = getClerkErrorMessage(
        err,
        "Unable to sign up. Check your Clerk configuration.",
      );

      if (messageIndicatesSignedIn(message)) {
        goHome();
        return;
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !signUp) {
      return;
    }

    if (isSignedIn) {
      goHome();
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (signUpAttempt.status === "complete") {
        await activateSession(signUpAttempt.createdSessionId);
        return;
      }

      setError("Verification is not complete yet. Check the code and try again.");
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
    pendingVerification,
    code,
    setCode,
    submitting,
    error,
    onSignUpPress,
    onVerifyPress,
    onGooglePress: () => onSocialPress("oauth_google", "Google"),
    onApplePress: () => onSocialPress("oauth_apple", "Apple"),
  };
}
