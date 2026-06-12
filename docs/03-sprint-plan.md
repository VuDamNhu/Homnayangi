# Sprint Plan

## Sprint 0 — Product Design ✅ (current)

**Goal:** Finalize documentation, architecture, and task breakdown before writing any code.

### Tasks

- [x] Write product vision document
- [x] Define core hierarchy (Category → Dish → Recipe)
- [x] Write CLAUDE.md project reference
- [x] Design system architecture (`docs/01-architecture.md`)
- [x] Design database schema (`docs/02-database-schema.md`)
- [x] Write API design (`docs/04-api-design.md`)
- [x] Write this sprint plan

### Deliverables

- `CLAUDE.md`
- `docs/01-architecture.md`
- `docs/02-database-schema.md`
- `docs/03-sprint-plan.md`
- `docs/04-api-design.md`

---

## Sprint 1 — User Website MVP

**Goal:** Static/mock-data frontend. No database. Users can browse, search, and view dishes.

### Setup Tasks

- [ ] Initialize Next.js 15 project with TypeScript strict mode
- [ ] Configure TailwindCSS
- [ ] Install and configure shadcn/ui
- [ ] Set up absolute imports (`@/`)
- [ ] Create folder structure as per CLAUDE.md
- [ ] Add ESLint + Prettier config
- [ ] Create `.env.example`
- [ ] Set up mock data files in `src/lib/mock/`

### Layout & Navigation

- [ ] Create root layout (`app/layout.tsx`) with font, metadata, providers
- [ ] Build `Header` component — logo, nav links, search bar, auth buttons
- [ ] Build `Footer` component
- [ ] Create `(public)` route group layout
- [ ] Mobile responsive navigation (hamburger menu)

### Home Page (`/`)

- [ ] Hero section — headline + CTA ("Random Dish" button)
- [ ] Category filter bar (Normal / Vegetarian / Diet)
- [ ] Featured dishes grid (static mock data)
- [ ] Random dish button with animation
- [ ] Banner carousel (static)

### Category Page (`/categories/[slug]`)

- [ ] Category header with image and description
- [ ] Dish grid with pagination controls (UI only)
- [ ] Active category filter highlight

### Dish Detail Page (`/dishes/[slug]`)

- [ ] Dish hero image + title
- [ ] Nutrition info card (calories, protein, fat, carbs)
- [ ] Cooking time + servings + difficulty badges
- [ ] Description block
- [ ] Recipe list — multiple recipe cards for the same dish
- [ ] Each recipe card expands to show:
  - Ingredient list
  - Step-by-step instructions
  - YouTube video embed
- [ ] "Add to Favorites" button (UI only, not functional yet)
- [ ] Nearby restaurants placeholder section

### Search Page (`/search`)

- [ ] Search input with debounce
- [ ] Results list (mock data filtered client-side)
- [ ] Empty state
- [ ] Loading skeleton

### Random Dish Feature

- [ ] "Random Dish" button on Home
- [ ] Client-side random selection from mock dish list
- [ ] Animate card appearance on random
- [ ] Category filter respected (normal/vegetarian/diet)

### Shared Components

- [ ] `DishCard` — image, name, category, calories, cooking time
- [ ] `RecipeCard` — source, image, collapsible detail
- [ ] `NutritionBadge` — compact inline display
- [ ] `DifficultyBadge`
- [ ] `SkeletonCard` — loading placeholder
- [ ] `EmptyState`
- [ ] `Pagination`

---

## Sprint 2 — Admin CMS

**Goal:** Admin panel with full CRUD UI. Still no real database — uses mock data or local state.

### Admin Layout

- [ ] Create `(admin)` route group with separate layout
- [ ] Admin sidebar with navigation links
- [ ] Admin header with user info and logout
- [ ] Breadcrumb component
- [ ] Protect `(admin)/*` with middleware stub (redirect non-admin to login)

### Dashboard (`/admin/dashboard`)

- [ ] Stats cards: total dishes, recipes, categories, users
- [ ] Top searched dishes table (mock)
- [ ] Trending dishes chart (mock, use recharts or shadcn charts)
- [ ] Recent activity feed (mock)

### Dish Management (`/admin/dishes`)

- [ ] Dish list table — sortable, filterable by category/type/status
- [ ] Paginated table (UI pagination)
- [ ] Create dish form:
  - Name, slug (auto-generated), description, image URL
  - Category selector, type selector
  - Nutrition fields (calories, protein, fat, carbs)
  - Cooking time, servings, difficulty
  - Tags input
  - SEO fields (meta title, meta description)
  - Active toggle
