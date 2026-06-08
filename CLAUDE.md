# SV Developers Website

Luxury real estate & construction company website for **SV Developers & Constructions** (est. 2013, Bengaluru / Andhra Pradesh). Single-page React app with full-page sections.

## How to Run

```bash
npm run dev        # dev server at http://localhost:8080
npm run build      # production build
npm run preview    # preview the production build locally
npm run lint       # ESLint
```

Node version: any modern Node (18+). All dependencies are already installed (`node_modules` present). No `.env` file required — no backend or API keys used.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + custom CSS in `src/index.css` |
| UI components | shadcn/ui (Radix UI primitives) in `src/components/ui/` |
| Routing | React Router v6 |
| Data fetching | TanStack Query (wired up, but no remote calls currently) |
| Icons | Lucide React |
| SEO | react-helmet-async |
| Notifications | Sonner + Radix Toast |
| Bundler plugin | `lovable-tagger` (dev only, can be ignored) |

## Routes

| Path | Component |
|---|---|
| `/` | `src/pages/Index.tsx` — home, all sections in order |
| `/projects` | `src/components/Projects.tsx` wrapped in Header + Footer |
| `*` | `src/pages/NotFound.tsx` |

## Component Map

```
src/
  pages/
    Index.tsx          — home page (assembles all sections)
    NotFound.tsx       — 404

  components/
    Header.tsx         — fixed nav, scroll-aware bg, mobile hamburger overlay
    Hero.tsx           — full-screen 4-slide carousel, 6s auto-play, ken-burns
    About.tsx          — company bio, animated count-up stats
    Services.tsx       — 6 service cards, click-to-open modal detail
    Choose.tsx         — why-choose-us differentiators
    Work.tsx           — portfolio preview / teaser
    Contact.tsx        — split-panel contact form (WhatsApp submit) + info
    Footer.tsx         — site footer
    Projects.tsx       — /projects page: full project list with category filter
    PageLoader.tsx     — cinematic progress loader (once per session via sessionStorage)
    CustomCursor.tsx   — luxury dot+ring cursor (desktop/fine-pointer only)
    Reveal.tsx         — scroll-reveal wrapper component (⚠ see Known Issues)
    NavLink.tsx        — styled nav link helper

  hooks/
    use-scroll-reveal.ts  — IntersectionObserver hook, adds `.is-revealed` class
    use-mobile.tsx        — breakpoint detection
    use-toast.ts          — toast hook

  components/ui/        — shadcn/ui primitives (do not edit directly)
```

## Brand & Design Tokens

- **SV Brown**: `#473727` — primary brand colour (CSS var `--sv-brown`)
- **SV Cream**: `#E8DCC8` — accent / background (CSS var `--sv-cream`)
- **Heading font**: Playfair Display (loaded from Google Fonts)
- **Body font**: Inter (loaded from Google Fonts)
- **Serif body copy**: Libre Baskerville via `.font-libre` class
- Custom easing curves: `--ease-lux: cubic-bezier(0.16, 1, 0.3, 1)`

All CSS variables are declared in `src/index.css` under `:root`.

## Scroll Reveal System

Two entry points for the same animation system:

1. **Hook** (`useScrollReveal` from `src/hooks/use-scroll-reveal.ts`) — returns a `ref`, pair with utility classes `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`, `.text-mask` defined in `src/index.css`.
2. **Component** (`<Reveal>` from `src/components/Reveal.tsx`) — declarative wrapper used in `Services.tsx` and `Projects.tsx`. Accepts `variant`, `delay`, `as`, `className` props.

IntersectionObserver fires once by default (`once: true`). Reduced-motion users see elements immediately without animation.

## Contact Form

`src/components/Contact.tsx` — form submits by opening WhatsApp Web with a pre-filled message:

- WhatsApp number: `+919945586527`
- The `onClick={handleSubmit}` on the submit button is **commented out** — uncomment it to re-enable the WhatsApp flow.

## External Assets

All images are external URLs (Unsplash CDN + imgbb). No local images are used except `public/SVLOGO.png` (kept as backup) and `public/favicon.ico`.

Logo in production: `https://i.ibb.co/Z6CBvxYn/SVLOGO.png`

## Path Alias

`@/` resolves to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Known Issues / Things That Need Fixing

### 1. `Reveal.tsx` has wrong content (critical)
`src/components/Reveal.tsx` currently contains the `useScrollReveal` hook body instead of the actual `<Reveal>` component. This means `Services.tsx` and `Projects.tsx` will break because they do a default import of `Reveal` and use it as `<Reveal variant="left" delay={120}>`. The file needs to export a proper React component — see `src/hooks/use-scroll-reveal.ts` for the hook it should call internally.

### 2. Contact form submit is disabled
The `onClick={handleSubmit}` in `Contact.tsx` line ~222 is commented out. Uncomment it to enable the WhatsApp redirect on form submit.

### 3. TypeScript in Contact.tsx
`handleChange` uses an untyped event parameter — add `React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>` to silence the TS error.
