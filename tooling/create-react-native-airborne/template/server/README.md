# Airborne Server

Convex backend configured with:

- Clerk JWT auth provider (`convex/auth.config.ts`)
- User bootstrap/query functions
- Push token registration/removal
- Test notification action via Expo push endpoint
- `convex-test` + Vitest backend tests

## Run

```bash
bun install
bun run dev
```

## Codegen

The starter includes checked-in `convex/_generated` stubs to keep fresh clones runnable.
After you connect a Convex deployment, regenerate official files:

```bash
bun run codegen
```

## Required env (`.env`)

- `CLERK_JWT_ISSUER_DOMAIN`
- `EXPO_PUSH_ENDPOINT` (optional)
- `EXPO_ACCESS_TOKEN` (optional)
