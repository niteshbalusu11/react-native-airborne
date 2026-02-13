import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");

describe("convex functions", () => {
  test("users.bootstrap creates a user and can be queried", async () => {
    const t = convexTest(schema, modules);

    const authed = t.withIdentity({
      subject: "user_123",
      issuer: "https://example.clerk.accounts.dev",
      tokenIdentifier: "test|user_123",
    });

    await authed.mutation(api.users.bootstrap, {
      email: "test@example.com",
      name: "Airborne User",
    });

    const current = await authed.query(api.users.current, {});
    expect(current?.clerkUserId).toBe("user_123");
    expect(current?.email).toBe("test@example.com");
  });

  test("push token register and unregister", async () => {
    const t = convexTest(schema, modules);
    const authed = t.withIdentity({
      subject: "user_456",
      issuer: "https://example.clerk.accounts.dev",
      tokenIdentifier: "test|user_456",
    });

    await authed.mutation(api.users.bootstrap, {});
    await authed.mutation(api.push.registerToken, {
      token: "ExponentPushToken[example]",
      platform: "ios",
    });

    const tokens = await authed.query(api.push.listMyTokens, {});
    expect(tokens).toHaveLength(1);

    await authed.mutation(api.push.unregisterToken, {
      token: "ExponentPushToken[example]",
    });

    const after = await authed.query(api.push.listMyTokens, {});
    expect(after).toHaveLength(0);
  });
});
