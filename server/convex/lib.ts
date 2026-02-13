import { ConvexError } from "convex/values";
import type { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";

type CtxWithAuth = Pick<ActionCtx, "auth"> | Pick<MutationCtx, "auth"> | Pick<QueryCtx, "auth">;

export async function requireUserIdentity(ctx: CtxWithAuth) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Unauthorized");
  }
  return identity;
}
