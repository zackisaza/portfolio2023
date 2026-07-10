# Project context — zackisaza.github.io (portfolio)

Personal portfolio. **Vite + React 18 + Three.js** (react-three-fiber/drei), Tailwind, framer-motion. Repo `zackisaza/zackisaza.github.io` is a GitHub **user site** served at the root domain https://zackisaza.github.io/.

- Dev branch: **`2026`** · remote default `master` (stale) · live branch **`gh-pages`** (built output).
- `npm run dev` (Vite) · `npm run build` · `npm run deploy` (see Deploy) · `npm run lint`.
- Heavy 3D everywhere; each canvas self-gates to the viewport (its own `IntersectionObserver` toggles `frameloop`/mount) to save GPU.

## Layout & section map

`src/App.jsx` renders the sections top-to-bottom, each wrapped in a colored band with a mountain-silhouette **`.section-transition`** between them (the `pt-[360px]`/`pt-[…]` offsets clear that overlay). Section → component → styles:

| Section | Component(s) | Styles / canvas |
|---|---|---|
| Navbar | `Navbar.jsx`, `LanguageToggle.jsx`, `SideNavbar.jsx` | `styles.js` |
| Hero | `Hero.jsx` | 3D PC `canvas/Computers.jsx` (lazy) |
| About | `About.jsx` | `styles.js` |
| Projects | `Projects.jsx`, `ArcadeFighters.jsx` | **`arcade.css`** (CSS-only arcade cabinet) |
| Experience | `Experience.jsx` | `bento.css` |
| Stack | `Tech.jsx` | **`sushiroom.css`** (CodePen sushi room) |
| Services/Works | `Works.jsx` (orchestrator) + `services/ProjectCard.jsx` (the TCG card + card data/EnergySymbol), `PokemonBackground.jsx` (Game Boy), `BoosterBox3D.jsx` (3D pack) | **`pokemon.css`**, card styles in `index.css` (`.tcg-card`, `.box3d-wrap`) |
| My Startup | `MyCompany.jsx` | wolfcave 3D |
| Contact | `Contact.jsx` | 3D globe `canvas/Earth.jsx` (lazy) |
| Footer | `Footer.jsx` | |

Shared: `hoc/SectionWrapper.jsx` (adds `styles.padding max-w-7xl mx-auto`), `styles.js` (typography/padding tokens), `translations/index.js` + `context/LanguageContext` (i18n; `useLanguage()` → `t()`/`language`), `index.css` (global + TCG card + 3D-box styles).

Contexts (`src/context/`): `LanguageContext`, `ServicesGameContext` (Game Boy state, below), `BallSlotsContext`. (There was a `CanvasBudgetContext` + `SectionSentinel` "GPU budget" system — removed as dead code: its setters were never called, so it never suspended anything; each canvas already self-gates via its own observer.)

## The Game Boy / cards subsystem (Services section)

Two sibling components coordinated by **`ServicesGameContext`** (`opened`, `selected`, `flipped`, `pressA/pressB/move`, `registerBoxTrigger`):
- **`PokemonBackground.jsx`** = the Game Boy console: absolute-positioned green LCD (`.gb-screen`/`.gb-lcd` with a drifting Kanto sprite swarm), D-pad, A/B, START/SELECT, speaker, and the in-LCD tutorial (`.gb-tutorial`). The A button opens the box; the D-pad changes the selected card; B flips it.
- **`Works.jsx`** = the Pokémon TCG cards + the openable **`BoosterBox3D`** booster pack. Desktop deals the cards into a poker-hand fan (`origin.on`-driven `deal`/`openProgress`); mobile skips the fan (`origin.on` false → cards shown flat).
- Initial state `opened` starts `false` (box closed) except for reduced-motion users. `BoosterBox3D` has `<WebGLBoundary onFail={onOpen}>` — if WebGL can't init it auto-opens (this fires in headless, so the closed state can't be tested headlessly).

## Mobile-responsive notes (breakpoint: Tailwind `sm` = 640px; mobile = `<640`)

