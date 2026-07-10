# Zack Isaza — Portfolio

An interactive, 3D‑driven personal portfolio built around a retro/Japanese visual theme. Every section is its own little world: a 3D workstation hero, a playable‑looking arcade cabinet, a revolving sushi‑bar tech stack, and a Game Boy that deals a hand of Pokémon‑style trading cards for the services on offer.

🔗 **Live:** https://zackisaza.github.io/

> Fully responsive (desktop + mobile) and bilingual (English / Spanish).

---

## ✨ Highlights

- **Real‑time 3D** with React Three Fiber — a workstation, a booster‑box that tears open, an interactive globe, and a starfield, each viewport‑gated so the GPU only works on what's on screen.
- **Themed sections**, each with its own hand‑built look:
  | Section | Concept |
  |---|---|
  | Hero | 3D desktop PC + availability card |
  | Projects | CSS‑only arcade cabinet |
  | Experience | Bento‑grid timeline |
  | Stack | Revolving *kaiten* sushi bar carrying the tech logos |
  | Services | Game Boy console that opens a booster box and fans out TCG cards |
  | Startup | Interactive 3D logo (WolfCave) |
  | Contact | 3D globe + direct WhatsApp/email links |
- **Bilingual i18n** (EN/ES) via a lightweight React context + a translations dictionary.
- **Motion**: Framer Motion for UI choreography, custom RAF loops for the 3D scenes, all honoring `prefers-reduced-motion`.

## 🛠 Tech Stack

- **Framework:** React 18 + Vite
- **3D:** Three.js · @react-three/fiber · @react-three/drei
- **Animation:** Framer Motion
- **Styling:** Tailwind CSS (+ scoped component CSS for the arcade, sushi bar and Game Boy)
- **Routing:** React Router
- **Deploy:** GitHub Pages (`gh-pages` branch)

## 🚀 Getting Started

Requires **Node 18+** (see `.nvmrc`).

```bash
# install
npm install

# start the dev server (http://localhost:5173)
npm run dev

# type-check-free production build
npm run build

# preview the production build locally
npm run preview

# lint
npm run lint
```

## 📁 Project Structure

```
src/
├── components/        # Section components (Hero, Projects, Tech, Works…)
│   └── canvas/        # React Three Fiber scenes (Computers, Earth, Stars, Ball)
├── context/           # React contexts (language, Game Boy state, …)
├── translations/      # EN/ES dictionary + language provider
├── constants/         # Static data (nav links, services, technologies)
├── hoc/               # SectionWrapper higher-order component
├── utils/             # Small helpers (motion variants, typewriter)
└── assets/            # Images, sprites, 3D-adjacent art
public/                # 3D models (.gltf), textures, favicons
scripts/               # Build/deploy tooling (deploy, image optim, favicons)
```

`CLAUDE.md` at the repo root is a living map of the codebase (section → component → styles, subsystems, gotchas) — handy for onboarding.

## 📦 Deployment

The live site is served from the **`gh-pages`** branch (built output). Publish with:

```bash
npm run deploy   # builds, then pushes dist/ to gh-pages (adds .nojekyll + SPA 404 fallback)
```

There's also a manual **GitHub Actions** workflow (`Actions → Deploy → Run workflow`) that builds and deploys the same way.

## 📄 License

[MIT](./LICENSE) © Zack Isaza
