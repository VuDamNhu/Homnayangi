# Roadmap

## Overview

The project is built across 11 sprints (0–10). Each sprint delivers a testable increment. No code is shipped until Sprint 1.

```
Sprint 0  → Documentation & Design        (current)
Sprint 1  → User Website MVP
Sprint 2  → Admin CMS
Sprint 3  → MongoDB + Real API
Sprint 4  → Authentication
Sprint 5  → Favorites + History
Sprint 6  → AI Nutrition
Sprint 7  → Restaurant Recommendation
Sprint 8  → Analytics + SEO
Sprint 9  → Crawler + Automation
Sprint 10 → Production Deployment
```

---

## Sprint 0 — Product Design

**Status:** In Progress

**Goal:** Define the product completely before writing any code. All decisions are made here to minimize rework.

**Deliverables:**

- [x] Product vision document
- [x] PRD (`01-PRD.md`)
- [x] User flow diagrams (`02-USER_FLOW.md`)
- [x] Sitemap (`03-SITEMAP.md`)
- [x] Database schema (`04-DATABASE.md`)
- [x] API design (`05-API_DESIGN.md`)
- [x] Folder structure (`06-FOLDER_STRUCTURE.md`)
- [x] This roadmap (`07-ROADMAP.md`)
- [x] UI guideline (`08-UI_GUIDELINE.md`)
- [x] Admin features spec (`09-ADMIN_FEATURE.md`)
- [x] Tech stack (`10-TECH_STACK.md`)
- [x] `CLAUDE.md` project reference

**Exit criteria:** All documentation reviewed and approved. Ready to write code.

---

## Sprint 1 — User Website MVP

**Goal:** Build the entire public-facing UI using static/mock data. No database, no API calls.

**Scope:**

- Project initialization (Next.js 15, TypeScript, Tailwind, shadcn/ui)
- Root layout, Header, Footer
- Home page (hero, category bar, featured dishes, random dish button, banner carousel)
- Dish detail page (image, nutrition, recipes, instructions, YouTube embed)
- Category page (dish grid)
- Search page (client-side mock search)
- All shared components (DishCard, RecipeCard, NutritionCard, SkeletonCard, EmptyState, Pagination)
- Mobile responsive layout
- Basic page transitions and loading states

**Out of scope:**

- Database, API routes, authentication, real data

**Exit criteria:**

- All pages render correctly on desktop and mobile.
- Random dish button works (selects from mock data).
- No TypeScript errors. ESLint passes.

---

## Sprint 2 — Admin CMS

**Goal:** Build the complete admin panel UI. Still no real database.

**Scope:**

- Admin layout (sidebar, breadcrumbs, admin header)
- Dashboard with mock stats and charts
- Full CRUD UI for: Dishes, Recipes, Categories, Ingredients
- User management table
- Banner management
- All admin forms with validation (client-side only for now)
- Role-protected layout stub (redirects to `/login` — login page is UI only)

**Out of scope:**

- Real data, real auth, API integration

**Exit criteria:**

- All admin pages and forms render.
- Form validation works client-side.
- Admin layout is responsive.

---

## Sprint 3 — MongoDB + API

**Goal:** Replace all mock data with a real database and live API routes.

**Scope:**

- MongoDB Atlas cluster setup (dev)
- All Mongoose models created
- Seed script with 5+ categories, 20+ dishes, 40+ recipes, 50+ ingredients
- All API routes implemented (dishes, recipes, categories, ingredients, search)
- ISR configured on dish detail and category pages
- All frontend pages connected to real API
- Loading skeletons and error states working

**Out of scope:**

- Auth-protected routes (any user can access any endpoint for now)

**Exit criteria:**

- Public pages load real data.
- Search returns real results.
- Admin CRUD forms talk to real API (create/edit/delete work).
- Database is seeded and accessible.

---

## Sprint 4 — Admin Authentication

**Goal:** Implement admin login and role-based access control. The public site remains fully anonymous — no user registration.

**Scope:**

- NextAuth.js v5 with credentials provider (admin only)
- Admin login page at `/admin/login`
- Admin logout
- Middleware protecting `(admin)/*` routes — redirect to `/admin/login` if not ADMIN
- Admin API routes return 401/403 for non-admin requests
- Admin account creation via setup script (no public registration endpoint)

**Out of scope:**

- Public user registration or login — the website is fully public and anonymous.

**Exit criteria:**

- Admin can log in at `/admin/login` with a pre-configured account.
- Admin panel is inaccessible without admin credentials.
- Session persists across page refreshes.
- All API write routes reject unauthenticated requests.
- Public site is completely unaffected — no login required for any visitor action.

---

## Sprint 5 — Favorites + History

**Goal:** Visitors can save favorites without any account. View and search history tracked anonymously.

**Scope:**

- Favorites stored in `localStorage` — no API, no login required
- `FavoriteButton` component: toggle dish/recipe saved state via `useFavorite` hook
- Favorites page (`/favorites`) — reads IDs from localStorage, fetches details from existing public API
- Dishes tab + Recipes tab on favorites page
- View history — auto-logged on dish detail page visit via `sessionId` (anonymous)
- `Dish.viewCount` incremented atomically on each visit
- Search history — logged anonymously by `sessionId`, used for admin analytics only (not shown to visitors)

