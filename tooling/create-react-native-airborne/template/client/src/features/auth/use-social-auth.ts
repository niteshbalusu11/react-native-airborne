import { useSSO } from "@clerk/clerk-expo";
import { getClerkErrorMessage, messageIndicatesSignedIn } from "@/src/features/auth/clerk-errors";

type SocialStrategy = "oauth_google" | "oauth_apple";
type SocialProviderName = "Google" | "Apple";
type SocialAction = "sign-in" | "sign-up";
type SetActiveFn = (params: { session: string }) => Promise<void>;

type UseSocialAuthOptions = {
  isLoaded: boolean | undefined;
  isSignedIn: boolean | undefined;
  fallbackSetActive?: SetActiveFn | null;
  action: SocialAction;
  setSubmitting: (isSubmitting: boolean) => void;
  setError: (message: string | null) => void;
  onSignedIn: () => void;
};

function actionLabel(action: SocialAction) {
  return action === "sign-in" ? "Sign-in" : "Sign-up";
}

export function useSocialAuth({
  isLoaded,
  isSignedIn,
  fallbackSetActive,
  action,
  setSubmitting,
  setError,
  onSignedIn,
}: UseSocialAuthOptions) {
  const { startSSOFlow } = useSSO();

  const onSocialPress = async (strategy: SocialStrategy, providerName: SocialProviderName) => {
    if (!isLoaded) {
      return;
    }

    if (isSignedIn) {
      onSignedIn();
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });

      if (!createdSessionId) {
        setError(`${providerName} ${action} was canceled or did not complete.`);
        return;
      }

      const activate = setActive ?? fallbackSetActive;

      if (!activate) {
        setError(`${actionLabel(action)} completed, but no session could be activated.`);
        return;
      }

      await activate({ session: createdSessionId });
      onSignedIn();
    } catch (error) {
      const message = getClerkErrorMessage(error, `Unable to ${action} with ${providerName}.`);

      if (messageIndicatesSignedIn(message)) {
        onSignedIn();
        return;
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return { onSocialPress };
}
