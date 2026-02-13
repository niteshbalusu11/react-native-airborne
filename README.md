# React Native Airborne

React Native Airborne is an opinionated starter template for building mobile apps (iOS/Android) with Expo + Convex + Clerk.

The goal is to remove repetitive setup so you can scaffold a new production-ready app quickly.

## 📦 Create a New App

```bash
bun create react-native-airborne@latest my-app
```

Optional Nix setup:

```bash
bun create react-native-airborne@latest my-app --nix
cd my-app
direnv allow
```

`--nix` keeps root-level `flake.nix`, `flake.lock`, and `.envrc`.  
Without `--nix`, those files are omitted.

## 🧰 What You Get

- Bun workspaces monorepo (`client/`, `server/`)
- Expo + Expo Router + Native Tabs (SDK 55)
- Uniwind + Tailwind v4
- Clerk auth flows (email/password + Google, with Apple on iOS)
- Convex backend + `convex-test`
- Zustand + MMKV for non-sensitive local preferences
- Expo push notifications
- Strict ESLint + Prettier + tests

## 🗂️ Generated Project Layout

```text
my-app/
  client/  # Expo app
  server/  # Convex backend
```

## ✅ Prerequisites

- Bun `1.3.4+`
- `just` command runner
- Expo toolchain for iOS/Android simulators/devices
- Clerk app with native API enabled
- Clerk OAuth providers configured for Google and Apple
- Convex project/deployment

## ⚡ Quickstart (After Scaffolding)

```bash
cd my-app
bun install --workspaces
cp client/.env.example client/.env
cp server/.env.example server/.env
```

First-time Convex setup (once per deployment):

```bash
cd server
bun run dev
```

Then run app + backend together:

```bash
just dev
```

## 🔐 Environment Variables

Client (`client/.env`):

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (required)
- `EXPO_PUBLIC_CONVEX_URL` (required)
- `EXPO_PUBLIC_EAS_PROJECT_ID` (optional)

Server (`server/.env`):

- `CLERK_JWT_ISSUER_DOMAIN` (required in real environments)
- `EXPO_PUSH_ENDPOINT` (optional)
- `EXPO_ACCESS_TOKEN` (optional)

## 🧪 Common Commands

- `just dev`: start Expo + Convex
- `just dev-client`: start Expo only
- `just dev-server`: start Convex only
- `just prebuild`: generate local iOS/Android folders
- `just ios`: launch iOS app
- `just android`: launch Android app
- `just fmt`: format client/server
- `just lint`: lint checks
- `just typecheck`: TypeScript checks
- `just test`: client + server tests
- `just ci`: lint + typecheck + tests

## 📱 Native Folder Policy

`just prebuild` is supported for local native runs.  
`client/ios` and `client/android` are generated locally and should not be committed.

## 📝 Notes

- Theme support is built-in for `light`, `dark`, and `system`.
- Do not store sensitive auth/session tokens in MMKV.
- Clerk session tokens are persisted via `@clerk/clerk-expo/token-cache` using `expo-secure-store` (iOS Keychain / Android Keystore).
- Social login uses Clerk OAuth (`oauth_google`, `oauth_apple`), with Apple shown only on iOS.
- Uniwind is configured via `client/global.css` and `client/metro.config.js`.
- `SafeAreaView` is wrapped with `withUniwind` in `client/src/components/screen.tsx`.
- `server/convex/_generated` ships with starter stubs; after connecting Convex, run `cd server && bun run codegen`.
- `.direnv/` is gitignored by default.
- You can pass Expo flags through `just ios`/`just android`, for example: `just ios --device "iPhone 16"` or `just android --device "Pixel_8_API_35"`.

## 🤝 Contributing

If you are maintaining the template itself (not just using it), see `AGENTS.md` for internal workflow and release details.

## 📄 License

MIT
