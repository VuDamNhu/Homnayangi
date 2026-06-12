# Routing Architecture — Recipe AI

Next.js 15 App Router. All routing is file-system based under `src/app/`.

---

## Architecture Principles

- **Guest-first.** Every public page is fully accessible without any account, login, or session.
- **No user registration or login.** The only authentication in the system is for administrators.
- **Admin-only auth.** All `/admin/*` routes are protected by NextAuth middleware. Any unauthenticated request is redirected to `/admin/login`.
- **SEO-optimised public pages.** All indexable public pages use ISR or static generation. Non-indexable pages (`/random`, `/lucky-wheel`) are `noindex`.
- **Middleware-enforced auth.** The auth guard runs at the Edge before any page component is rendered — no admin page can be reached without a valid session.

---

## Route Group Structure

```
src/app/
├── (public)/               # Guest-accessible pages — shared Header + Footer layout
│   ├── layout.tsx
│   ├── page.tsx                          # /
│   ├── search/page.tsx                   # /search
│   ├── dish/[slug]/page.tsx              # /dish/[slug]
│   ├── recipe/[slug]/page.tsx            # /recipe/[slug]
│   ├── category/[slug]/page.tsx          # /category/[slug]
│   ├── random/page.tsx                   # /random
│   ├── lucky-wheel/page.tsx              # /lucky-wheel
│   ├── ingredients/page.tsx              # /ingredients
│   ├── restaurants/page.tsx              # /restaurants
│   ├── about/page.tsx                    # /about
│   └── contact/page.tsx                  # /contact
│
├── (admin)/                # Admin panel — protected, separate layout
│   ├── layout.tsx
│   ├── admin/
│   │   ├── login/page.tsx                # /admin/login
│   │   ├── dashboard/page.tsx            # /admin/dashboard
│   │   ├── dishes/
│   │   │   ├── page.tsx                  # /admin/dishes
│   │   │   ├── new/page.tsx              # /admin/dishes/new
│   │   │   └── [id]/page.tsx             # /admin/dishes/[id]
│   │   ├── recipes/
│   │   │   ├── page.tsx                  # /admin/recipes
│   │   │   ├── new/page.tsx              # /admin/recipes/new
│   │   │   └── [id]/page.tsx             # /admin/recipes/[id]
│   │   ├── categories/
│   │   │   ├── page.tsx                  # /admin/categories
│   │   │   └── [id]/page.tsx             # /admin/categories/[id]
│   │   ├── ingredients/
│   │   │   ├── page.tsx                  # /admin/ingredients
│   │   │   └── [id]/page.tsx             # /admin/ingredients/[id]
│   │   ├── banners/
│   │   │   ├── page.tsx                  # /admin/banners
│   │   │   └── [id]/page.tsx             # /admin/banners/[id]
│   │   ├── feedbacks/page.tsx            # /admin/feedbacks
│   │   ├── notifications/page.tsx        # /admin/notifications
│   │   ├── analytics/page.tsx            # /admin/analytics
│   │   └── settings/page.tsx             # /admin/settings
│
├── api/                    # Route Handlers — server-only
│   └── ...
│
├── not-found.tsx           # Global 404
├── error.tsx               # Global error boundary
└── middleware.ts           # Auth guard for /admin/*
```

---

## Middleware — Auth Guard

`src/middleware.ts` runs at the Vercel Edge before any page renders.

| Rule | Behaviour |
|---|---|
| Request path matches `/admin/*` (except `/admin/login`) | Check NextAuth session cookie. No session → redirect to `/admin/login` |
| Request path matches `/admin/login` | If session exists, redirect to `/admin/dashboard` |
| All other paths | Pass through — no auth check |

The middleware is the single enforcement point for all admin routes. Individual page components do not need to repeat the session check.

---

## Public Routes

---

### `/` — Home Page

| Field | Detail |
|---|---|
| **Purpose** | Landing page and primary entry point. Answers "What should I eat today?" with a random dish CTA, diet mode selector, featured categories, and a curated dish grid. |
| **SEO importance** | Very high — highest-traffic page; targets brand keywords and general food discovery queries |
| **Authentication** | None |
| **Render strategy** | ISR — `revalidate: 300` (5 minutes); on-demand revalidation when dishes or banners change |
| **Robots** | `index, follow` |
| **Canonical** | `https://recipeai.vn/` |

