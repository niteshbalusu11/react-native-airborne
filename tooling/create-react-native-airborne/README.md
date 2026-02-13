# create-react-native-airborne

Create projects from the React Native Airborne template.

## Usage

```bash
bun create react-native-airborne my-app
```

## Flags

- `--skip-install`: skip `bun install --workspaces`
- `--no-git`: skip `git init`

## Development

From repo root:

```bash
cd tooling/create-react-native-airborne && bun run sync-template
```

This refreshes `template/` from the current root starter files.