**Exit criteria:**

- Any visitor can save and remove favorites without creating an account.
- Favorites page shows saved dishes and recipes populated from public API.
- Favorites persist across page refreshes (localStorage).
- View history increments `viewCount` correctly.

---

## Sprint 6 — AI Nutrition

**Goal:** Admins can auto-estimate nutrition values when creating or editing recipes.

**Scope:**

- Anthropic SDK installed and configured
- Nutrition estimation API (`POST /api/ai/nutrition`)
- Rate limiting on nutrition endpoint (20 req/min per admin)
- "Estimate Nutrition" button in admin recipe form
- Loading state, confidence indicator, manual override support
- Nutrition chart on dish detail page (macro breakdown)

**Exit criteria:**

- Admin can click "Estimate Nutrition" with a filled ingredient list and get back accurate values.
- Fields auto-populate. Admin can edit values.
- Confidence level is displayed.

---

## Sprint 7 — Restaurant Recommendation

**Goal:** Show nearby restaurants on the dish detail page.

**Scope:**

- Google Maps Places API integration (server-side)
- Geolocation request in browser
- Manual location input fallback
- Restaurant list with name, rating, distance, hours, "View on Maps" link
- Server-side result caching (10 min per location/dish combo)

**Exit criteria:**

- Nearby restaurants appear on dish detail page.
- Works with both GPS and manual location.
- Graceful fallback when location is denied or no results are found.

---

## Sprint 8 — Analytics + SEO

**Goal:** Track user behavior and maximize search engine visibility.

**Scope:**

- Page view tracking (fire-and-forget on every page)
- Admin analytics dashboard (views per day, top dishes, top keywords, category breakdown)
- `generateMetadata()` on all public pages
- Open Graph and Twitter card tags
- Dynamic sitemap.xml and robots.txt
- JSON-LD Recipe structured data on dish detail pages
- Canonical URLs verified
- Admin SEO overview page (missing fields report)

**Exit criteria:**

- Analytics dashboard shows real data.
- All public pages have unique meta tags.
- Sitemap is accessible at `/sitemap.xml`.
- Rich results test passes for dish detail pages.

---

## Sprint 9 — Crawler + Automation

**Goal:** Automate recipe data collection from external sources.

**Scope:**

- Base crawler class (fetch + Cheerio parse)
- Cookpad crawler
- Dien May Xanh crawler (best effort)
- Data normalization pipeline (raw → Recipe schema)
- Ingredient fuzzy matching
- Admin "Pending Review" queue for crawled recipes
- Crawl log model

**Out of scope:**

- Fully automated scheduled crawling (manual trigger only in v1)

**Exit criteria:**

- Running the crawler script imports recipes into the DB with `isActive: false`.
- Admin can review and publish crawled recipes.
- No duplicate recipes for the same source URL.

---

## Sprint 10 — Production Deployment

**Goal:** Ship the product to production with monitoring, performance tuning, and security hardening.

**Scope:**

- Vercel project setup + production environment variables
- MongoDB Atlas production cluster (M10+)
- Image upload via Cloudinary (replaces image URL input)
- Security headers in `next.config.ts`
- Rate limiting on auth endpoints
- Lighthouse audit — achieve ≥ 90 on all metrics
- Sentry error tracking (frontend + backend)
- Vercel Analytics for web vitals
- MongoDB Atlas monitoring alerts
- Health check endpoint
- Full end-to-end testing in production

**Exit criteria:**

- Site is live at custom domain with SSL.
- Lighthouse score ≥ 90 on mobile.
- Sentry is capturing errors.
- All user flows tested and working in production.

---

## Dependencies Between Sprints

```
Sprint 1  (no deps)
Sprint 2  (no deps — can run in parallel with Sprint 1)
Sprint 3  requires Sprint 1 + Sprint 2 UI complete
Sprint 4  requires Sprint 3
Sprint 5  requires Sprint 4 (needs auth)
Sprint 6  requires Sprint 3 (needs recipe form)
Sprint 7  requires Sprint 3 (needs dish detail page)
Sprint 8  requires Sprint 3 (needs real data for analytics)
Sprint 9  requires Sprint 3 (needs DB models)
Sprint 10 requires Sprint 4–9 complete
```

Sprints 1 and 2 can be developed in parallel. Sprints 6, 7, 8, 9 can overlap once Sprint 3 is done.

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Claude API costs spike | Medium | Medium | Admin-only, rate limited to 20 req/min |
| Google Maps API quota exceeded | Low | Medium | Server-side cache, fallback empty state |
| Crawlers break on HTML changes | High | Low | Manual fallback always available |
| MongoDB Atlas free tier limits hit in dev | Low | Low | Upgrade to M10 before Sprint 10 |
| Performance below 90 Lighthouse | Medium | Medium | Sprint 10 dedicated to performance audit |