**Related modules:** `dishes`, `categories`, `random`, `banners`

**Expected page components:**
```
(public)/page.tsx
├── BannerCarousel
├── RandomDishHero
│   ├── DietModeSelector
│   └── RandomDishButton
├── RandomResultCard          ← appears after random button tap
├── SectionHeading
├── CategoryFilterBar
├── SectionHeading
└── DishGrid
    └── DishCard (×6–12)
```

---

### `/search` — Search Page

| Field | Detail |
|---|---|
| **Purpose** | Full-text dish search. Users type a keyword and receive a filtered, paginated list of matching dishes. |
| **SEO importance** | Low — search result pages are `noindex` to prevent thin/duplicate content |
| **Authentication** | None |
| **Render strategy** | Dynamic — `no-store`; every request is live |
| **Robots** | `noindex, follow` |
| **Canonical** | Not set |

**Related modules:** `search`, `dishes`, `categories`

**Expected page components:**
```
(public)/search/page.tsx
├── SearchBar               ← expanded, focused, pre-filled with ?q value
├── CategoryFilterBar
├── [results exist]
│   ├── SectionHeading ("{N} kết quả cho '{query}'")
│   ├── DishGrid
│   │   └── DishCard (×N)
│   └── Pagination
└── [no results]
    └── EmptyState
        └── RandomDishButton
```

---

### `/dish/[slug]` — Dish Detail Page

| Field | Detail |
|---|---|
| **Purpose** | The most important content page. Displays full dish information: cover image, description, category, diet type, nutritional data, cooking time, serving size, recipe recommendations from multiple sources, ingredient suggestion tool, and nearby restaurant section. |
| **SEO importance** | Very high — primary target for recipe and food keyword traffic; each dish is an independent indexable document |
| **Authentication** | None |
| **Render strategy** | ISR — `revalidate: 600` (10 minutes); on-demand revalidation when dish or its recipes change |
| **Robots** | `index, follow` |
| **Canonical** | `https://recipeai.vn/dish/[slug]` |
| **Structured data** | `Recipe` JSON-LD schema |
| **Slug fallback** | If slug not found, check `previousSlugs[]` → 301 redirect to current slug, or `notFound()` |

**Related modules:** `dishes`, `recipes`, `nutrition`, `ingredients`, `restaurants`

**Expected page components:**
```
(public)/dish/[slug]/page.tsx
├── DishHero
│   ├── ImageWithFallback     ← priority LCP
│   ├── CategoryBadge
│   └── DietTypeBadge
├── PageContainer
│   ├── DishDescription
│   ├── DishMeta              ← cook time, servings, category, type
│   ├── NutritionPanel        ← hidden if no nutrition data
│   │   └── NutritionRow (×5)
│   ├── SectionHeading ("Công thức nấu")
│   ├── RecipeList
│   │   └── RecipeCard (×N)
│   │       └── RecipeSourceBadge
│   ├── SectionHeading ("Gợi ý theo nguyên liệu")
│   ├── IngredientSuggestionPanel
│   │   ├── IngredientTagInput
│   │   └── IngredientMatchResult
│   ├── SectionHeading ("Nhà hàng gần đây")
│   └── NearbyRestaurantsSection
│       ├── GeolocationPrompt
│       ├── NearbyMap
│       └── RestaurantList
│           └── RestaurantCard (×N)
```

---

### `/recipe/[slug]` — Recipe Detail Page

| Field | Detail |
|---|---|
| **Purpose** | Displays detailed cooking instructions, ingredient list, step-by-step guide, and the original source attribution for a single recipe. Linked from the dish detail page's recipe cards. |
| **SEO importance** | Very high — targets specific recipe and cooking method queries; each recipe is a standalone indexable page |
| **Authentication** | None |
| **Render strategy** | ISR — `revalidate: 600`; on-demand revalidation when recipe data changes |
| **Robots** | `index, follow` |
| **Canonical** | `https://recipeai.vn/recipe/[slug]` |
| **Structured data** | `Recipe` JSON-LD schema with full ingredient and step data |

