# Airborne Client

Expo Router app configured for:

- Clerk authentication (email/password + Google, with Apple on iOS)
- Convex client integration
- Uniwind (Tailwind v4)
- Zustand + MMKV local state persistence
- Expo push notifications

## Run

```bash
bun install
bun run start
```

Generate native folders locally when you need native runs:

```bash
bunx expo prebuild --platform all
```

Then use:

- `bun run ios`
- `bun run android`

## Required env (`.env`)

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_EAS_PROJECT_ID` (optional)

Also enable Google and Apple OAuth providers in Clerk for social login flows.
Clerk session tokens use `@clerk/clerk-expo/token-cache` with `expo-secure-store` (iOS Keychain / Android Keystore).
