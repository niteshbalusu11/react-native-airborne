import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const templateRoot = path.resolve(__dirname, "../template");

const includePaths = [
  ".github",
  ".gitignore",
  ".prettierignore",
  ".prettierrc.json",
  "Justfile",
  "README.md",
  "package.json",
  "client",
  "server",
];

await rm(templateRoot, { recursive: true, force: true });
await mkdir(templateRoot, { recursive: true });

for (const entry of includePaths) {
  await cp(path.join(repoRoot, entry), path.join(templateRoot, entry), {
    recursive: true,
    filter(source) {
      const rel = path.relative(repoRoot, source);
      if (
        rel.includes("node_modules") ||
        rel.includes(".expo") ||
        rel.endsWith("bun.lock") ||
        rel === "client/ios" ||
        rel.startsWith("client/ios/") ||
        rel === "client/android" ||
        rel.startsWith("client/android/") ||
        rel.includes("/ios/Pods") ||
        rel.includes("/ios/build") ||
        rel.includes("/android/.gradle") ||
        rel.includes("/android/build") ||
        rel.includes("/android/app/build")
      ) {
        return false;
      }
      return true;
    },
  });
}

const rootPackagePath = path.join(templateRoot, "package.json");
const rootPackage = JSON.parse(await readFile(rootPackagePath, "utf8"));
rootPackage.name = "__APP_NAME__";
rootPackage.workspaces = ["client", "server"];
delete rootPackage.scripts?.["install:all"];
await writeFile(rootPackagePath, `${JSON.stringify(rootPackage, null, 2)}\n`, "utf8");

const clientAppConfigPath = path.join(templateRoot, "client", "app.config.ts");
const clientAppConfig = await readFile(clientAppConfigPath, "utf8");
await writeFile(
  clientAppConfigPath,
  clientAppConfig
    .replaceAll("React Native Airborne", "__APP_NAME__")
    .replaceAll("react-native-airborne", "__APP_SLUG__")
    .replaceAll("com.airborne.starter", "__APP_BUNDLE_ID__"),
  "utf8",
);

const clientPackagePath = path.join(templateRoot, "client", "package.json");
const clientPackage = JSON.parse(await readFile(clientPackagePath, "utf8"));
clientPackage.name = "client";
await writeFile(clientPackagePath, `${JSON.stringify(clientPackage, null, 2)}\n`, "utf8");

const serverPackagePath = path.join(templateRoot, "server", "package.json");
const serverPackage = JSON.parse(await readFile(serverPackagePath, "utf8"));
serverPackage.name = "server";
await writeFile(serverPackagePath, `${JSON.stringify(serverPackage, null, 2)}\n`, "utf8");

console.log("Template synced.");
