import { ConvexReactClient } from "convex/react";
import { getClientEnv } from "@/src/lib/env";

const env = getClientEnv();

export const convexClient = new ConvexReactClient(env.convexUrl);