- [ ] Edit dish (pre-filled form)
- [ ] Delete dish (confirmation dialog)
- [ ] Inline status toggle

### Recipe Management (`/admin/recipes`)

- [ ] Recipe list table filterable by dish
- [ ] Create recipe form:
  - Dish selector (linked to dish)
  - Title, source, source URL, description
  - Image URL, YouTube URL
  - Servings, cooking time, difficulty
  - Nutrition fields
  - Ingredient list builder (add/remove ingredient rows: ingredient, amount, unit, note)
  - Step-by-step instruction builder (add/remove steps with optional image)
  - Active toggle
- [ ] Edit recipe
- [ ] Delete recipe

### Category Management (`/admin/categories`)

- [ ] Category list with drag-to-reorder (UI only)
- [ ] Create/edit category form: name, slug, description, image, type, SEO
- [ ] Delete category

### Ingredient Management (`/admin/ingredients`)

- [ ] Ingredient list table — searchable
- [ ] Create/edit form: name, Vietnamese name, nutrition per 100g, default unit, category
- [ ] Delete ingredient

### User Management (`/admin/users`)

- [ ] User list table
- [ ] View user detail
- [ ] Change role (USER ↔ ADMIN)
- [ ] Deactivate/activate user

### Banner Management (`/admin/banners`)

- [ ] Banner list with order controls
- [ ] Create/edit form: title, image, link, start/end dates, active
- [ ] Delete banner

---

## Sprint 3 — MongoDB + API

**Goal:** Connect everything to a real database. Replace all mock data with live API calls.

### Database Setup

- [ ] Create MongoDB Atlas cluster (free tier for dev)
- [ ] Configure network access and database user
- [ ] Add connection string to `.env.local`
- [ ] Create `src/lib/db/connect.ts` — singleton Mongoose connection
- [ ] Create Mongoose models for all schemas in `src/models/`
- [ ] Write seed script `scripts/seed.ts` — populate 5+ categories, 20+ dishes, 40+ recipes, 50+ ingredients
- [ ] Test seed script

### API Routes — Dishes

- [ ] `GET /api/dishes` — list with pagination, filter by category/type, search
- [ ] `GET /api/dishes/random` — weighted random by type
- [ ] `GET /api/dishes/[slug]` — dish detail with populated recipes
- [ ] `POST /api/dishes` — create (admin)
- [ ] `PUT /api/dishes/[id]` — update (admin)
- [ ] `DELETE /api/dishes/[id]` — soft delete (admin)
- [ ] `POST /api/dishes/[id]/view` — increment viewCount

### API Routes — Recipes

- [ ] `GET /api/recipes?dishId=` — list recipes for a dish
- [ ] `GET /api/recipes/[id]` — recipe detail with ingredients
- [ ] `POST /api/recipes` — create (admin)
- [ ] `PUT /api/recipes/[id]` — update (admin)
- [ ] `DELETE /api/recipes/[id]` — soft delete (admin)

### API Routes — Categories

- [ ] `GET /api/categories` — list all active categories
- [ ] `GET /api/categories/[slug]` — category detail with dishes
- [ ] `POST /api/categories` — create (admin)
- [ ] `PUT /api/categories/[id]` — update (admin)
- [ ] `DELETE /api/categories/[id]` — soft delete (admin)

### API Routes — Ingredients

- [ ] `GET /api/ingredients` — list with search
- [ ] `POST /api/ingredients` — create (admin)
- [ ] `PUT /api/ingredients/[id]` — update (admin)
- [ ] `DELETE /api/ingredients/[id]` — hard delete (no soft delete needed)

### API Routes — Search

- [ ] `GET /api/search?q=&type=` — full-text search on dishes
- [ ] Create MongoDB text index on Dish `name` and `tags`

### Frontend Integration

- [ ] Replace all mock data fetches with real API calls
- [ ] Add loading states (React Suspense + skeleton components)
- [ ] Add error states
- [ ] Enable ISR on dish detail and category pages

---

## Sprint 4 — Authentication

**Goal:** Users can register, log in, and log out. Admins are locked behind role check.

### NextAuth Setup

- [ ] Install NextAuth.js v5
- [ ] Configure `src/lib/auth/config.ts` with:
  - Credentials provider (email + password)
  - Google OAuth (optional, can defer)
