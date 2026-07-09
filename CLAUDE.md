# Project context — zackisaza.github.io (portfolio)

Vite + React + Three.js portfolio. Repo: `zackisaza/zackisaza.github.io` (GitHub **user site**, served at the root domain https://zackisaza.github.io/).

- Active development branch: **`2026`**.
- Default branch on remote: `master` (stale).
- Dev server: `npm run dev` (Vite).

## Deploy — how the live site actually updates

The live site is served from the **`gh-pages` branch**, which holds the **built output** (not source). To publish changes you must build and push `dist` to `gh-pages`.

> ⚠️ **The in-repo deploy tooling is STALE — do NOT use it.** Both
> `.github/workflows/deploy.yml` (triggers on push to `2025`) and
> `scripts/deploy.mjs` (`npm run deploy`) build and push to the **old**
> `zackisaza/portfolio2024` repo, which is not the live site. Pushing source
> to `2026`/`master` does **not** deploy.

### Correct manual deploy

```bash
npm run build   # base defaults to '/', outputs dist/ (+ .br/.gz via vite-plugin-compression)

# Push dist to gh-pages, preserving the two files the build does NOT emit:
#   - .nojekyll  (empty file)
#   - 404.html   (an exact copy of index.html — SPA fallback for react-router deep links)
WT=$(mktemp -d)
git worktree add "$WT" gh-pages
git -C "$WT" rm -rf . -q
cp -R dist/. "$WT"/
touch "$WT/.nojekyll"
cp "$WT/index.html" "$WT/404.html"
git -C "$WT" add -A
git -C "$WT" commit -m "deploy: <what changed>"
git -C "$WT" push origin gh-pages
git worktree remove "$WT" --force

# Verify live (the hash must match the fresh build):
curl -s https://zackisaza.github.io/index.html | grep -o 'assets/index-[a-z0-9]*\.js'
```

Public assets (`desktop_pc/`, `planet/`, `arcade/`, `food/`, `projects/`, `tech-icons/`, favicons) live in `public/` and Vite copies them into `dist`, so a clean `dist` replace preserves them.

## Conventions

- Commits: **Spanish conventional commits** (`feat:`, `fix:`, `chore:`), no AI attribution / no `Co-Authored-By`.
- Source code (identifiers, comments, UI strings) is in English; Spanish is used for user-facing copy via the translations layer.
