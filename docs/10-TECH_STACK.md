# Tech Stack

## Overview

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 15.x | Full-stack React framework |
| Language | TypeScript | 5.x | Type safety |
| Runtime | Node.js | 20.x LTS | Server runtime |
| Database | MongoDB Atlas | Cloud | Primary data store |
| ODM | Mongoose | 8.x | MongoDB object modeling |
| Styling | TailwindCSS | 4.x | Utility-first CSS |
| UI Components | shadcn/ui | Latest | Accessible component library |
| Auth | NextAuth.js | 5.x (beta) | Authentication |
| AI | Anthropic SDK | Latest | Claude API for nutrition |
| Maps | Google Maps Places API | v1 (New) | Nearby restaurant search |
| Deployment | Vercel | — | Hosting + CDN + Edge |
| Storage | Cloudinary | — | Image upload and delivery |
| Monitoring | Sentry | — | Error tracking |
| Analytics | Vercel Analytics | — | Web vitals + page views |

---

## Framework — Next.js 15

**Why Next.js 15:**

- App Router enables React Server Components (RSC) — zero-JS pages by default, faster TTI.
- Built-in ISR (Incremental Static Regeneration) for dish and category pages.
- API Route Handlers in the same project — no separate backend server needed.
- `generateMetadata()` for per-page SEO without client-side hydration.
- `next/image` for automatic WebP conversion, lazy loading, and size optimization.
- Excellent Vercel integration.

**Key Next.js 15 features used:**

| Feature | Usage |
|---|---|
| App Router | All routing |
| React Server Components | Default for all pages |
| Server Actions | Form mutations (dish create/edit) |
| Route Groups | `(public)`, `(admin)`, `(auth)` |
| Parallel Routes | Admin dashboard panels |
| `generateMetadata` | Per-page SEO |
| `generateStaticParams` | Pre-render dish and category pages |
| ISR (`revalidate`) | Dish detail: 1800s, Category: 3600s |
| `unstable_cache` | Database query caching |
| Middleware | Admin route protection, session check |
| `next/image` | All images |
| `next/font` | Google Fonts with zero layout shift |

---

## Language — TypeScript 5 (Strict Mode)

**Configuration:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Why strict mode:**

- Catches null/undefined bugs at compile time — critical for DB query results.
- `noUncheckedIndexedAccess` prevents array out-of-bounds bugs.
- Makes refactoring safer as the codebase grows.

---

## Database — MongoDB Atlas

**Why MongoDB:**

- Schema-flexible — recipe `instructions` and `ingredients` are naturally nested documents.
- Native JSON storage — no ORM translation layer.
- Atlas free tier available for development.
- Built-in horizontal scaling (sharding) for future growth.
- Atlas Search for full-text search (upgrade path from basic text indexes).
- Atlas Vector Search available for AI-powered recommendations (future).

**Atlas Plan:**

| Environment | Tier | Notes |
|---|---|---|
| Development | M0 (Free) | 512MB storage, shared |
| Production | M10+ | 2GB+ storage, dedicated, replica set |

**Connection:** Mongoose singleton pattern with connection reuse across serverless invocations.

---

## ODM — Mongoose 8

**Why Mongoose:**

- Schema validation on top of MongoDB's flexible documents.
- Pre/post hooks for slug generation, password hashing, etc.
- Virtuals for computed properties.
- Lean queries (`.lean()`) for read-heavy endpoints — plain JS objects, no Mongoose overhead.
- TypeScript support via `mongoose.InferSchemaType`.

**Performance guidelines:**

- Always use `.select()` to fetch only needed fields.
- Use `.lean()` on all read queries in API routes.
- Create indexes in schema definition (`{ index: true }` or explicit `schema.index()`).
- Use `$inc` for counter fields — never read-modify-write.

---

## Styling — TailwindCSS 4

**Why Tailwind:**

- Utility-first — no naming conventions to maintain.
- Zero dead CSS in production (PurgeCSS built-in).
- Consistent spacing, color, and typography scales.
- Responsive and dark mode modifiers built-in.
- Pairs naturally with shadcn/ui.

**Configuration highlights:**

- Custom brand color extensions (amber-500 as primary).
- Custom font family tokens (Playfair Display, Inter).
- `content` paths configured for all `.tsx` and `.ts` files.

---

## UI Components — shadcn/ui

**Why shadcn/ui:**

- Components are copied into the project (not a dependency) — full control.
- Built on Radix UI primitives — WAI-ARIA accessible by default.
- Tailwind-styled — consistent with the project's styling approach.
- Unstyled core logic means customization is CSS only, not config.

**Components used (non-exhaustive):**

Button, Card, Dialog, Dropdown Menu, Input, Label, Select, Skeleton, Tabs, Toast (Sonner), Badge, Separator, Avatar, Sheet (mobile nav), Table, Pagination, Form (React Hook Form + Zod), Switch, Tooltip, Command (search combobox), Chart (recharts wrapper).

---

## Authentication — NextAuth.js 5

**Why NextAuth.js:**

- First-class Next.js integration with App Router.
- Handles JWT, session management, CSRF protection out of the box.
- Multiple providers (credentials, Google, GitHub) with minimal config.
- Edge-compatible middleware for route protection.

**Scope:** Admin panel only. The public site has no login or registration.

**Providers (v1.0):**

| Provider | Status | Notes |
|---|---|---|
| Credentials (email/password) | Required | Admin only |

