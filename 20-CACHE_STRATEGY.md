# Cache Strategy — Recipe AI

Target scale: ~10,000 users. The goal is to serve the vast majority of public traffic from cache, keeping MongoDB reads and serverless function invocations to a minimum.

---

## Principles

- **Cache public, skip private.** Every public page is cacheable. The admin panel is never cached.
- **Cache as close to the user as possible.** Browser → CDN/Edge → Server → Database — serve from the earliest layer that has a fresh copy.
- **Invalidate on write, not on timer.** Content changes when an admin acts. Time-based expiry is a safety net, not the primary invalidation mechanism.
- **Fail open on cache misses.** A cache miss must always produce a correct response, never an error.

---

## 1. Browser Cache

Controls what the browser stores locally after the first visit. Managed via HTTP response headers.

### Static Assets (JS, CSS, Fonts)

Next.js appends a content hash to all static asset filenames at build time (`_next/static/chunks/abc123.js`). Because the filename changes with every build, these assets can be cached indefinitely.

| Asset type | `Cache-Control` header | Duration |
|---|---|---|
| JS bundles (`_next/static/`) | `public, max-age=31536000, immutable` | 1 year |
| CSS bundles (`_next/static/`) | `public, max-age=31536000, immutable` | 1 year |
| Font files (`/public/fonts/`) | `public, max-age=31536000, immutable` | 1 year |

### Public Pages (HTML)

HTML responses must allow revalidation so users always get the latest published content.

| Page | `Cache-Control` header | Duration |
|---|---|---|
| Home (`/`) | `public, s-maxage=300, stale-while-revalidate=60` | 5 min fresh, 1 min stale |
| Dish detail (`/dishes/[slug]`) | `public, s-maxage=600, stale-while-revalidate=120` | 10 min fresh, 2 min stale |
| Category page (`/categories/[slug]`) | `public, s-maxage=600, stale-while-revalidate=120` | 10 min fresh, 2 min stale |
| Search results (`/search`) | `no-store` | Not cached |
| Random dish (`/random`) | `no-store` | Not cached |
| Favorites (`/favorites`) | `no-store` | Not cached |
| Admin pages (`/admin/*`) | `no-store, no-cache` | Never cached |

`stale-while-revalidate` allows the browser to serve a slightly stale page instantly while fetching a fresh copy in the background — invisible to the user.

### API Responses

| Route | `Cache-Control` | Reason |
|---|---|---|
| `GET /api/dishes/random` | `no-store` | Must be random every call |
| `GET /api/search` | `no-store` | Query-specific, highly variable |
| `GET /api/dishes/[id]` | `public, s-maxage=300` | Stable content |
| `GET /api/categories` | `public, s-maxage=600` | Changes rarely |
| All `POST`, `PATCH`, `DELETE` | `no-store` | Mutations are never cached |
| All `/api/admin/*` | `no-store, no-cache` | Private — never cached |

---

## 2. Next.js Cache

Next.js 15 App Router has four built-in caching layers. Each is used deliberately.

### 2.1 Full Route Cache (Static Generation)

Pages that can be pre-rendered at build time are stored as static HTML on Vercel's CDN. No serverless function is invoked at request time — the CDN serves the pre-rendered file directly.

| Page | Strategy | Revalidation |
|---|---|---|
| Home (`/`) | ISR — `revalidate: 300` | Every 5 minutes or on-demand |
| Category pages | ISR — `revalidate: 600` | Every 10 minutes or on-demand |
| Dish detail pages | ISR — `revalidate: 600` | Every 10 minutes or on-demand |

ISR (Incremental Static Regeneration) means the page is pre-rendered at build time and then refreshed in the background at the configured interval. The visitor always receives a cached HTML file; the regeneration happens server-side without user-facing latency.

**Not statically generated:**
- `/search` — query-dependent
- `/random` — random per request
- `/favorites` — client-rendered from localStorage
- All `/admin/*` — dynamic, private

### 2.2 Data Cache (fetch cache)

`fetch()` calls inside Server Components and Route Handlers are cached by Next.js independently of the route itself.

