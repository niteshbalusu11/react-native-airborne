set shell := ["zsh", "-cu"]

install:
  bun install --workspaces

fmt:
  bunx prettier --write client server

prebuild:
  cd client && bunx expo prebuild --platform all

dev:
  bunx concurrently -n CLIENT,SERVER -c blue,green "just dev-client" "just dev-server"

dev-client:
  cd client && bun run start

dev-server:
  cd server && bun run dev

ios:
  cd client && bun run ios

android:
  cd client && bun run android

lint:
  cd client && bun run lint
  cd server && bun run lint

typecheck:
  cd client && bun run typecheck
  cd server && bun run typecheck

test:
  cd client && bun run test
  cd server && bun run test

test-client:
  cd client && bun run test

test-server:
  cd server && bun run test

ci:
  just lint
  just typecheck
  just test
