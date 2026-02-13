import { describe, expect, it } from "vitest";
import { parseClientEnv } from "./env-schema";

describe("parseClientEnv", () => {
  it("parses valid values", () => {
    const env = parseClientEnv({
      clerkPublishableKey: "pk_test_example",
      convexUrl: "https://example.convex.cloud",
      easProjectId: "project-id",
    });

    expect(env.clerkPublishableKey).toBe("pk_test_example");
    expect(env.convexUrl).toBe("https://example.convex.cloud");
  });

  it("throws for invalid values", () => {
    expect(() =>
      parseClientEnv({
        clerkPublishableKey: "",
        convexUrl: "invalid-url",
      }),
    ).toThrowError();
  });
});
