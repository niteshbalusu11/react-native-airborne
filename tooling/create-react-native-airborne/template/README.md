# __APP_NAME__

This project was scaffolded with React Native Airborne.

## 🧰 What You Get

- Bun workspaces monorepo (`client/`, `server/`)
- Expo + Expo Router + Native Tabs (SDK 55)
- Uniwind + Tailwind v4
- Clerk auth flows
- Convex backend + `convex-test`
- Zustand + MMKV for non-sensitive local preferences
- Expo push notifications
- Strict ESLint + Prettier + tests

## 🗂️ Generated Project Layout

```text
__APP_NAME__/
  client/  # Expo app
  server/  # Convex backend
```

## ✅ Prerequisites

- Bun `1.3.4+`
- `just` command runner
- Expo toolchain for iOS/Android simulators/devices
- Clerk app with native API enabled
- Convex project/deployment

## ⚡ Quickstart (After Scaffolding)

```bash
cd __APP_NAME__
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
- Uniwind is configured via `client/global.css` and `client/metro.config.js`.
- `SafeAreaView` is wrapped with `withUniwind` in `client/src/components/screen.tsx`.
- `server/convex/_generated` ships with starter stubs; after connecting Convex, run `cd server && bun run codegen`.
- `.direnv/` is gitignored by default.

## 🤝 Contributing

See `AGENTS.md` for implementation notes and project conventions.

## 📄 License

MIT
