# SV Developers — Project Snapshot

_Luxury real estate & construction website for **SV Developers & Constructions** (est. 2013, Bengaluru / Andhra Pradesh)._
_Single-page React app with full-page sections + a 3D interactive Projects page._

Last updated: 2026-06-02

---

## How to Run

```bash
npm run dev        # dev server  → http://localhost:8080
npm run build      # production build
npm run preview    # preview the production build
npm run lint       # ESLint
```

Node 18+. All deps installed (`node_modules` present). No `.env` / backend / API keys.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + custom CSS in `src/index.css` |
| 3D / WebGL | **three.js** (`@types/three` installed) |
| Animation | **GSAP** + **ScrollTrigger** |
| Smooth scroll | **Lenis** (wired to GSAP ticker) |
| UI primitives | shadcn/ui (Radix) in `src/components/ui/` |
| Routing | React Router v6 |
| Data fetching | TanStack Query (wired, unused) |
| Icons | Lucide React |
| SEO | react-helmet-async |

---

## Routes

| Path | Renders |
|---|---|
| `/` | `src/pages/Index.tsx` — Hero, About, Services, Choose, Work, Contact, Footer |
| `/projects` | Header + `src/components/Projects.tsx` (3D scene) + Footer |
| `*` | `src/pages/NotFound.tsx` |

Nav hash links use the `/#section` form (e.g. `/#services`) so they work from any route, including `/projects`.

---

## Component Map

```
src/
  pages/
    Index.tsx          — home, assembles all sections
    NotFound.tsx
  components/
    Header.tsx         — fixed nav, scroll-aware bg, mobile overlay
    Hero.tsx           — full-screen video + animated masked headline + dust canvas
    About.tsx          — bio, count-up stats, GSAP clip-path image reveal
    Services.tsx       — 6 services, click → modal (scroll-fixed)
    Choose.tsx         — why-choose-us editorial list
    Work.tsx           — 6-step process timeline + floating 3D house image
    Contact.tsx        — split panel, WhatsApp submit
    Footer.tsx
    Projects.tsx       — 3D house + portal cards → category page → grid (see below)
    Reveal.tsx         — GSAP ScrollTrigger reveal wrapper
    WaterDistortion / FluidBackground / GrainOverlay / ShaderCursor / PageLoader / CustomCursor
  hooks/
    use-lenis.ts          — Lenis smooth scroll + ScrollTrigger sync
    use-scroll-reveal.ts  — legacy IO hook (Reveal no longer uses it)
    use-mobile.tsx / use-toast.ts
```

---

## The Projects Page (`/projects`) — 3D flow

1. **Main view** — wireframe **3D house** (three.js `EdgesGeometry` + custom roof prisms) at center, breathing opacity. Drag rotates the house with momentum (house only; cards stay put).
2. **Portal cards** — 3 category cards (Luxury / Premium / Residential) float around the house, each a `CanvasTexture` with a real photo (top) + label/count/CTA (bottom). Hover lifts + highlights one and dims the others.
3. **Click a portal** → cream vignette transition → **Category page**: 3D extruded-letter hero (`CatLetterScene`) + animated project grid.
4. **Project cards in the grid:**
   - **Hover** → side **DetailPanel** slides in from the right as a glance preview (pointer-transparent so it never blocks/flickers the cards beneath; shows a "Click to open" hint).
   - **Click** → centered **ProjectModal** with ken-burns hero, status/category badges, 4-stat grid, full description, highlights, gold CTAs. Closes on ✕ / backdrop / ESC.

### Where to adjust the 3D layout (all in `Projects.tsx`)
- **House size**: `const HC = 0x7a5c3a, S = 1.55;` — `S` is the scale factor.
- **Camera**: `camera.position.set(0, 30, 820);`
- **Portal positions**: `PORTAL_DEFS` array — each `pos: [x, y, z]` (x=left/right, y=down/up, z=near/far).
- **Portal card size**: `const PW = 170, PH = 240;`

---

## Design Tokens (in `src/index.css` `:root`)

- **SV Brown** `#473727` (`--sv-brown`) · **Dark** `#1C0D07`
- **SV Cream** `#E8DCC8` (`--sv-cream`) · **Ivory bg** `#FCFAF5` · **Soft bar** `#F2EADC` (brighter, less-beige palette)
- **Gold accent** `#BE9234` (`--sv-gold`), deep `#9C6F27`, bright-on-dark `#D9B45E` — used on heading accent words, label ticks, hovers
- **Fonts:**
  - Headings → **DM Serif Display** (bold, dramatic; `--font-heading`, Tailwind `font-heading`)
  - Body → **Inter** (`--font-body`)
  - Labels/eyebrows → **DM Mono** (`--font-mono`, applied to `.section-label` with a gold tick `::before`)
  - Serif paragraph copy → **Libre Baskerville** (`.font-libre`)
  - Section headings sized up one step (e.g. `text-6xl sm:text-7xl lg:text-8xl`)
- Easing: `--ease-lux: cubic-bezier(0.16, 1, 0.3, 1)`

`@/` path alias → `src/` (vite + tsconfig).

---

## Motion & Scroll System

- **Reveal** (`Reveal.tsx`) uses **GSAP ScrollTrigger** (not IntersectionObserver). It's synced to the Lenis RAF loop, refreshes on load, and has a **1.2s viewport failsafe** so content can never stay invisible — this fixed the "content vanishes on refresh" bug.
- **Lenis** (`use-lenis.ts`): expo-out, `duration 1.15`, `lerp 0.085`; `history.scrollRestoration = "manual"` (reload starts at top) + `ScrollTrigger.refresh()` at 200ms / 800ms / load.
- **Modals & panels** carry `data-lenis-prevent` + `overscroll-contain` so Lenis doesn't steal their wheel scroll (fixed the Services modal bottom-cutoff).

---

## Contact Form

`Contact.tsx` submits by opening WhatsApp (`+91 9945586527`) with a pre-filled message. `handleSubmit` is wired to the submit button's `onClick`.

---

## Assets

External image URLs (imgbb + Unsplash). Logo in production: `https://i.ibb.co/Z6CBvxYn/SVLOGO.png`. Local backups: `public/SVLOGO.png`, `public/favicon.ico`. Hero video: `public/bg.mp4`.

---

## Status

- `npm run build` — passes ✓
- `npx tsc --noEmit` — clean ✓
- `npx eslint` — clean ✓