**Related modules:** `recipes`, `dishes`, `ingredients`, `nutrition`

**Expected page components:**
```
(public)/recipe/[slug]/page.tsx
├── RecipeHero
│   ├── ImageWithFallback     ← recipe cover, priority LCP
│   ├── RecipeSourceBadge
│   └── DishBreadcrumb        ← link back to parent dish
├── PageContainer
│   ├── RecipeMeta            ← cook time, servings, difficulty
│   ├── NutritionPanel        ← inherited from parent dish if available
│   ├── SectionHeading ("Nguyên liệu")
│   ├── RecipeIngredientList
│   ├── SectionHeading ("Cách làm")
│   ├── RecipeStepList
│   │   └── RecipeStep (×N)   ← numbered, with optional step image
│   └── RecipeSourceLink      ← "Xem công thức gốc tại {source}"
```

---

### `/category/[slug]` — Category Page

| Field | Detail |
|---|---|
| **Purpose** | Displays all published dishes within a specific category (e.g. Normal, Vegetarian, Diet, Soup, Stir-fry, Dessert). Supports sorting and pagination. |
| **SEO importance** | High — targets category-level food keywords; aggregates multiple dish pages under a thematic URL |
| **Authentication** | None |
| **Render strategy** | ISR — `revalidate: 600`; on-demand revalidation when category or its dishes change |
| **Robots** | `index, follow` |
| **Canonical** | `https://recipeai.vn/category/[slug]` |
| **Structured data** | `ItemList` JSON-LD schema |

**Related modules:** `categories`, `dishes`

**Expected page components:**
```
(public)/category/[slug]/page.tsx
├── CategoryHero
│   ├── ImageWithFallback     ← category cover
│   └── SectionHeading        ← category name + dish count
├── PageContainer
│   ├── SortBar               ← sort by: newest, popular, name
│   ├── DishGrid
│   │   └── DishCard (×N)
│   └── Pagination
```

---

### `/random` — Random Dish Page

| Field | Detail |
|---|---|
| **Purpose** | Resolves a random dish server-side based on the active diet mode and immediately redirects to `/dish/[slug]`. Acts as a shareable "surprise me" URL. |
| **SEO importance** | Low — no stable content; redirects on every request |
| **Authentication** | None |
| **Render strategy** | Dynamic — `no-store`; random selection on every request |
| **Robots** | `noindex, nofollow` |
| **Canonical** | Not set |
| **Behaviour** | Server Component calls `GET /api/dishes/random`, receives a slug, calls `redirect('/dish/' + slug)` — user never sees this page render |

**Related modules:** `dishes`, `random`

**Expected page components:**
```
(public)/random/page.tsx
└── (no UI — server-side redirect only)
    LoadingSpinner            ← shown only if redirect is slow (rare)
```

---

### `/lucky-wheel` — Lucky Wheel Page

| Field | Detail |
|---|---|
| **Purpose** | Interactive spinning wheel that visually selects a dish category or dish for the user. Adds a playful, gamified entry point to the random dish feature. |
| **SEO importance** | Low — interactive tool, not a content page |
| **Authentication** | None |
| **Render strategy** | Static shell + client interaction; wheel state is entirely client-side |
| **Robots** | `noindex, follow` |
| **Canonical** | Not set |

**Related modules:** `random`, `dishes`

**Expected page components:**
```
(public)/lucky-wheel/page.tsx
├── DietModeSelector
├── LuckyWheel
│   ├── WheelCanvas           ← animated SVG wheel with category segments
│   ├── WheelPointer          ← fixed arrow indicator
│   └── SpinButton            ← "Quay ngẫu nhiên!"
└── [after spin completes]
    └── RandomResultCard
        ├── ImageWithFallback
        ├── CategoryBadge
        ├── DietTypeBadge
        └── "Xem món này" → /dish/[slug]
```

---

### `/ingredients` — Ingredient Suggestion Page

