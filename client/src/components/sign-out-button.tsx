import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import { PrimaryButton } from "@/src/components/primary-button";

export function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await signOut();
      router.replace("/");
    } catch {
      setError("Unable to sign out. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PrimaryButton onPress={handleSignOut} disabled={isSubmitting}>
        {isSubmitting ? "Signing out..." : "Sign out"}
      </PrimaryButton>
      {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
    </>
  );
}
