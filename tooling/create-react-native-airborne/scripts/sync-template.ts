import { $ } from "bun";

function toPath(relativeUrl: string) {
  return decodeURIComponent(new URL(relativeUrl, import.meta.url).pathname).replace(/\/$/, "");
}

function resolvePath(...parts: string[]) {
  return parts.join("/").replace(/\/+/g, "/");
}

async function readJson<T>(path: string) {
  return JSON.parse(await Bun.file(path).text()) as T;
}

async function writeJson(path: string, value: unknown) {
  await Bun.write(path, `${JSON.stringify(value, null, 2)}\n`);
}

const repoRoot = toPath("../../..");
const templateRoot = toPath("../template");

const includePaths = [
  ".github",
  ".gitignore",
  ".agents",
  "AGENTS.md",
  ".prettierignore",
  ".prettierrc.json",
  "Justfile",
  "README.md",
  "package.json",
  "client",
  "server",
];

await $`rm -rf ${templateRoot}`;
await $`mkdir -p ${templateRoot}`;

for (const entry of includePaths) {
  if (entry === "client") {
    const clientSource = `${resolvePath(repoRoot, "client")}/`;
    const clientDestination = `${resolvePath(templateRoot, "client")}/`;
    await $`rsync -a --exclude .expo --exclude ios --exclude android --exclude node_modules --exclude bun.lock ${clientSource} ${clientDestination}`;
    continue;
  }

  if (entry === "server") {
    const serverSource = `${resolvePath(repoRoot, "server")}/`;
    const serverDestination = `${resolvePath(templateRoot, "server")}/`;
    await $`rsync -a --exclude node_modules --exclude bun.lock ${serverSource} ${serverDestination}`;
    continue;
  }

  const sourcePath = resolvePath(repoRoot, entry);
  const destinationPath = resolvePath(templateRoot, entry);
  await $`cp -R ${sourcePath} ${destinationPath}`;
}

await $`find ${templateRoot} -name node_modules -type d -prune -exec rm -rf {} +`;
await $`find ${templateRoot} -name bun.lock -type f -delete`;

const rootPackagePath = resolvePath(templateRoot, "package.json");
const rootPackage = await readJson<Record<string, unknown> & { scripts?: Record<string, string> }>(
  rootPackagePath,
);
rootPackage.name = "__APP_NAME__";
rootPackage.workspaces = ["client", "server"];
if (rootPackage.scripts) {
  delete rootPackage.scripts["install:all"];
}
await writeJson(rootPackagePath, rootPackage);

const clientAppConfigPath = resolvePath(templateRoot, "client", "app.config.ts");
const clientAppConfig = await Bun.file(clientAppConfigPath).text();
await Bun.write(
  clientAppConfigPath,
  clientAppConfig
    .replaceAll("React Native Airborne", "__APP_NAME__")
    .replaceAll("react-native-airborne", "__APP_SLUG__")
    .replaceAll("com.airborne.starter", "__APP_BUNDLE_ID__"),
);

const clientPackagePath = resolvePath(templateRoot, "client", "package.json");
const clientPackage = await readJson<Record<string, unknown>>(clientPackagePath);
clientPackage.name = "client";
await writeJson(clientPackagePath, clientPackage);

const serverPackagePath = resolvePath(templateRoot, "server", "package.json");
const serverPackage = await readJson<Record<string, unknown>>(serverPackagePath);
serverPackage.name = "server";
await writeJson(serverPackagePath, serverPackage);

console.log("Template synced.");
