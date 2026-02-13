import { $ } from "bun";
import { readdir, rename, stat } from "node:fs/promises";
import path from "node:path";

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

async function rewriteGitignoreFiles(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const currentPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await rewriteGitignoreFiles(currentPath);
      continue;
    }

    if (entry.name === ".gitignore") {
      await rename(currentPath, path.join(dir, "gitignore"));
    }
  }
}

const repoRoot = toPath("../../..");
const templateRoot = toPath("../template");
const templateAppVersion = "0.1.0";

const includePaths = [
  ".github",
  ".gitignore",
  ".envrc",
  ".agents",
  "AGENTS.md",
  ".prettierignore",
  ".prettierrc.json",
  "Justfile",
  "README.md",
  "flake.nix",
  "flake.lock",
  "package.json",
  "client",
  "server",
];

const excludePaths = [
  ".github/workflows/publish-create-react-native-airborne.yml",
  "client/.expo",
  "client/.env",
  "client/expo-env.d.ts",
  "client/ios",
  "client/android",
  "client/node_modules",
  "client/bun.lock",
  "server/.env.local",
  "server/node_modules",
  "server/bun.lock",
];

function getExcludePatterns(entry: string) {
  const entryPrefix = `${entry}/`;

  return excludePaths
    .filter((path) => path.startsWith(entryPrefix))
    .map((path) => path.slice(entryPrefix.length));
}

await $`rm -rf ${templateRoot}`;
await $`mkdir -p ${templateRoot}`;

for (const entry of includePaths) {
  const sourcePath = resolvePath(repoRoot, entry);
  let sourceStats;
  try {
    sourceStats = await stat(sourcePath);
  } catch {
    continue;
  }
  const excludeArgs = getExcludePatterns(entry).flatMap((pattern) => ["--exclude", pattern]);

  if (sourceStats.isDirectory()) {
    const destinationPath = resolvePath(templateRoot, entry);
    await $`mkdir -p ${destinationPath}`;
    await $`rsync -a ${excludeArgs} ${`${sourcePath}/`} ${`${destinationPath}/`}`;
    continue;
  }

  await $`cp ${sourcePath} ${resolvePath(templateRoot, entry)}`;
}

const rootPackagePath = resolvePath(templateRoot, "package.json");
const rootPackage = await readJson<Record<string, unknown> & { scripts?: Record<string, string> }>(
  rootPackagePath,
);
rootPackage.name = "__APP_NAME__";
rootPackage.version = templateAppVersion;
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

const templateReadmePath = resolvePath(templateRoot, "README.md");
const templateReadme = await Bun.file(templateReadmePath).text();
await Bun.write(
  templateReadmePath,
  templateReadme
    .replace(
      /# React Native Airborne[\s\S]*?## 🧰 What You Get/,
      "# __APP_NAME__\n\nThis project was scaffolded with React Native Airborne.\n\n## 🧰 What You Get",
    )
    .replaceAll("my-app", "__APP_NAME__")
    .replace(
      /It includes a production-ready Expo client, a Convex backend, and a published scaffolder \(`create-react-native-airborne`\) so you can generate new apps with one command\.\n\n/,
      "It includes a production-ready Expo client and a Convex backend.\n\n",
    )
    .replace(/## ✈️ What This Repo Contains[\s\S]*?## 🧰 Stack/, "## 🧰 Stack")
    .replace(
      /## 🗂️ Project Layout[\s\S]*?## ✅ Prerequisites/,
      "## 🗂️ Project Layout\n\n```text\n__APP_NAME__/\n  client/ # Expo app (Expo Router + Native Tabs)\n  server/ # Convex backend\n```\n\n## ✅ Prerequisites",
    )
    .replace(/## 📦 Create (New Projects|a New App)[\s\S]*?(?=\n## )/g, "")
    .replace(/## 🛠️ (Scaffolder|Template) Maintenance[\s\S]*?(?=\n## )/g, "")
    .replace(/## 🚀 Publish to npm[\s\S]*?(?=\n## )/g, "")
    .replace(
      "If you are maintaining the template itself (not just using it), see `AGENTS.md` for internal workflow and release details.",
      "See `AGENTS.md` for implementation notes and project conventions.",
    ),
);

const templateAgentsPath = resolvePath(templateRoot, "AGENTS.md");
const templateAgents = await Bun.file(templateAgentsPath).text();
await Bun.write(
  templateAgentsPath,
  templateAgents
    .replace(
      /\nThe repo also ships a scaffolder package: `tooling\/create-react-native-airborne`\.\n/,
      "\n",
    )
    .replace(/\n- `\.github\/workflows\/publish-create-react-native-airborne\.yml`:[^\n]*/, "")
    .replace(/\n- `tooling\/create-react-native-airborne\/`: published create package/, "")
    .replace(
      /\nThe sync script copies selected repo paths into `tooling\/create-react-native-airborne\/template` and rewrites placeholder metadata\.\nIt also removes repo-specific publish workflow files that should not be included in generated app templates\.\n/,
      "\n",
    )
    .replace(
      /\nPublish CI \(`\.github\/workflows\/publish-create-react-native-airborne\.yml`\)[^\n]*\n/g,
      "",
    )
    .replace(/## Template Sync Workflow[\s\S]*?## CI and Quality Gates/, "## CI and Quality Gates"),
);

await rewriteGitignoreFiles(templateRoot);

console.log("Template synced.");
