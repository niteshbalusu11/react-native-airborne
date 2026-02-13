import { z } from "zod";

export const clientEnvSchema = z.object({
  clerkPublishableKey: z.string().min(1),
  convexUrl: z.string().url(),
  easProjectId: z.string().optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function parseClientEnv(raw: unknown): ClientEnv {
  return clientEnvSchema.parse(raw);
}