| Field | Detail |
|---|---|
| **Purpose** | Allows users to enter the ingredients they have at home and receive AI-powered dish suggestions that match those ingredients. Standalone page version of the ingredient panel on the dish detail page. |
| **SEO importance** | Medium — targets "what to cook with X" queries; useful evergreen content |
| **Authentication** | None |
| **Render strategy** | Static shell (ISR) + client interaction for the AI call |
| **Robots** | `index, follow` |
| **Canonical** | `https://recipeai.vn/ingredients` |

**Related modules:** `ingredients`, `nutrition`, `dishes`, `recipes`

**Expected page components:**
```
(public)/ingredients/page.tsx
├── SectionHeading ("Tôi có gì trong tủ lạnh?")
├── IngredientSuggestionPanel
│   ├── IngredientTagInput
│   │   └── Autocomplete dropdown
│   └── "Tìm món" submit button
├── [results state]
│   ├── SectionHeading ("Món bạn có thể nấu")
│   └── IngredientMatchResult
│       └── MatchResultCard (×N)
│           ├── DishCard (mini)
│           ├── Match percentage bar
│           └── Missing ingredients list
└── [empty state]
    └── EmptyState
        └── RandomDishButton
```

---

### `/restaurants` — Nearby Restaurant Page

| Field | Detail |
|---|---|
| **Purpose** | Recommends nearby restaurants that serve dishes matching the user's current context (from the dish they were viewing, or general food search). Uses the browser's geolocation API and Google Maps Places API. |
| **SEO importance** | Low — content depends on real-time geolocation; not indexable per-user |
| **Authentication** | None |
| **Render strategy** | Static shell + fully client-driven (geolocation + Places API call) |
| **Robots** | `noindex, follow` |
| **Canonical** | Not set |

**Related modules:** `restaurants`

**Expected page components:**
```
(public)/restaurants/page.tsx
├── SectionHeading ("Nhà hàng gần bạn")
│
├── [state: permission not granted]
│   └── GeolocationPrompt
│
├── [state: loading]
│   └── LoadingSpinner
│
├── [state: results]
│   ├── NearbyMap
│   │   └── RestaurantPin (×N)
│   └── RestaurantList
│       └── RestaurantCard (×N)
│           ├── Name + distance
│           ├── RatingStars
│           └── Open / Closed badge
│
├── [state: zero results]
│   └── EmptyState ("Không tìm thấy nhà hàng gần bạn")
│
└── [state: permission denied / error]
    └── EmptyState ("Không thể lấy vị trí")
```

---

### `/about` — About Page

| Field | Detail |
|---|---|
| **Purpose** | Introduces the website — its mission, how it works, the team behind it, and why it was built. Builds trust and brand awareness. |
| **SEO importance** | Medium — supports brand queries; provides internal linking anchor for other pages |
| **Authentication** | None |
| **Render strategy** | Static — content rarely changes |
| **Robots** | `index, follow` |
| **Canonical** | `https://recipeai.vn/about` |

**Related modules:** None (static content)

**Expected page components:**
```
(public)/about/page.tsx
├── HeroBanner              ← mission statement + illustration
├── SectionHeading ("Chúng tôi là ai")
├── AboutText               ← rich text content block
├── SectionHeading ("Cách hoạt động")
├── HowItWorksList          ← 3–4 step explainer
└── CallToActionBanner      ← link to Home or Lucky Wheel
```

---

### `/contact` — Contact Page

| Field | Detail |
|---|---|
| **Purpose** | Provides a way for users to send messages to administrators — feedback, bug reports, recipe suggestions, or general enquiries. Submissions are stored in MongoDB and visible in `/admin/feedbacks`. |
| **SEO importance** | Medium — standard trust signal; supports brand queries |
| **Authentication** | None |
| **Render strategy** | Static shell + client form submission |
| **Robots** | `index, follow` |
| **Canonical** | `https://recipeai.vn/contact` |

**Related modules:** `feedbacks`

**Expected page components:**
```
(public)/contact/page.tsx
├── SectionHeading ("Liên hệ với chúng tôi")
├── ContactForm
│   ├── Input: Name
│   ├── Input: Email
│   ├── Select: Subject (Feedback / Bug report / Recipe suggestion / Other)
│   ├── Textarea: Message
│   └── Submit button
└── [success state]
    └── SuccessMessage ("Cảm ơn! Chúng tôi sẽ phản hồi sớm.")
```

