# React Native Airborne

React Native Airborne is an opinionated mobile starter for teams that want to ship iOS/Android apps fast without repeating the same setup every project.

It includes a production-ready Expo client, a Convex backend, and a published scaffolder (`create-react-native-airborne`) so you can generate new apps with one command.

## ✈️ What This Repo Contains

- Source starter code used for development and maintenance.
- Scaffolder package source at `tooling/create-react-native-airborne`.
- Synced template output at `tooling/create-react-native-airborne/template`.
- CI pipelines for validation and native builds.

## 🧰 Stack

- Bun workspaces monorepo (`client/`, `server/`)
- Expo + Expo Router + Native Tabs (SDK 55)
- Uniwind + Tailwind v4
- Clerk authentication
- Convex backend + `convex-test`
- Zustand + MMKV persistence
- Expo push notifications
- Strict ESLint + Prettier setup

## 🎯 Opinionated Defaults

- Mobile-only target (iOS/Android), no web target in starter scope.
- Expo prebuild supported for local native debugging, but `client/ios` and `client/android` are not committed.
- Clerk + Convex integration wired from day one.
- Theme system includes `light`, `dark`, and `system` with persisted preference.
- Auth tokens are kept in secure storage flows, not MMKV.

## 🗂️ Project Layout

```text
react-native-airborne/
  client/                              # Expo app (Expo Router + Native Tabs)
  server/                              # Convex backend
  tooling/create-react-native-airborne # Published scaffolder package
```

## ✅ Prerequisites

- Bun `1.3.4+`
- `just` command runner
- Expo toolchain for iOS/Android simulators
- Clerk app configured for native API
- Convex project/deployment

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

Run both client and server:

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
- `just lint`: lint checks
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

Client (`client/.env`):

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_EAS_PROJECT_ID` (optional)

Server (`server/.env`):

- `CLERK_JWT_ISSUER_DOMAIN`
- `EXPO_PUSH_ENDPOINT` (optional)
- `EXPO_ACCESS_TOKEN` (optional)

## 📦 Create New Projects

After publishing:

```bash
bun create react-native-airborne@latest my-app
```

This generates a new app from the synced template with root/client/server `.gitignore` files correctly created.

## 🛠️ Template Maintenance

After changing starter files in root/client/server, sync the published template:

```bash
cd tooling/create-react-native-airborne
bun run sync-template
```

Template sync uses explicit include/exclude paths so repo-only files are not copied into generated projects.

## 🚀 Publish to npm

Publishing is automated via GitHub Actions on tag push.

- Supported tags:
  - `v<version>` (example: `v0.2.0`)
  - `create-react-native-airborne@<version>` (example: `create-react-native-airborne@0.2.0`)
- Tag version must match `tooling/create-react-native-airborne/package.json` version.
- Uses npm trusted publishing via GitHub OIDC.
- A GitHub Release is created for the same tag in the same workflow run.

## 🤝 Contributor Guide

Detailed implementation and maintenance notes for engineers/agents live in `AGENTS.md`.

## 📝 Notes

- Uniwind classes are enabled by `client/global.css` and `client/metro.config.js`.
- `SafeAreaView` is wrapped with `withUniwind` in `client/src/components/screen.tsx` for className support.
- `server/convex/_generated` ships with starter stubs so typecheck/tests pass before deployment setup.
- After connecting Convex, run `cd server && bun run codegen` to regenerate server types.
