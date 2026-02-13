import { z } from "zod";

const envSchema = z.object({
  CLERK_JWT_ISSUER_DOMAIN: z
    .string()
    .url()
    .default("https://example.clerk.accounts.dev"),
  EXPO_PUSH_ENDPOINT: z
    .string()
    .url()
    .default("https://exp.host/--/api/v2/push/send"),
  EXPO_ACCESS_TOKEN: z.string().optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (!cached) {
    cached = envSchema.parse(process.env);
  }
  return cached;
}
