#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile, copyFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith("--")));
const projectNameArg = args.find((arg) => !arg.startsWith("--"));

if (!projectNameArg) {
  console.error(
    "Usage: bun create react-native-airborne <project-name> [--skip-install] [--no-git] [--nix]",
  );
  process.exit(1);
}

const projectName = projectNameArg.trim();
const projectSlug = projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
const targetDir = path.resolve(process.cwd(), projectName);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.resolve(__dirname, "../template");
const enableNix = flags.has("--nix");

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyDirectory(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destName = entry.name === "gitignore" ? ".gitignore" : entry.name;
    const destPath = path.join(dest, destName);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function replaceTokens(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await replaceTokens(filePath);
      continue;
    }

    if (!/\.(json|md|ts|tsx|js|css|yml|yaml|env|toml|txt)$/.test(entry.name)) {
      continue;
    }

    const content = await readFile(filePath, "utf8");
    const updated = content
      .replaceAll("__APP_NAME__", projectName)
      .replaceAll("__APP_SLUG__", projectSlug)
      .replaceAll("__APP_BUNDLE_ID__", `com.${projectSlug.replace(/-/g, "")}.app`);

    if (updated !== content) {
      await writeFile(filePath, updated, "utf8");
    }
  }
}

if (await exists(targetDir)) {
  const contents = await readdir(targetDir);
  if (contents.length > 0) {
    console.error(`Target directory is not empty: ${targetDir}`);
    process.exit(1);
  }
}

await copyDirectory(templateDir, targetDir);
await replaceTokens(targetDir);

if (!enableNix) {
  const optionalNixFiles = [".envrc", "flake.nix", "flake.lock"];
  for (const file of optionalNixFiles) {
    await rm(path.join(targetDir, file), { force: true });
  }
}

if (!flags.has("--skip-install")) {
  const install = spawnSync("bun", ["install", "--workspaces"], {
    cwd: targetDir,
    stdio: "inherit",
  });

  if (install.status !== 0) {
    process.exit(install.status ?? 1);
  }
}

if (!flags.has("--no-git")) {
  spawnSync("git", ["init"], { cwd: targetDir, stdio: "inherit" });
}

console.log(`\nCreated ${projectName} at ${targetDir}`);
console.log("\nNext steps:");
console.log(`  cd ${projectName}`);
console.log("  cp client/.env.example client/.env");
console.log("  cp server/.env.example server/.env");
if (enableNix) {
  console.log("  direnv allow");
}
console.log("  just dev");
