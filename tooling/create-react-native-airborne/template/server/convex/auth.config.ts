import { getServerEnv } from "./env";

const env = getServerEnv();

export default {
  providers: [
    {
      domain: env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
