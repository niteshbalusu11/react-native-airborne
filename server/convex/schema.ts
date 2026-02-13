import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    lastSeenAt: v.number(),
  }).index("by_clerk_user_id", ["clerkUserId"]),

  pushTokens: defineTable({
    userId: v.id("users"),
    token: v.string(),
    platform: v.optional(v.union(v.literal("ios"), v.literal("android"))),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_token", ["token"])
    .index("by_user_id_and_token", ["userId", "token"]),
});
