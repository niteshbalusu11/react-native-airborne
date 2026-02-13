import { parseClientEnv, type ClientEnv } from "@/src/lib/env-schema";

let cachedEnv: ClientEnv | null = null;

export { parseClientEnv, type ClientEnv };

export function getClientEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  cachedEnv = parseClientEnv({
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    convexUrl: process.env.EXPO_PUBLIC_CONVEX_URL,
    easProjectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
  });

  return cachedEnv;
}