- [ ] Create `app/api/auth/[...nextauth]/route.ts`
- [ ] Add `NEXTAUTH_SECRET` to env
- [ ] Create Next.js middleware for route protection

### User Registration

- [ ] `POST /api/auth/register` — create user, hash password with bcrypt
- [ ] Registration page (`/register`): name, email, password, confirm password
- [ ] Form validation (client + server)
- [ ] Redirect to home after registration

### Login / Logout

- [ ] Login page (`/login`): email, password
- [ ] Show error on invalid credentials
- [ ] Redirect to intended URL after login
- [ ] Logout button in Header

### Session in UI

- [ ] Show user name/avatar in Header when logged in
- [ ] Show login/register buttons when not logged in
- [ ] "Add to Favorites" button — prompt login if not authenticated

### Admin Protection

- [ ] Middleware: redirect `(admin)/*` to `/login` if not ADMIN
- [ ] API routes: validate session + role on all write operations
- [ ] Show 403 page if USER tries to access admin

---

## Sprint 5 — Favorites + History

**Goal:** Users can save favorite dishes/recipes and view their browsing history.

### Favorites API

- [ ] `GET /api/favorites` — list user's favorites (auth required)
- [ ] `POST /api/favorites` — add favorite `{ type, targetId }`
- [ ] `DELETE /api/favorites/[id]` — remove favorite
- [ ] `GET /api/favorites/check?type=&targetId=` — check if item is favorited

### Favorites UI

- [ ] Favorites page (`/favorites`) — tabbed: Dishes | Recipes
- [ ] Filled/unfilled heart toggle on DishCard and RecipeCard
- [ ] Optimistic UI update on toggle
- [ ] Remove from favorites on favorites page

### View History

- [ ] `POST /api/dishes/[id]/view` — record view (userId or sessionId)
- [ ] Auto-fire on dish detail page load (Server Action or Effect)
- [ ] Increment `Dish.viewCount` atomically

### Search History

- [ ] Log each search to SearchHistory on query submit
- [ ] Show recent searches in search bar dropdown (last 5, from API)
- [ ] `DELETE /api/search/history` — clear user's search history

---

## Sprint 6 — AI Nutrition

**Goal:** Automatically estimate nutrition values for recipes using Claude API.

### AI Integration

- [ ] Add Anthropic SDK to project
- [ ] Create `src/lib/ai/nutrition.ts` — prompt builder and parser
- [ ] `POST /api/ai/nutrition` — accepts ingredient list, returns nutrition estimates
- [ ] Rate limit this endpoint (max 20 requests/minute per admin user)
- [ ] Add `ANTHROPIC_API_KEY` to env

### Prompt Design

- [ ] Design system prompt for nutrition estimation
- [ ] Input format: `[{ name, amount, unit }]`
- [ ] Output format: `{ calories, protein, fat, carbohydrates, perServing, confidence }`
- [ ] Handle unit conversion (g, ml, tbsp, cup, piece) in prompt
- [ ] Handle unknown ingredients gracefully (return null with note)

### Admin Integration

- [ ] "Estimate Nutrition" button in Recipe form
- [ ] Trigger only after ingredients are filled
- [ ] Show loading state during API call
- [ ] Auto-fill nutrition fields on response
- [ ] Allow admin to override AI estimates
- [ ] Show confidence indicator

### Nutrition Display

- [ ] Detailed nutrition breakdown on Dish detail page
- [ ] Per-serving vs per-100g toggle
- [ ] Macro chart (pie or bar) using shadcn charts

---

## Sprint 7 — Restaurant Recommendation

**Goal:** Show nearby restaurants serving the selected dish.

### Google Maps Setup

- [ ] Enable Google Maps Places API (New) in Google Cloud Console
- [ ] Add `GOOGLE_MAPS_API_KEY` to env (server-only)
- [ ] Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (client map embed)

### API

- [ ] `GET /api/restaurants/nearby?dishName=&lat=&lng=&radius=` — query Places API
- [ ] Cache results in sessionStorage on client (10 min TTL)
- [ ] Handle API errors gracefully (quota exceeded, no results)

### Location

- [ ] Request user geolocation in browser (`navigator.geolocation`)
- [ ] Fallback: ask user to type a location
- [ ] Store last known location in localStorage

### Restaurant Display

- [ ] `NearbyRestaurants` component on Dish detail page
- [ ] List view: name, rating stars, distance, open/closed status, address
- [ ] "View on Google Maps" link per restaurant
- [ ] Loading and empty states
- [ ] Error state (location denied, API error)