Admin accounts are created via a setup script — there is no public registration endpoint.

**Session strategy:** JWT (stateless, no session table needed).

**Password hashing:** `bcryptjs` with cost factor 12.

---

## AI — Anthropic SDK (Claude API)

**Why Claude:**

- Best-in-class instruction following for structured output (JSON nutrition response).
- Reliable unit conversion and estimation for food quantities.
- Native tool use / structured output support.

**Model used:** `claude-haiku-4-5-20251001` (fast + cost-efficient for structured extraction tasks).

**Usage scope:** Admin-only nutrition estimation. Rate limited to 20 requests/minute per admin.

**Cost estimate:** At ~1,000 token input per request and 200 token output, Haiku costs approximately $0.001 per request. 20 req/min × 60 min × admin usage = manageable cost.

**Implementation:** Single endpoint `POST /api/ai/nutrition`. Anthropic SDK called server-side only. API key in env, never exposed to client.

---

## Maps — Google Maps Places API (New)

**Why Google Maps Places:**

- Most comprehensive restaurant database globally.
- `Nearby Search` endpoint returns name, rating, opening hours, address, distance.
- Well-documented and reliable SLA.

**Implementation:**

- Server-side HTTP call to Places API — API key never in client bundle.
- `GET /api/restaurants/nearby` acts as a server-side proxy.
- Results cached per `(dishName, lat, lng)` for 10 minutes using `unstable_cache`.

**Quota:** Free tier allows 100 requests/day × 5 results each = 500 restaurant lookups/day. Monitor usage on Google Cloud Console.

---

## Deployment — Vercel

**Why Vercel:**

- Zero-config deployment for Next.js.
- Edge Network CDN for static assets.
- ISR support out of the box.
- Automatic preview deployments per PR.
- Environment variable management per environment.
- Vercel Analytics built-in.

**Environments:**

| Environment | Branch | URL |
|---|---|---|
| Development | local | `localhost:3000` |
| Preview | feature branches | `*.vercel.app` |
| Production | `main` | custom domain |

---

## Image Storage — Cloudinary (Sprint 10)

**Why Cloudinary:**

- Free tier: 25GB storage, 25GB bandwidth/month.
- On-the-fly transformation (resize, crop, format convert).
- Delivery via global CDN.
- Next.js integration via custom `loaderFile` config.

**Development alternative:** Image URL fields accept external URLs (no upload needed for Sprints 1–9).

---

## Monitoring — Sentry

**Why Sentry:**

- Source-map-aware stack traces for minified Next.js builds.
- Performance monitoring (transaction tracing).
- Error grouping and alerting.
- Free tier covers small projects.

**Integration:**

- `@sentry/nextjs` wraps both client and server.
- Configured in `next.config.ts` via `withSentryConfig`.

---

## Validation — Zod

**Why Zod:**

- TypeScript-first schema validation.
- Infer types from schemas — single source of truth for API request shapes.
- Works in both client (form validation) and server (API route validation).
- Integrates with React Hook Form via `@hookform/resolvers/zod`.

---

## Forms — React Hook Form

**Why React Hook Form:**

- Minimal re-renders — performance matters for complex admin forms.
- Uncontrolled inputs by default.
- Excellent Zod integration for schema-based validation.
- Used only in Client Components (`"use client"`).

---

## Development Tools

| Tool | Purpose |
|---|---|
| ESLint | Linting (Next.js default config + strict rules) |
| Prettier | Code formatting |
| Husky + lint-staged | Pre-commit linting |
| ts-node | Run TypeScript scripts (seed, crawl) |
| Cheerio | HTML parsing in crawler scripts |
| k6 | Load testing (Sprint 10) |

---

## Environment Variables

```bash
# Database
MONGODB_URI=mongodb+srv://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# AI
ANTHROPIC_API_KEY=...

# Maps (server-only — no NEXT_PUBLIC_ prefix)
GOOGLE_MAPS_API_KEY=...

# Maps (client — for embed, if needed)
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=...

# Image Storage (Sprint 10)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Monitoring (Sprint 10)
NEXT_PUBLIC_SENTRY_DSN=...
SENTRY_AUTH_TOKEN=...

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Rules:**

- `NEXT_PUBLIC_` prefix only for values the browser must read.
- All API keys for external services (Google, Anthropic, Cloudinary) must be server-only (no `NEXT_PUBLIC_` prefix).
- `.env.local` is in `.gitignore` — never commit secrets.
- `.env.example` contains all keys with empty or placeholder values — commit this.

---

## Dependency Decisions

| Decision | Choice | Rejected Alternatives | Reason |
|---|---|---|---|
| Auth | NextAuth.js 5 | Lucia, Clerk, Auth0 | Free, open-source, native Next.js, no vendor lock-in |
| UI library | shadcn/ui | Chakra UI, MUI, Mantine | Owned code, Tailwind-native, Radix accessibility |
| DB | MongoDB | PostgreSQL, PlanetScale | Nested recipe documents map naturally to documents |
| AI | Claude (Anthropic) | OpenAI GPT, Gemini | Superior structured output, good pricing on Haiku |
| Charts | shadcn charts (Recharts) | Chart.js, Victory | Already in shadcn ecosystem, no extra dependency |
| Validation | Zod | Yup, Joi | TypeScript-first, schema inference |
| Deployment | Vercel | Railway, Render, Fly.io | Best-in-class Next.js support, ISR, preview deployments |