---

### `/not-found` — 404 Page

| Field | Detail |
|---|---|
| **Purpose** | Handles all unmatched routes and explicit `notFound()` calls from Server Components. Provides a branded recovery experience. |
| **SEO importance** | None — returns HTTP 404 status |
| **Authentication** | None |
| **Render strategy** | Static |
| **Robots** | `noindex, nofollow` |

**Related modules:** None

**Expected page components:**
```
app/not-found.tsx
├── Header
├── PageContainer
│   ├── ErrorIllustration     ← 404 graphic
│   ├── SectionHeading ("Trang không tìm thấy")
│   ├── "Về trang chủ" button → /
│   └── RandomDishButton      ← secondary CTA
└── Footer
```

---

## Admin Routes

All admin routes are protected by the Edge middleware. Unauthenticated requests are redirected to `/admin/login` before any page component runs.

---

### `/admin/login` — Admin Login

| Field | Detail |
|---|---|
| **Purpose** | The only authentication page in the entire application. Accepts email and password credentials and creates a NextAuth session. |
| **SEO importance** | None |
| **Authentication** | Not required — if already authenticated, redirects to `/admin/dashboard` |
| **Render strategy** | Static shell + client form |
| **Robots** | `noindex, nofollow` |

**Related modules:** `auth`

**Expected page components:**
```
(admin)/admin/login/page.tsx
└── LoginCard (centred, no sidebar)
    ├── Site logo
    ├── Input: Email
    ├── Input: Password (show/hide toggle)
    ├── "Đăng nhập" submit button
    └── ErrorMessage (inline — wrong credentials)
```

---

### `/admin/dashboard` — Admin Dashboard

| Field | Detail |
|---|---|
| **Purpose** | High-level overview of system health, content counts, recent activity, and quick-action shortcuts. First page after login. |
| **SEO importance** | None |
| **Authentication** | Required |
| **Render strategy** | Dynamic — `no-store`; always reads live counts |

**Related modules:** `admin`, `dishes`, `recipes`, `categories`, `analytics`

**Expected page components:**
```
(admin)/admin/dashboard/page.tsx
├── AdminLayout
└── PageContainer
    ├── StatsRow
    │   ├── StatsCard ("Tổng món ăn")
    │   ├── StatsCard ("Công thức")
    │   ├── StatsCard ("Danh mục")
    │   └── StatsCard ("Lượt xem hôm nay")
    ├── SectionHeading ("Hoạt động gần đây")
    ├── RecentActivityList
    └── QuickActionGrid
        ├── QuickActionCard → /admin/dishes/new
        ├── QuickActionCard → /admin/recipes/new
        ├── QuickActionCard → /admin/categories
        └── QuickActionCard → /admin/banners
```

---

### `/admin/dishes` — Dish Management

| Field | Detail |
|---|---|
| **Purpose** | Full CRUD for dishes. Admins can create, edit, publish/unpublish, and delete dishes. |
| **SEO importance** | None |
| **Authentication** | Required |
| **Render strategy** | Dynamic |

**Related modules:** `admin`, `dishes`, `categories`

**Sub-routes:**

| Path | Purpose |
|---|---|
| `/admin/dishes` | List view — searchable, filterable, paginated DataTable |
| `/admin/dishes/new` | Create form |
| `/admin/dishes/[id]` | Edit form |

**Expected page components:**
```
/admin/dishes
├── AdminLayout
└── PageContainer
    ├── FilterBar (SearchBar, CategoryFilter, DietTypeFilter, StatusFilter)
    ├── "Thêm món" button → /admin/dishes/new
    └── DataTable
        └── Columns: Thumbnail, Name/Slug, Category, Type, Status (PublishToggle),
                     Recipe count, Updated at, Actions (Edit, Delete)

/admin/dishes/new and /admin/dishes/[id]
├── AdminLayout
└── AdminDishForm
    ├── ImageUploadField
    ├── Input: Name, Slug, Description
    ├── Select: Category, Diet type
    ├── PublishToggle
    ├── NutritionParseButton  ← edit mode only
    └── FormActions (Save, Cancel)
```

