#!/usr/bin/env node
//
// Deploys the built site to the `gh-pages` branch of THIS repo
// (zackisaza.github.io), which is what serves https://zackisaza.github.io/.
//
// It builds, then replaces the gh-pages tree with `dist/`, re-adding the two
// files Vite does not emit: `.nojekyll` and `404.html` (an exact copy of
// index.html — the SPA fallback so react-router deep links work on Pages).
//
// Usage: npm run deploy

import { execSync } from "child_process";
import { existsSync, rmSync, cpSync, writeFileSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const worktree = join(tmpdir(), `ghp-deploy-${process.pid}`);
const BRANCH = "gh-pages";

const run = (cmd, cwd = root) => execSync(cmd, { cwd, stdio: "inherit" });
const out = (cmd, cwd = root) => execSync(cmd, { cwd, encoding: "utf8" }).trim();

const cleanup = () => {
  try {
    execSync(`git worktree remove "${worktree}" --force`, { cwd: root, stdio: "ignore" });
  } catch {
    /* worktree may not exist yet */
  }
  if (existsSync(worktree)) rmSync(worktree, { recursive: true, force: true });
};

try {
  // 1. Build
  console.log("🔨 Building…");
  run("npm run build");
  if (!existsSync(dist)) throw new Error("dist/ not found after build.");

  // 2. Fresh worktree checked out from origin/gh-pages
  cleanup();
  console.log("📥 Preparing gh-pages worktree…");
  run(`git fetch origin ${BRANCH}`);
  run(`git worktree add -B ${BRANCH} "${worktree}" origin/${BRANCH}`);

  // 3. Replace the published tree with the fresh build
  console.log("📋 Copying build…");
  run("git rm -rf . --quiet", worktree);
  cpSync(dist, worktree, { recursive: true });

  // 4. Files the build does not emit
  writeFileSync(join(worktree, ".nojekyll"), "");
  copyFileSync(join(worktree, "index.html"), join(worktree, "404.html"));

  // 5. Commit + push (skip if nothing changed)
  run("git add -A", worktree);
  if (!out("git status --porcelain", worktree)) {
    console.log("✅ No changes — gh-pages already up to date.");
  } else {
    const stamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    run(`git commit -m "deploy: ${stamp}"`, worktree);
    run(`git push origin ${BRANCH}`, worktree);
    console.log("🚀 Deployed → https://zackisaza.github.io/");
  }
} catch (err) {
  console.error("❌ Deploy failed:", err.message);
  process.exitCode = 1;
} finally {
  cleanup();
}
