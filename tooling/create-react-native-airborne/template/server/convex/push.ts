import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { getServerEnv } from "./env";
import { requireUserIdentity } from "./lib";

async function getCurrentUserId(ctx: {
  auth: { getUserIdentity: () => Promise<{ subject: string } | null> };
  db: {
    query: Function;
  };
}) {
  const identity = await requireUserIdentity(ctx);
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q: any) => q.eq("clerkUserId", identity.subject))
    .unique();

  if (!user) {
    throw new ConvexError("Run users.bootstrap first");
  }

  return user._id;
}

export const registerToken = mutation({
  args: {
    token: v.string(),
    platform: v.optional(v.union(v.literal("ios"), v.literal("android"))),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getCurrentUserId(ctx);
    const existing = await ctx.db
      .query("pushTokens")
      .withIndex("by_user_id_and_token", (q: any) =>
        q.eq("userId", userId).eq("token", args.token),
      )
      .unique();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        platform: args.platform ?? existing.platform,
        updatedAt: now,
      });
      return existing._id;
    }

    return ctx.db.insert("pushTokens", {
      userId,
      token: args.token,
      platform: args.platform,
      updatedAt: now,
    });
  },
});

export const unregisterToken = mutation({
  args: { token: v.string() },
  handler: async (ctx: any, args: any) => {
    const userId = await getCurrentUserId(ctx);
    const existing = await ctx.db
      .query("pushTokens")
      .withIndex("by_user_id_and_token", (q: any) =>
        q.eq("userId", userId).eq("token", args.token),
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    return { success: true };
  },
});

export const listMyTokens = query({
  args: {},
  handler: async (ctx: any) => {
    const userId = await getCurrentUserId(ctx);
    return ctx.db
      .query("pushTokens")
      .withIndex("by_user_id", (q: any) => q.eq("userId", userId))
      .collect();
  },
});

export const sendTestNotification = action({
  args: {
    title: v.optional(v.string()),
    body: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    await requireUserIdentity(ctx);
    const env = getServerEnv();

    const tokens = await ctx.runQuery(api.push.listMyTokens, {});
    if (tokens.length === 0) {
      throw new ConvexError("No registered push tokens");
    }

    const messages = tokens.map((tokenEntry: any) => ({
      to: tokenEntry.token,
      sound: "default",
      title: args.title ?? "Airborne Test Notification",
      body:
        args.body ??
        "Push notifications are configured successfully in react-native-airborne.",
      data: {
        source: "react-native-airborne",
      },
    }));

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
    };

    if (env.EXPO_ACCESS_TOKEN) {
      headers.Authorization = `Bearer ${env.EXPO_ACCESS_TOKEN}`;
    }

    const response = await fetch(env.EXPO_PUSH_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(messages),
    });

    const json = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      result: json,
      tokenCount: tokens.length,
    };
  },
});