---

### `/admin/recipes` — Recipe Management

| Field | Detail |
|---|---|
| **Purpose** | Full CRUD for recipes. Each recipe belongs to a dish and has a source (Cookpad, Dien May Xanh, Savoury Days, etc.) with ingredients and steps. |
| **SEO importance** | None |
| **Authentication** | Required |
| **Render strategy** | Dynamic |

**Related modules:** `admin`, `recipes`, `dishes`, `ingredients`

**Sub-routes:**

| Path | Purpose |
|---|---|
| `/admin/recipes` | List view |
| `/admin/recipes/new` | Create form |
| `/admin/recipes/[id]` | Edit form |

**Expected page components:**
```
/admin/recipes
├── AdminLayout
└── PageContainer
    ├── FilterBar (SearchBar, DishFilter, SourceFilter)
    ├── "Thêm công thức" button
    └── DataTable
        └── Columns: Thumbnail, Title, Dish, Source (RecipeSourceBadge),
                     Ingredient count, Updated at, Actions

/admin/recipes/new and /admin/recipes/[id]
├── AdminLayout
└── AdminRecipeForm
    ├── Select: Parent dish
    ├── Input: Title, Source name, Source URL
    ├── ImageUploadField
    ├── RecipeIngredientBuilder   ← dynamic add/remove ingredient rows
    ├── RecipeStepBuilder         ← dynamic add/remove step rows
    └── FormActions (Save, Cancel)
```

---

### `/admin/categories` — Category Management

| Field | Detail |
|---|---|
| **Purpose** | Create, edit, and delete dish categories. Controls the category taxonomy used across the public site. |
| **SEO importance** | None |
| **Authentication** | Required |
| **Render strategy** | Dynamic |

**Related modules:** `admin`, `categories`

**Sub-routes:**

| Path | Purpose |
|---|---|
| `/admin/categories` | List view |
| `/admin/categories/[id]` | Edit form |

**Expected page components:**
```
/admin/categories
├── AdminLayout
└── PageContainer
    ├── "Thêm danh mục" button
    └── DataTable
        └── Columns: Cover, Name, Slug, Dish count,
                     Display order (InlineEditField), Actions

/admin/categories/[id]
├── AdminLayout
└── CategoryForm
    ├── ImageUploadField
    ├── Input: Name, Slug
    ├── NumberInput: Display order
    └── FormActions
```

---

### `/admin/ingredients` — Ingredient Management

| Field | Detail |
|---|---|
| **Purpose** | Maintain the master ingredient library used across all recipes. Includes nutritional values per ingredient unit. |
| **SEO importance** | None |
| **Authentication** | Required |
| **Render strategy** | Dynamic |

**Related modules:** `admin`, `ingredients`, `nutrition`

**Sub-routes:**

| Path | Purpose |
|---|---|
| `/admin/ingredients` | List view |
| `/admin/ingredients/[id]` | Edit form |

**Expected page components:**
```
/admin/ingredients
├── AdminLayout
└── PageContainer
    ├── SearchBar + "Thêm nguyên liệu" button
    └── DataTable
        └── Columns: Name, Unit, Calories/100g, Used in (recipe count), Actions (Edit, Merge, Delete)

/admin/ingredients/[id]
├── AdminLayout
└── IngredientForm
    ├── Input: Name
    ├── Select: Unit (g, ml, piece, tbsp, etc.)
    ├── NutritionFields (calories, protein, carbs, fat, fiber per 100g)
    └── FormActions
```

---

### `/admin/banners` — Banner Management

| Field | Detail |
|---|---|
| **Purpose** | Manage promotional banners shown in the homepage carousel. Controls image, link, date range, display order, and active status. |
| **SEO importance** | None |
| **Authentication** | Required |
| **Render strategy** | Dynamic |

**Related modules:** `admin`, `banners`

**Sub-routes:**

| Path | Purpose |
|---|---|
| `/admin/banners` | List view |
| `/admin/banners/[id]` | Edit form |

