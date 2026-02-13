import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserIdentity } from "./lib";

export const bootstrap = mutation({
  args: {
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const identity = await requireUserIdentity(ctx);
    const now = Date.now();

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q: any) =>
        q.eq("clerkUserId", identity.subject),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email ?? existing.email,
        name: args.name ?? existing.name,
        imageUrl: args.imageUrl ?? existing.imageUrl,
        lastSeenAt: now,
      });
      return existing._id;
    }

    return ctx.db.insert("users", {
      clerkUserId: identity.subject,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      lastSeenAt: now,
    });
  },
});

export const current = query({
  args: {},
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q: any) =>
        q.eq("clerkUserId", identity.subject),
      )
      .unique();
  },
});