| Data source | Cache setting | Duration |
|---|---|---|
| Category list (used on many pages) | `{ next: { revalidate: 3600, tags: ['categories'] } }` | 1 hour |
| Dish data for detail page | `{ next: { revalidate: 600, tags: ['dish', dish.slug] } }` | 10 minutes |
| Recipe list for a dish | `{ next: { revalidate: 600, tags: ['recipes', dish.slug] } }` | 10 minutes |
| Nutrition data | `{ next: { revalidate: 3600, tags: ['nutrition', dish.slug] } }` | 1 hour |
| Random dish selection | `{ cache: 'no-store' }` | Never |
| Search results | `{ cache: 'no-store' }` | Never |
| Admin data fetches | `{ cache: 'no-store' }` | Never |

### 2.3 Router Cache (Client-side)

Next.js caches rendered Server Component payloads in the browser's memory during a session. When a user navigates back to a recently visited page, the payload is served from this in-memory cache without a network request.

| Behaviour | Detail |
|---|---|
| Duration | Automatic — 30 seconds for dynamic pages, 5 minutes for static pages |
| Scope | Per browser tab, per session — cleared on full page reload |
| Admin panel | Not affected — admin routes are not Server Component pages with this cache |

No configuration is needed. This cache is managed entirely by Next.js.

### 2.4 On-Demand Revalidation

When an admin publishes, edits, or deletes content, the cache for the affected pages must be cleared immediately — before the time-based revalidation fires.

This is triggered from the admin API route after a successful write:

| Admin action | Cache tags invalidated |
|---|---|
| Create or update a dish | `['dish', dish.slug]`, `['recipes', dish.slug]`, `['categories']` |
| Delete a dish | `['dish', dish.slug]`, `['categories']` |
| Publish / unpublish a dish | `['dish', dish.slug]` |
| Update a category | `['categories']` |
| Update a recipe linked to a dish | `['recipes', dish.slug]`, `['dish', dish.slug]` |
| Update nutrition data for a dish | `['nutrition', dish.slug]`, `['dish', dish.slug]` |
| Update a banner | `['home']` |

The `revalidateTag()` function from Next.js triggers the invalidation. Vercel propagates the purge across all CDN edge nodes within seconds.

---

## 3. Image Cache

All images are served from Cloudinary's CDN. No images pass through the Next.js image optimisation endpoint for production traffic — Cloudinary handles all resizing, format conversion, and delivery.

### Cloudinary CDN Headers

Cloudinary sets the following headers on all image responses:

| Header | Value |
|---|---|
| `Cache-Control` | `public, max-age=31536000, immutable` |
| `ETag` | Present — allows conditional revalidation |
| `Vary` | `Accept` — serves WebP to supporting browsers, JPEG otherwise |

Images are effectively cached forever at the CDN level. Because image content is immutable once uploaded (a new upload gets a new public ID, or `overwrite: true` busts the CDN automatically), the 1-year cache is safe.

### Per-image-type Cache Behaviour

| Image type | Cache duration | Invalidation method |
|---|---|---|
| Dish cover | 1 year | New upload generates new version or overwrites public ID |
| Recipe photo | 1 year | Same as dish cover |
| Banner image | 1 year | Overwrite on update; Cloudinary auto-purges the CDN |
| Admin avatar | 1 year | Overwrite on update |
| OG image variant | 1 year | Regenerated when the parent dish cover changes |

### Next.js `<Image>` Component

The custom Cloudinary loader in `next.config.ts` routes all `<Image>` src props through Cloudinary's transformation URL. The browser caches each width variant independently using the Cloudinary CDN headers above. Next.js's own image optimisation cache (`/_next/image`) is bypassed entirely in production.

---

## 4. MongoDB Cache

MongoDB itself is not a caching layer — it is the source of truth. Caching happens *in front of* MongoDB to reduce the number of database round-trips.

### 4.1 Mongoose Connection Singleton

The MongoDB connection is a singleton stored in the Node.js module cache. In a Next.js serverless environment, each function instance reuses the same connection across requests rather than opening a new connection per request.

| Behaviour | Detail |
|---|---|
| Connection pooling | Mongoose maintains a pool; default pool size is 5 connections |
| Reconnection | Automatic — Mongoose retries on connection loss |
| Scope | Per serverless function instance — not shared across instances |

