# Airborne Client

Expo Router app configured for:

- Clerk authentication
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
