import { ConvexError, v } from "convex/values";
import { z } from "zod";
import { api } from "./_generated/api";
import {
  action,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { getServerEnv } from "./env";
import { requireUserIdentity } from "./lib";

type ConvexCtx = MutationCtx | QueryCtx;

type ExpoPushMessage = {
  to: string;
  sound: "default";
  title: string;
  body: string;
  data: {
    source: string;
  };
};

const pushTokensSchema = z.array(
  z.object({
    token: z.string(),
  }),
);

async function getCurrentUser(ctx: ConvexCtx) {
  const identity = await requireUserIdentity(ctx);
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
    .unique();

  if (!user) {
    throw new ConvexError("Run users.bootstrap first");
  }

  return user;
}

export const registerToken = mutation({
  args: {
    token: v.string(),
    platform: v.optional(v.union(v.literal("ios"), v.literal("android"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const existing = await ctx.db
      .query("pushTokens")
      .withIndex("by_user_id_and_token", (q) =>
        q.eq("userId", user._id).eq("token", args.token),
      )
      .unique();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch("pushTokens", existing._id, {
        platform: args.platform,
        updatedAt: now,
      });
      return existing._id;
    }

    return ctx.db.insert("pushTokens", {
      userId: user._id,
      token: args.token,
      platform: args.platform,
      updatedAt: now,
    });
  },
});

export const unregisterToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const existing = await ctx.db
      .query("pushTokens")
      .withIndex("by_user_id_and_token", (q) =>
        q.eq("userId", user._id).eq("token", args.token),
      )
      .unique();

    if (existing) {
      await ctx.db.delete("pushTokens", existing._id);
    }

    return { success: true };
  },
});

export const listMyTokens = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    return ctx.db
      .query("pushTokens")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const sendTestNotification = action({
  args: {
    title: v.optional(v.string()),
    body: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUserIdentity(ctx);
    const env = getServerEnv();

    const rawTokens = await ctx.runQuery(api.push.listMyTokens, {});
    const tokens = pushTokensSchema.parse(rawTokens);
    if (tokens.length === 0) {
      throw new ConvexError("No registered push tokens");
    }

    const messages: ExpoPushMessage[] = tokens.map((tokenEntry) => ({
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

    const result = (await response.json()) as unknown;

    return {
      ok: response.ok,
      status: response.status,
      result,
      tokenCount: tokens.length,
    };
  },
});
