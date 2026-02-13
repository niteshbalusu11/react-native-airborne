# AGENTS.md

This file is for engineers and coding agents working in this repository.

## Purpose

`react-native-airborne` is an opinionated Bun workspace starter for mobile apps:

- Expo + Expo Router client
- Expo Router Native Tabs (SDK 55)
- Clerk auth
- Uniwind styling (Tailwind v4)
- Convex backend
- Zustand + MMKV for local non-sensitive preferences
- Expo notifications

The repo also ships a scaffolder package: `tooling/create-react-native-airborne`.

## Monorepo Structure

- `client/`: Expo app (mobile only: iOS + Android)
- `server/`: Convex functions, schema, tests
- `tooling/create-react-native-airborne/`: published create package
- `uniwind/`: local integration docs used for setup decisions
- `Justfile`: top-level task runner
- `.github/workflows/ci.yml`: CI pipeline
- `.github/workflows/publish-create-react-native-airborne.yml`: npm publish + GitHub release on tags

## Tooling Baseline

- Package manager: Bun (`bun@1.3.4`)
- Workspace management: Bun workspaces (root `package.json`)
- Task runner: `just`
- Formatting: Prettier (root `.prettierrc.json`)
- Client lint: Expo ESLint config (flat config)
- Server lint: strict ESLint 9 + `typescript-eslint` + `@convex-dev/eslint-plugin`
- Tests: Vitest (client and server), plus `convex-test` on server

## Essential Commands

From repository root:

- `just install`: install all workspace dependencies
- `just dev`: run client and server together
- `just dev-client`: run Expo only
- `just dev-server`: run Convex only
- `just prebuild`: generate native iOS/Android projects locally
- `just ios`: run iOS app (supports extra Expo CLI args, for example `just ios --device "iPhone 16"`)
- `just android`: run Android app (supports extra Expo CLI args, for example `just android --device "Pixel_8_API_35"`)
- `just fmt`: format client/server with Prettier
- `just lint`: lint both workspaces
- `just typecheck`: typecheck both workspaces
- `just test`: run all tests
- `just ci`: lint + typecheck + tests

## Environment Variables

### Client (`client/.env`)

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (required)
- `EXPO_PUBLIC_CONVEX_URL` (required)
- `EXPO_PUBLIC_EAS_PROJECT_ID` (optional; used for push token registration when needed)

Validation is in `client/src/lib/env-schema.ts`.

### Server (`server/.env`)

- `CLERK_JWT_ISSUER_DOMAIN` (required in real environments)
- `EXPO_PUSH_ENDPOINT` (optional, default Expo endpoint)
- `EXPO_ACCESS_TOKEN` (optional)

Validation is in `server/convex/env.ts`.

## Auth Architecture (Clerk + Expo Router)

- Root providers live in `client/app/_layout.tsx`:
  - `ClerkProvider` with `tokenCache` from `@clerk/clerk-expo/token-cache` (Expo Secure Store, backed by iOS Keychain / Android Keystore)
  - `ConvexProviderWithClerk`
  - `SafeAreaProvider`
- Route guards:
  - `client/app/(auth)/_layout.tsx` redirects signed-in users to `/(app)`
  - `client/app/(app)/_layout.tsx` redirects signed-out users to `/(auth)/sign-in`
- App shell:
  - `client/app/(app)/_layout.tsx` uses `NativeTabs` from `expo-router/unstable-native-tabs`
  - tabs are explicitly registered for `index`, `push`, and `settings`
- Auth screens are custom flows in:
  - `client/app/(auth)/sign-in.tsx`
  - `client/app/(auth)/sign-up.tsx`
- Social auth is included in custom auth screens via Clerk SSO:
  - Google on iOS + Android (`oauth_google`)
  - Apple on iOS only (`oauth_apple`)

Important: never store auth/session tokens in MMKV.

## Uniwind Integration Rules

Uniwind integration is intentionally specific. Keep these rules:

1. `client/global.css` must contain:
   - `@import "tailwindcss";`
   - `@import "uniwind";`
2. Import `../global.css` in `client/app/_layout.tsx`.
3. Keep Metro wrapped by `withUniwindConfig(...)` in `client/metro.config.js` with:
   - `cssEntryFile: "./global.css"`
   - `dtsFile: "./uniwind-types.d.ts"`
4. For third-party components without `className` support (for example `SafeAreaView`), wrap with `withUniwind(...)`.
5. Theming defaults to `system`; explicit `light`/`dark`/`system` is handled by preferences store + theme sync hook:
   - `client/src/store/preferences-store.ts`
   - `client/src/hooks/use-theme-sync.ts`

## Client Data/State Notes

- MMKV + Zustand is used for app preferences, not secrets.
- Convex API imports in client use the alias path:
  - `@convex/_generated/api`
- Alias is configured in `client/tsconfig.json`.

## Convex Backend Notes

- Convex directory: `server/convex/`
- Auth provider config: `server/convex/auth.config.ts`
- Main starter functions:
  - `users.bootstrap`
  - `push.registerToken`
  - `push.unregisterToken`
  - `push.sendTestNotification`
- Schema: `server/convex/schema.ts`
- Regenerate generated types after Convex setup:
  - `cd server && bun run codegen`

## Prebuild Policy

- `just prebuild` is supported for local native runs.
- `client/ios` and `client/android` are intentionally gitignored.
- Do not commit generated native folders in this starter.

## Testing Expectations

- Run `just ci` before handing off significant changes.
- Server tests use `convex-test`; keep tests deterministic and isolated.
- If changing auth/push flows, verify both happy path and obvious edge cases.

## Template Sync Workflow

This repo doubles as the source for the published scaffolder template.

When you change files that should be part of generated projects (root/client/server), sync template:

```bash
cd tooling/create-react-native-airborne
bun run sync-template
```

The sync script copies selected repo paths into `tooling/create-react-native-airborne/template` and rewrites placeholder metadata.
It uses explicit exclude paths so repo-only files (like publish workflow) are not copied into generated app templates.

## CI and Quality Gates

CI (`.github/workflows/ci.yml`) runs:

1. install (`bun install --workspaces`)
2. validate (lint + typecheck + tests for client and server)
3. native Android build on Linux (`arm64-v8a`)
4. native iOS simulator build on `macos-26` (`arm64`)

Publish CI (`.github/workflows/publish-create-react-native-airborne.yml`) runs on tag push, publishes `tooling/create-react-native-airborne` to npm with trusted publishing (GitHub OIDC) when tag version matches package version, and creates a GitHub Release via `gh release create`.

Keep local changes compatible with these checks.

## Common Troubleshooting

- Convex asks for missing env var on startup:
  - set required variable in Convex dashboard deployment environment variables.
- Clerk says user is already signed in on auth pages:
  - ensure route guards are active and auth pages redirect signed-in users.
  - if simulator state is stale, clear app data/reinstall app and retry.
- Social login fails to return to app:
  - verify Google/Apple providers are enabled in Clerk and OAuth redirect URLs are configured for your app scheme.
- Uniwind styles missing:
  - verify `global.css` imports and `withUniwindConfig` metro wrapper.