---

## Sprint 8 — Analytics + SEO

**Goal:** Track user behavior and maximize search engine visibility.

### Analytics Tracking

- [ ] `POST /api/analytics/pageview` — log page views
- [ ] Fire on every page navigation (client-side, non-blocking)
- [ ] Extract dishId from path when on a dish page
- [ ] Admin analytics dashboard — real data:
  - Views per day chart (last 30 days)
  - Top 10 most-viewed dishes
  - Top 10 search keywords
  - Views by category

### SEO — Metadata

- [ ] `generateMetadata()` on all public pages (reads from DB seo sub-document)
- [ ] Fallback metadata for pages without custom SEO
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`)
- [ ] Twitter card tags

### SEO — Technical

- [ ] `app/sitemap.ts` — dynamic sitemap including all active dishes and categories
- [ ] `app/robots.ts` — allow public, disallow admin
- [ ] Canonical URLs on all pages
- [ ] JSON-LD Recipe structured data on dish detail pages
- [ ] Verify with Google Rich Results Test

### Admin SEO Management

- [ ] SEO editor on Dish and Category forms (already in forms from Sprint 2)
- [ ] SEO overview page (`/admin/seo`) — list pages missing meta title/description
- [ ] Bulk SEO status report

---

## Sprint 9 — Crawler + Automation

**Goal:** Automate recipe data collection from external sources.

### Crawler Architecture

- [ ] Create `scripts/crawlers/` directory
- [ ] Base crawler class: fetch URL, parse HTML (Cheerio), extract structured data
- [ ] Respect `robots.txt` and rate limits

### Source Crawlers

- [ ] Cookpad crawler — extract: title, ingredients, steps, image, servings
- [ ] Dien May Xanh crawler
- [ ] (extensible to other sources)

### Data Pipeline

- [ ] Normalize raw crawled data to Recipe schema
- [ ] Match ingredients to existing Ingredient documents (fuzzy match)
- [ ] Create new Ingredient stubs for unmatched ingredients
- [ ] Flag crawled recipes for admin review before publishing
- [ ] Admin "Pending Review" queue in recipe management

### Automation

- [ ] Schedule crawl runs (cron job via Vercel Cron or GitHub Actions)
- [ ] Deduplication — skip if recipe with same sourceUrl already exists
- [ ] Crawl log model: source, url, status, error message, createdAt

---

## Sprint 10 — Production Deployment

**Goal:** Ship to production with monitoring, performance, and security hardened.

### Infrastructure

- [ ] Create Vercel project and connect GitHub repo
- [ ] Configure production environment variables in Vercel dashboard
- [ ] Create MongoDB Atlas production cluster (M10+)
- [ ] Set up Cloudinary (or Vercel Blob) for image uploads
- [ ] Configure custom domain + SSL

### Image Upload (Admin)

- [ ] Replace image URL input with file upload component
- [ ] Upload to Cloudinary on form submit
- [ ] Store returned URL in DB
- [ ] Show image preview in form

### Performance

- [ ] Run Lighthouse audit — target 90+ on all metrics
- [ ] Optimize largest LCP images (priority hint, preload)
- [ ] Review and reduce bundle size (next-bundle-analyzer)
- [ ] Add `loading="lazy"` to below-fold images
- [ ] Verify ISR is working (check `x-nextjs-cache` headers)

### Security

- [ ] Review all API routes for missing auth checks
- [ ] Add input sanitization on all write endpoints
- [ ] Set security headers in `next.config.ts` (CSP, HSTS, X-Frame-Options)
- [ ] Rate limiting on auth endpoints (prevent brute force)
- [ ] Rotate all secrets, ensure no secrets in git history

### Monitoring

- [ ] Set up Sentry for error tracking (frontend + backend)
- [ ] Configure Vercel Analytics for web vitals
- [ ] Set up MongoDB Atlas alerts (high connections, slow queries)
- [ ] Add health check endpoint `GET /api/health`

### Launch Checklist

- [ ] Test all user flows end-to-end in production
- [ ] Test admin flows end-to-end
- [ ] Verify sitemap is accessible and submitted to Google Search Console
- [ ] Confirm all environment variables are set
- [ ] Confirm MongoDB indexes are created
- [ ] Test mobile responsiveness on real devices
- [ ] Load test with k6 or similar (simulate 100 concurrent users)