**Expected page components:**
```
/admin/banners
├── AdminLayout
└── PageContainer
    ├── "Thêm banner" button
    └── DataTable
        └── Columns: Preview (BannerPreview), Link URL, Date range,
                     Status (active toggle), Display order (InlineEditField), Actions

/admin/banners/[id]
├── AdminLayout
└── BannerForm
    ├── ImageUploadField (aspect 3:1)
    ├── BannerPreview
    ├── Input: Link URL
    ├── DateRangePicker: Start date, End date
    ├── Toggle: Active
    └── FormActions
```

---

### `/admin/feedbacks` — Feedback Management

| Field | Detail |
|---|---|
| **Purpose** | Review and manage messages submitted by users via the `/contact` page. Admins can read, mark as reviewed, and delete feedback entries. |
| **SEO importance** | None |
| **Authentication** | Required |
| **Render strategy** | Dynamic |

**Related modules:** `admin`, `feedbacks`

**Expected page components:**
```
(admin)/admin/feedbacks/page.tsx
├── AdminLayout
└── PageContainer
    ├── FilterBar (StatusFilter: All / Unread / Reviewed, SubjectFilter)
    └── DataTable
        └── Columns: Name, Email (masked), Subject, Preview, Received at,
                     Status (Unread / Reviewed), Actions (View, Delete)
    └── FeedbackDetailDrawer (slide-in panel on row click)
        ├── Sender name + email
        ├── Subject + message body
        └── Actions (Mark reviewed, Delete)
```

---

### `/admin/notifications` — Notification Management

| Field | Detail |
|---|---|
| **Purpose** | Create and manage system notifications or announcements shown to users on the public site (e.g. maintenance windows, new feature announcements, seasonal promotions). |
| **SEO importance** | None |
| **Authentication** | Required |
| **Render strategy** | Dynamic |

**Related modules:** `admin`, `notifications`

**Expected page components:**
```
(admin)/admin/notifications/page.tsx
├── AdminLayout
└── PageContainer
    ├── "Tạo thông báo" button
    └── DataTable
        └── Columns: Title, Type (info / warning / promo), Target page,
                     Date range, Status (active toggle), Actions
    └── NotificationForm (modal or separate page)
        ├── Input: Title
        ├── Textarea: Message
        ├── Select: Type, Target page
        ├── DateRangePicker
        ├── Toggle: Active
        └── FormActions
```

---

### `/admin/analytics` — Analytics Dashboard

| Field | Detail |
|---|---|
| **Purpose** | Visualise traffic and content performance: page views over time, top dishes, top search queries, and visitor counts. |
| **SEO importance** | None |
| **Authentication** | Required |
| **Render strategy** | Dynamic — fetches live aggregations from MongoDB analytics collection |

**Related modules:** `admin`, `analytics`

**Expected page components:**
```
(admin)/admin/analytics/page.tsx
├── AdminLayout
└── PageContainer
    ├── DateRangePicker
    ├── StatsRow
    │   ├── StatsCard ("Tổng lượt xem")
    │   ├── StatsCard ("Lượt tìm kiếm")
    │   ├── StatsCard ("Món phổ biến nhất")
    │   └── StatsCard ("Từ khóa nhiều nhất")
    ├── AnalyticsChart (line — daily page views)
    ├── SectionHeading ("Top 10 món được xem nhiều nhất")
    ├── DataTable (dish name, views, trend)
    ├── SectionHeading ("Top tìm kiếm")
    └── DataTable (keyword, count)
```

---

### `/admin/settings` — System Settings

| Field | Detail |
|---|---|
| **Purpose** | Control global application configuration: maintenance mode, random dish weights per diet type, featured categories for the home page, and admin profile management. |
| **SEO importance** | None |
| **Authentication** | Required |
| **Render strategy** | Dynamic |

**Related modules:** `admin`, `categories`, `auth`

