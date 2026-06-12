# Architecture

## System Overview

```
                    ┌─────────────────────────────────┐
                    │         Next.js 15 App           │
                    │                                  │
                    │  ┌─────────────┐  ┌──────────┐  │
                    │  │  Public UI  │  │ Admin UI │  │
                    │  │(RSC + hydra)│  │(RSC + CC)│  │
                    │  └──────┬──────┘  └────┬─────┘  │
                    │         │              │         │
                    │  ┌──────▼──────────────▼──────┐  │
                    │  │       API Route Handlers    │  │
                    │  │    (app/api/** — server)    │  │
                    │  └──────────────┬──────────────┘  │
                    └─────────────────┼────────────────┘
                                      │
                    ┌─────────────────▼────────────────┐
                    │            MongoDB Atlas          │
                    │         (Mongoose ODM)            │
                    └──────────────────────────────────┘

External Services:
  - Claude API         → AI nutrition estimation
  - Google Maps API    → Nearby restaurant lookup
  - NextAuth.js        → Authentication
  - Vercel             → Deployment + Edge cache
```

---

## Rendering Strategy

| Page | Strategy | Reason |
|---|---|---|
| Home | ISR (revalidate: 3600) | Changes infrequently |
| Dish detail | ISR (revalidate: 1800) | Semi-static content |
| Category listing | ISR (revalidate: 3600) | Rarely changes |
| Search results | SSR | Dynamic per query |
| Random dish | Server Action / API | Real-time randomization |
| Favorites | SSR + Client | Per-user, no cache |
| Admin pages | SSR | Always fresh |

---

## Data Flow — Random Dish

```
User clicks "Random Dish"
        ↓
POST /api/dishes/random  { type: 'normal' | 'vegetarian' | 'diet' }
        ↓
Server: weighted random selection from Dish collection
        ↓
Return dish with recipes, nutrition, and YouTube links
        ↓
Client renders DishDetailCard
        ↓
Client (browser): GET /api/restaurants/nearby  { dishName, lat, lng }
        ↓
Google Maps Places API → return nearby restaurants
```

---

## Data Flow — Search

```
User types query
        ↓
Debounced fetch → GET /api/search?q=pho&type=dish
        ↓
Server: MongoDB text index search on Dish.name, Dish.tags
        ↓
Return ranked results
        ↓
Log to SearchHistory (userId or sessionId)
```

---

## Data Flow — Nutrition Estimation (AI)

```
Admin creates/edits Recipe → adds ingredients
        ↓
Admin clicks "Estimate Nutrition"
        ↓
POST /api/ai/nutrition  { ingredients: [...] }
        ↓
Server: format prompt → call Claude API
        ↓
Claude parses ingredients, converts units, sums nutrition
        ↓
Return { calories, protein, fat, carbs }
        ↓
Auto-fill Recipe nutrition fields
```

---

## Caching Strategy

| Layer | Mechanism | TTL |
|---|---|---|
| Static pages | Next.js ISR | 30–60 min |
| API responses | `unstable_cache` / `cache()` | Per endpoint |
| DB queries | Mongoose query cache (custom) | 5 min |
| Images | Vercel Image Optimization | Immutable |
| Restaurant data | Client sessionStorage | 10 min |

---

## Authentication Flow

```
User registers / logs in
        ↓
NextAuth.js (credentials or OAuth)
        ↓
JWT stored in HttpOnly cookie
        ↓
Middleware checks role on (admin)/* routes
        ↓
Server Components read session via auth()
```

Role matrix:

| Route group | USER | ADMIN |
|---|---|---|
| (public)/* | ✓ | ✓ |
| (admin)/* | ✗ | ✓ |
| API — read | ✓ | ✓ |
| API — write | ✗ | ✓ |
| Favorites | ✓ (own) | ✓ |

---

## Error Handling

- API routes: always return `{ success, data, error }` shaped responses.
- Server Components: use Next.js `error.tsx` per segment.
- Client Components: React Error Boundaries wrapping feature sections.
- Unhandled promise rejections: logged to server console (+ future: Sentry).

---

## Image Strategy

- Store image URLs (not binaries) in MongoDB.
- Use Next.js `<Image>` for automatic WebP conversion and lazy loading.
- Upload flow (Sprint 10): Cloudinary or Vercel Blob for storage.
- During development: use placeholder services.

---

## SEO Architecture

Each `Dish` and `Category` document stores a `seo` sub-document:

```typescript
{
  metaTitle: string
  metaDescription: string
  slug: string          // canonical URL segment
  canonicalUrl: string  // full absolute URL
}
```

- `generateMetadata()` in each page reads from DB.
- `sitemap.ts` and `robots.ts` auto-generated via Next.js conventions.
- JSON-LD structured data (Recipe schema) added to dish detail pages.

---

## Scalability Considerations

- MongoDB Atlas auto-scaling enabled.
- Stateless API — horizontal scaling on Vercel.
- Text indexes on `Dish.name`, `Dish.tags` for fast search.
- Compound indexes on frequently queried combinations.
- Rate limiting on `/api/ai/*` endpoints to control AI costs.
- Pagination on all list endpoints (cursor-based for consistency).
