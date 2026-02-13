# React Native Airborne

Opinionated React Native starter for mobile-first apps with Expo + Convex.

## 🧰 Stack

- Bun workspaces monorepo (`client/`, `server/`)
- Expo + Expo Router + Native Tabs (SDK 55)
- Uniwind + Tailwind v4
- Clerk authentication
- Convex backend + `convex-test`
- Zustand + MMKV persistence
- Expo push notifications

## 🤝 Contributor Guide

Detailed implementation and maintenance notes for engineers/agents live in `AGENTS.md`.

## ✅ Prerequisites

- Bun `1.3.4+`
- `just` command runner
- Expo toolchain for iOS/Android simulators
- Clerk app + Convex project

## ⚡ Quickstart

```bash
bun install --workspaces
cp client/.env.example client/.env
cp server/.env.example server/.env
```

First-time Convex setup (one-time per new deployment):

```bash
cd server
bun run dev
```

Then run both apps:

```bash
just dev
```

## 🧪 Commands

- `just dev`: start Expo + Convex
- `just dev-client`: start Expo only
- `just dev-server`: start Convex only
- `just fmt`: run Prettier on client and server
- `just prebuild`: generate local iOS/Android native folders
- `just ios`: launch iOS app
- `just android`: launch Android app
- `just lint`: lint/type lint checks
- `just typecheck`: TypeScript checks
- `just test`: client + server tests
- `just test-client`: client tests only
- `just test-server`: server tests only
- `just ci`: lint + typecheck + tests

## 📱 Native Projects

Generate native projects locally when needed:

```bash
just prebuild
```

`client/ios` and `client/android` are intentionally gitignored and should not be committed.

## 🔐 Environment Variables

### Client (`client/.env`)

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_EAS_PROJECT_ID` (optional)

### Server (`server/.env`)

- `CLERK_JWT_ISSUER_DOMAIN`
- `EXPO_PUSH_ENDPOINT` (optional)
- `EXPO_ACCESS_TOKEN` (optional)

## 🛠️ Scaffolder Maintenance

This repo is also the source template for `create-react-native-airborne`.

After changing starter files in root/client/server, sync the published template:

```bash
cd tooling/create-react-native-airborne
bun run sync-template
```

## 📦 Scaffolder

This repo includes `create-react-native-airborne` under `tooling/create-react-native-airborne`.

After publishing:

```bash
bun create react-native-airborne@latest my-app
```

## 🚀 Publish to npm

Publishing is automated via GitHub Actions on tag push.

- Supported tags:
  - `v<version>` (example: `v0.2.0`)
  - `create-react-native-airborne@<version>` (example: `create-react-native-airborne@0.2.0`)
- Tag version must match `tooling/create-react-native-airborne/package.json` version.
- Uses npm trusted publishing via GitHub OIDC (no `NPM_TOKEN` secret).
- A GitHub Release is created for the same tag in the same workflow run.

## 📝 Notes

- Mobile-only target (iOS/Android).
- Do not store sensitive auth tokens in MMKV.
- Uniwind classes are enabled by `client/global.css` and `client/metro.config.js`.
- `SafeAreaView` is wrapped with `withUniwind` in `client/src/components/screen.tsx` for className support.
- `server/convex/_generated` ships with starter stubs so typecheck/tests pass before deployment setup.
  After connecting Convex, run `cd server && bun run codegen` to regenerate.