**Expected page components:**
```
(admin)/admin/settings/page.tsx
├── AdminLayout
└── PageContainer
    ├── SectionHeading ("Chế độ trang")
    ├── Toggle: Maintenance mode
    │
    ├── SectionHeading ("Tỷ lệ gợi ý ngẫu nhiên")
    ├── WeightForm
    │   ├── NumberInput: Normal (%)
    │   ├── NumberInput: Vegetarian (%)
    │   ├── NumberInput: Diet (%)
    │   └── Save button (validates sum = 100%)
    │
    ├── SectionHeading ("Danh mục nổi bật trang chủ")
    ├── FeaturedCategorySelector (drag-to-reorder multi-select)
    │
    └── AdminProfileCard
        ├── AdminAvatar
        ├── "Chỉnh sửa hồ sơ" → EditProfileDialog
        └── "Đổi mật khẩu" → ChangePasswordDialog
```

---

## Complete Route Reference

### Public Routes

| Route | Auth | SEO | Robots | Render |
|---|---|---|---|---|
| `/` | None | Very high | `index, follow` | ISR 5 min |
| `/search` | None | Low | `noindex, follow` | Dynamic |
| `/dish/[slug]` | None | Very high | `index, follow` | ISR 10 min |
| `/recipe/[slug]` | None | Very high | `index, follow` | ISR 10 min |
| `/category/[slug]` | None | High | `index, follow` | ISR 10 min |
| `/random` | None | Low | `noindex, nofollow` | Dynamic |
| `/lucky-wheel` | None | Low | `noindex, follow` | Static + Client |
| `/ingredients` | None | Medium | `index, follow` | Static + Client |
| `/restaurants` | None | Low | `noindex, follow` | Static + Client |
| `/about` | None | Medium | `index, follow` | Static |
| `/contact` | None | Medium | `index, follow` | Static + Client |
| `/not-found` | None | None | `noindex, nofollow` | Static |

### Admin Routes

| Route | Auth | SEO | Render |
|---|---|---|---|
| `/admin/login` | None (redirect if session) | None | Static + Client |
| `/admin/dashboard` | Required | None | Dynamic |
| `/admin/dishes` | Required | None | Dynamic |
| `/admin/dishes/new` | Required | None | Dynamic |
| `/admin/dishes/[id]` | Required | None | Dynamic |
| `/admin/recipes` | Required | None | Dynamic |
| `/admin/recipes/new` | Required | None | Dynamic |
| `/admin/recipes/[id]` | Required | None | Dynamic |
| `/admin/categories` | Required | None | Dynamic |
| `/admin/categories/[id]` | Required | None | Dynamic |
| `/admin/ingredients` | Required | None | Dynamic |
| `/admin/ingredients/[id]` | Required | None | Dynamic |
| `/admin/banners` | Required | None | Dynamic |
| `/admin/banners/[id]` | Required | None | Dynamic |
| `/admin/feedbacks` | Required | None | Dynamic |
| `/admin/notifications` | Required | None | Dynamic |
| `/admin/analytics` | Required | None | Dynamic |
| `/admin/settings` | Required | None | Dynamic |

### API Routes

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/dishes` | GET, POST | POST: Admin | List dishes / create dish |
| `/api/dishes/random` | GET | None | Random dish by diet type |
| `/api/dishes/[id]` | GET, PATCH, DELETE | PATCH/DELETE: Admin | Get / update / delete dish |
| `/api/recipes` | GET, POST | POST: Admin | List / create recipe |
| `/api/recipes/[id]` | GET, PATCH, DELETE | PATCH/DELETE: Admin | Get / update / delete recipe |
| `/api/categories` | GET, POST | POST: Admin | List / create category |
| `/api/categories/[id]` | GET, PATCH, DELETE | PATCH/DELETE: Admin | Get / update / delete category |
| `/api/ingredients` | GET, POST | POST: Admin | List / create ingredient |
| `/api/ingredients/[id]` | PATCH, DELETE | Admin | Update / delete ingredient |
| `/api/search` | GET | None | Full-text dish search |
| `/api/upload` | POST | Admin | Sign and upload image to Cloudinary |
| `/api/feedbacks` | GET, POST | GET: Admin | Submit / list feedback |
| `/api/analytics` | GET | Admin | Fetch analytics aggregations |
| `/api/settings` | GET, PATCH | GET: Admin | Read / update site settings |
| `/api/ai/nutrition` | POST | Admin | Parse nutrition via Claude API |
| `/api/auth/[...nextauth]` | GET, POST | None | NextAuth handler |