### 4.2 Application-level Query Cache

For frequently read, rarely written data, query results are cached in memory within the serverless function instance using a simple `Map` with a TTL. This avoids hitting MongoDB on every request for data that barely changes.

| Data | Cache duration | Invalidation |
|---|---|---|
| All categories list | 10 minutes | Cleared when any category is updated |
| Active banners list | 5 minutes | Cleared when any banner is updated |
| Random dish pool | 5 minutes | Refreshed periodically; not invalidated on dish update |
| Site settings | 30 minutes | Cleared when settings are saved |

**Scope limitation:** In-memory cache is per serverless function instance. With multiple concurrent instances, different users may get cached values from different instances. For this data type (category names, banners, settings), slight inconsistency across instances is acceptable — all instances converge to fresh data within the TTL.

### 4.3 MongoDB Atlas Search Index

MongoDB Atlas Search uses its own internal index that is not a cache but behaves like one from the application's perspective — queries against it are pre-indexed and do not scan the full collection.

| Query type | Backed by |
|---|---|
| Dish full-text search | Atlas Search index on `name`, `description` |
| Dish filter by category | Standard index on `category` + `published` |
| Dish filter by diet type | Standard index on `type` + `published` |
| Dish lookup by slug | Unique index on `slug` |
| Recipe lookup by dish | Index on `dish` (ObjectId reference) |

### 4.4 What Is Not Cached at the Database Layer

| Query | Why not cached |
|---|---|
| Random dish selection | Must produce a different result each call |
| Admin dashboard counts | Must reflect real-time document counts |
| Admin content lists | Admins need to see edits immediately |
| Analytics writes | Write-heavy; caching would lose data |

---

## 5. Cache Layer Summary

| Layer | What is cached | Duration | Invalidation |
|---|---|---|---|
| Browser — static assets | JS, CSS, fonts | 1 year | Filename hash changes on deploy |
| Browser — HTML pages | Public page HTML | 5–10 minutes | `stale-while-revalidate` refresh |
| Browser — Router Cache | Server Component payloads | 30 s – 5 min | Session end / page reload |
| Next.js Full Route Cache | Pre-rendered HTML on CDN | Until revalidation | `revalidateTag()` on admin write |
| Next.js Data Cache | fetch() results | 10 min – 1 hour | `revalidateTag()` on admin write |
| Cloudinary CDN | All image variants | 1 year | Overwrite or new public ID |
| Application memory | Category list, banners, settings | 5–30 minutes | Cleared on write |
| MongoDB Atlas | Index data | Continuous sync | Automatic on write |

---

## 6. Cache Invalidation Flow

When an admin saves a change in the CMS, this sequence fires:

```
Admin submits form
  │
  ▼
PATCH /api/admin/dishes/[id]
  │  Validates session
  │  Validates input (Zod)
  │  Writes to MongoDB
  │
  ▼
On successful write:
  │  revalidateTag('dish', slug)       → purges Next.js Data Cache + Full Route Cache
  │  revalidateTag('recipes', slug)    → same for recipe data
  │  revalidatePath('/dishes/' + slug) → explicit path purge as a safety net
  │
  ▼
Vercel CDN propagates purge to all edge nodes (~seconds)
  │
  ▼
Next.js regenerates the page on the next request (ISR)
  │
  ▼
Subsequent visitors receive fresh HTML
```

The application-level MongoDB query cache (Map with TTL) is cleared synchronously inside the same API route handler before the response is returned, so the next request to that function instance also gets fresh data.

---

## 7. Cache Behaviour by User Type

| User | Cache layers active | Notes |
|---|---|---|
| Anonymous visitor (first visit) | Browser, Cloudinary CDN, Next.js Full Route Cache | HTML served from CDN edge node; no DB query |
| Anonymous visitor (repeat visit) | Browser cache (HTML + assets), Cloudinary CDN | Full page from browser cache; no network request for assets |
| Anonymous visitor (search) | Cloudinary CDN (images only) | Search results are `no-store`; every search hits the server |
| Admin (any page) | None — all admin routes are `no-store` | Every admin page is a live database read |