Desktop is considered done — mobile work is scoped to base classes / `@media (max-width: 639px)` (or `767px` for the arcade), leaving `sm:`/`xl:` for desktop. When touching a shared file, keep desktop untouched.

- **Hero** (`Hero.jsx`, `Navbar.jsx`, `LanguageToggle.jsx`): navbar left flex needs `min-w-0` + `truncate` or the language toggle overlaps the name. WolfCave card is `hidden lg:inline-flex`. The 3D PC container top offset and the text block's negative `mt` position it on mobile.
- **Projects / arcade** (`arcade.css` `@media (max-width:767px)`): the entire cabinet scales from one unit `--u` (`clamp(8px,2.7vw,13px)`) and width `--w:36`. **The coin box `.bot` is bottom-anchored; the body is top-anchored — they must touch or the page bg shows through and splits the cabinet. Formula: `.arcade height = 40.75u + .screen height`.** Controls sit in the reserved bottom strip.
- **Stack / sushi** (`Tech.jsx`): the 620×400 scene is scaled to fit width; on mobile it's a **zoom** (`zoom = 2.04`, `scale = (clientWidth/620)*zoom`) re-centred with a computed `translateX` while `.sushi-world` clips the overscan.
- **Services / Game Boy** (`pokemon.css` `@media (max-width:639px)` + `App.jsx`): section is `pb-[640px]` to reserve the control deck. `.gb-screen` uses `top: 800px` + `bottom: 600px` (so its height auto-follows the section) at `8%` side inset (= Pokédex width). Cards live in a wrapper that **collapses when closed** (animates `grid-template-rows: 0fr → 1fr` + opacity, 1500ms — grows to the exact content height, smoother than the old `max-height`) and is `display:contents` on desktop so the fan is untouched; growing it grows the section, and the screen follows. On desktop the cards are instead hidden by the deal transform's opacity (`origin.on` default `true` so they start hidden even before the layout measurement lands). Closed state: `.pkmn-hand.pkmn-closed { min-height }` gives the absolute box a stage; `.pkmn-hand .box3d-wrap` is resized and centred with `left:50%; transform: translate(-50%, …)` (margin:auto left-aligns it because the box is wider than the hand).
- **Contact** (`Contact.jsx` + `App.jsx`): **flexbox gotcha** — the section has `mx-auto` and sits in a flex-column wrapper, so auto cross-axis margins disabled stretch and it sized to its content (the Earth `<canvas>`), overflowing right. Fix on the wrapper: `[&>section]:w-full [&>section]:min-w-0`. Content is centred on mobile; globe/text use `translate` offsets.

## Gotchas

- **Do not take screenshots on your own** — the user provides them. If you must verify layout, measure bounding boxes numerically (Playwright `evaluate`), not captures.
- The site **never fires `networkidle`** (continuous 3D) — headless navigation must use `domcontentloaded` + a fixed wait.
- A global `* { font-family }` (index.css) overrides `Press Start 2P` on leaf text spans — set the pixel font directly on the leaf.
- There can be two dev servers from the same files (user's on 5173, another on 5174); both HMR.

## Deploy

Live site = **`gh-pages` branch** (built output). To publish:

```bash
npm run deploy   # builds, then pushes dist/ to gh-pages (adds .nojekyll + 404.html = index.html for the SPA fallback), skips if unchanged
```

Or manually / via CI:
- `.github/workflows/deploy.yml` — manual **workflow_dispatch** (Actions tab → Run workflow); builds + deploys `dist` to this repo's `gh-pages` via the built-in `GITHUB_TOKEN`.
- Verify live: `curl -s https://zackisaza.github.io/index.html | grep -o 'assets/index-[a-z0-9]*\.js'` must match the fresh build hash.

Public assets (`desktop_pc/`, `planet/`, `arcade/`, `food/`, `projects/`, `tech-icons/`, favicons) live in `public/` and are copied into `dist` by the build.

## Conventions

- Commits: **Spanish conventional commits** (`feat:`/`fix:`/`chore:`/`docs:`), no AI attribution / no `Co-Authored-By`.
- Source (identifiers, comments, UI strings) in **English**; user-facing Spanish copy goes through `translations/index.js`.
