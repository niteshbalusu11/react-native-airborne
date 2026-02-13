# React Native Airborne

Opinionated React Native starter for mobile-first apps with Expo + Convex.

## Stack

- Bun workspaces monorepo (`client/`, `server/`)
- Expo + Expo Router
- Uniwind + Tailwind v4
- Clerk authentication
- Convex backend + `convex-test`
- Zustand + MMKV persistence
- Expo push notifications

## Quickstart

```bash
bun install --workspaces
cp client/.env.example client/.env
cp server/.env.example server/.env
just dev
```

## Commands

- `just dev`: start Expo + Convex
- `just ios`: launch iOS app
- `just android`: launch Android app
- `just lint`: lint/type lint checks
- `just typecheck`: TypeScript checks
- `just test`: client + server tests
- `just ci`: lint + typecheck + tests

## Environment Variables

### Client (`client/.env`)

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_EAS_PROJECT_ID` (optional)

### Server (`server/.env`)

- `CLERK_JWT_ISSUER_DOMAIN`
- `EXPO_PUSH_ENDPOINT` (optional)
- `EXPO_ACCESS_TOKEN` (optional)

## Scaffolder

This repo includes `create-react-native-airborne` under `tooling/create-react-native-airborne`.

After publishing:

```bash
bun create react-native-airborne my-app
```

## Notes

- Mobile-only target (iOS/Android).
- Do not store sensitive auth tokens in MMKV.
- Uniwind classes are enabled by `client/global.css` and `client/metro.config.js`.
- `server/convex/_generated` ships with starter stubs so typecheck/tests pass before deployment setup.
  After connecting Convex, run `cd server && bun run codegen` to regenerate.
