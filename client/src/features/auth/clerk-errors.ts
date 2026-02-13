type ClerkError = {
  errors?: { code?: string; longMessage?: string; message?: string }[];
};

export function getClerkErrorMessage(error: unknown, fallback: string) {
  const clerkError = error as ClerkError;
  return clerkError.errors?.[0]?.longMessage ?? clerkError.errors?.[0]?.message ?? fallback;
}

export function getClerkErrorCode(error: unknown) {
  const clerkError = error as ClerkError;
  return clerkError.errors?.[0]?.code?.toLowerCase() ?? null;
}

export function messageIndicatesSignedIn(message: string) {
  return message.toLowerCase().includes("already signed in");
}
