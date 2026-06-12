# Folder Structure — Recipe AI

Production-level Next.js 15 App Router project with feature-based architecture.

---

## Top-level Layout

```
project-root/
├── src/
├── public/
├── docs/
├── scripts/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

| Directory | Purpose |
|---|---|
| `src/` | All application source code |
| `public/` | Static assets (images, fonts, icons) |
| `docs/` | Architecture, schema, sprint, API reference |
| `scripts/` | One-off admin setup scripts, seed scripts |

---

## `src/` Structure

```
src/
├── app/
├── features/
├── components/
├── models/
├── lib/
├── hooks/
├── providers/
├── services/
├── actions/
├── types/
└── config/
```

---

## `app/` — App Router

Next.js 15 route tree. All routing lives here. No business logic.

```
src/app/
├── layout.tsx                  # Root layout (html, body, Providers)
├── not-found.tsx               # Global 404
├── error.tsx                   # Global error boundary
│
├── (public)/                   # Public-facing site (no auth)
│   ├── layout.tsx              # Shared header + footer
│   ├── page.tsx                # Home — random dish CTA
│   ├── dishes/
│   │   └── [slug]/
│   │       ├── page.tsx        # Dish detail + recipe list
│   │       └── loading.tsx
│   ├── categories/
│   │   └── [slug]/
│   │       ├── page.tsx        # Dishes by category
│   │       └── loading.tsx
│   ├── search/
│   │   ├── page.tsx            # Search results
│   │   └── loading.tsx
│   ├── random/
│   │   └── page.tsx            # Redirect to random dish
│   └── favorites/
│       └── page.tsx            # Client-side localStorage favorites
│
├── (admin)/                    # Admin panel (login required)
│   ├── layout.tsx              # Admin sidebar + auth guard
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── dishes/
│   │   ├── page.tsx            # List + filter
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx        # Edit
│   │       └── loading.tsx
│   ├── recipes/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   ├── categories/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── ingredients/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── users/
│   │   └── page.tsx
│   ├── banners/
│   │   └── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   ├── seo/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
└── api/                        # Route Handlers (server-only)
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts
    ├── dishes/
    │   ├── route.ts            # GET /api/dishes, POST
    │   ├── random/route.ts     # GET /api/dishes/random
    │   └── [id]/
    │       └── route.ts        # GET, PATCH, DELETE
    ├── recipes/
    │   ├── route.ts
    │   └── [id]/route.ts
    ├── categories/
    │   ├── route.ts
    │   └── [slug]/route.ts
    ├── ingredients/
    │   ├── route.ts
    │   └── [id]/route.ts
    ├── search/
    │   └── route.ts
    ├── analytics/
    │   └── route.ts
    └── ai/
        └── nutrition/route.ts
```

### Route Group Conventions

| Group | Auth | Layout |
|---|---|---|
| `(public)` | None | Header + Footer |
| `(admin)` | Required (NextAuth session) | Sidebar + Topbar |

---

## `features/` — Feature Modules

Each feature owns its own components, hooks, actions, types, and utils. Nothing leaks across features without going through `lib/` or `types/`.

```
src/features/
├── dishes/
│   ├── components/
│   │   ├── DishCard.tsx
│   │   ├── DishGrid.tsx
│   │   ├── DishDetail.tsx
│   │   └── RandomDishButton.tsx
│   ├── hooks/
│   │   ├── useDish.ts
│   │   └── useRandomDish.ts
│   ├── actions/
│   │   ├── getDish.ts          # Server Actions or thin fetch wrappers
│   │   ├── createDish.ts
│   │   └── updateDish.ts
│   ├── types/
│   │   └── dish.types.ts
│   └── utils/
│       └── dishSlug.ts
│
├── recipes/
│   ├── components/
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeList.tsx
│   │   └── RecipeSourceBadge.tsx
│   ├── hooks/
│   │   └── useRecipes.ts
│   ├── actions/
│   │   ├── getRecipesByDish.ts
│   │   └── createRecipe.ts
│   └── types/
│       └── recipe.types.ts
│
├── categories/
│   ├── components/
│   │   ├── CategoryCard.tsx
│   │   └── CategoryNav.tsx
│   ├── actions/
│   │   └── getCategories.ts
│   └── types/
│       └── category.types.ts
│
├── search/
│   ├── components/
│   │   ├── SearchBar.tsx
│   │   └── SearchResults.tsx
│   ├── hooks/
│   │   └── useSearch.ts
│   └── utils/
│       └── buildSearchQuery.ts
│
├── favorites/
│   ├── components/
│   │   ├── FavoriteButton.tsx
│   │   └── FavoritesList.tsx
│   ├── hooks/
│   │   └── useFavorites.ts     # localStorage only — no API
│   └── types/
│       └── favorite.types.ts
│
├── auth/
│   ├── components/
│   │   └── LoginForm.tsx
│   ├── actions/
│   │   └── signIn.ts
│   └── types/
│       └── session.types.ts
│
├── nutrition/
│   ├── components/
│   │   └── NutritionPanel.tsx
│   ├── actions/
│   │   └── parseNutrition.ts   # Calls /api/ai/nutrition (Claude API)
│   └── types/
│       └── nutrition.types.ts
│
├── restaurants/
│   ├── components/
│   │   ├── NearbyMap.tsx
│   │   └── RestaurantCard.tsx
│   ├── hooks/
│   │   └── useNearbyRestaurants.ts
│   └── types/
│       └── restaurant.types.ts
│
└── admin/
    ├── components/
    │   ├── DataTable.tsx
    │   ├── AdminSidebar.tsx
    │   ├── ConfirmDialog.tsx
    │   └── StatsCard.tsx
    ├── hooks/
    │   └── useAdminTable.ts
    └── types/
        └── admin.types.ts
```

---

## `components/` — Shared UI

Non-feature-specific components used across multiple features or pages.

```
src/components/
├── ui/                         # shadcn/ui primitives (auto-generated)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   ├── skeleton.tsx
│   └── ...
│
├── layout/                     # Page structure
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx             # Admin sidebar
│   └── PageContainer.tsx
│
└── common/                     # Cross-feature reusable components
    ├── ImageWithFallback.tsx
    ├── EmptyState.tsx
    ├── ErrorBoundary.tsx
    ├── LoadingSpinner.tsx
    ├── Pagination.tsx
    └── SectionHeading.tsx
```

### Placement Rules

| Where to put it | Condition |
|---|---|
| `features/<name>/components/` | Used only within that feature |
| `components/common/` | Used by 2+ features |
| `components/ui/` | shadcn/ui primitive — do not edit |
| `components/layout/` | Structural shell (header, footer, sidebar) |

---

## `models/` — Mongoose Models

One file per model. Models are imported only by API route handlers and Server Actions — never by client components.

```
src/models/
├── Dish.ts
├── Recipe.ts
├── RecipeIngredient.ts
├── Ingredient.ts
├── Category.ts
├── User.ts
├── Banner.ts
├── Analytics.ts
└── index.ts                    # Re-exports all models
```

Each model file contains:
- The Mongoose schema definition
- The TypeScript interface for the document
- The compiled model (with singleton guard for Next.js hot-reload)

---

## `lib/` — Infrastructure Utilities

Pure infrastructure with no business logic. Feature code calls `lib/`; `lib/` never imports from `features/`.

```
src/lib/
├── db/
│   ├── connect.ts              # MongoDB connection singleton
│   └── helpers.ts              # Reusable query helpers (paginate, etc.)
│
├── auth/
│   ├── config.ts               # NextAuth options
│   └── session.ts              # getServerSession wrapper
│
├── cache/
│   ├── revalidate.ts           # On-demand ISR helpers
│   └── tags.ts                 # Cache tag constants
│
├── ai/
│   └── claude.ts               # Anthropic SDK client instance
│
├── maps/
│   └── places.ts               # Google Maps Places API wrapper
│
└── utils/
    ├── slug.ts
    ├── format.ts               # Date, number formatters
    ├── cn.ts                   # clsx + tailwind-merge (shadcn helper)
    └── validators.ts           # Zod schemas for API input
```

---

## `actions/` — Server Actions (Global)

Server Actions that don't belong to a single feature or are shared across multiple features. Feature-specific actions live inside `features/<name>/actions/`.

```
src/actions/
├── revalidate.ts               # Cache revalidation triggers
└── upload.ts                   # File/image upload handling
```

> Feature-specific mutations (createDish, updateRecipe) live in `features/<name>/actions/` and are co-located with the feature.

---

## `hooks/` — Global Client Hooks

React hooks not tied to any single feature.

```
src/hooks/
├── useMediaQuery.ts
├── useDebounce.ts
├── useLocalStorage.ts          # Generic localStorage hook
└── useScrollPosition.ts
```

> Feature-specific hooks (useFavorites, useSearch) live inside `features/<name>/hooks/`.

---

## `providers/` — React Context Providers

Client-side context providers that wrap the app. Kept out of `app/layout.tsx` to avoid polluting the root layout with `"use client"` boundaries.

```
src/providers/
├── index.tsx                   # Composes all providers into <Providers>
├── ThemeProvider.tsx           # next-themes
├── SessionProvider.tsx         # NextAuth client session
└── ToastProvider.tsx           # Sonner / react-hot-toast
```

`app/layout.tsx` imports only `<Providers>` from `providers/index.tsx`.

---

## `services/` — External API Clients

Thin wrappers around third-party APIs. No business logic — only request/response shaping. Called by Server Actions or Route Handlers only.

```
src/services/
├── claude.service.ts           # Claude API — nutrition parsing
├── places.service.ts           # Google Maps Places API
└── crawler.service.ts          # Dish/recipe scraper (Sprint 9)
```

### Service Layer Contract

- Input: plain TypeScript types
- Output: plain TypeScript types (never Mongoose documents)
- Errors: throw typed error classes; callers handle them

---

## `types/` — Global TypeScript Types

Types shared across more than one feature. Feature-specific types stay in `features/<name>/types/`.

```
src/types/
├── api.types.ts                # Shared API response shapes (ApiResponse<T>, PaginatedResponse<T>)
├── next-auth.d.ts              # Session type augmentation
└── env.d.ts                    # process.env type declarations
```

---

## `config/` — Application Constants

```
src/config/
├── site.ts                     # Site name, URL, meta defaults
├── nav.ts                      # Navigation link definitions
└── constants.ts                # Enum-like constants (dish types, sources, etc.)
```

---

## Dependency Rules

The following table defines what each layer is allowed to import. Violating these rules creates circular dependencies and breaks build caching.

```
app/          → features/, components/, lib/, providers/, config/
features/     → components/ui, components/common, lib/, services/, types/, config/
components/   → lib/utils, types/
models/       → (no src/ imports — Mongoose only)
lib/          → types/, config/
services/     → types/, config/, lib/
actions/      → lib/, services/, models/, types/
hooks/        → lib/, types/
providers/    → (external packages only)
types/        → (no src/ imports)
config/       → (no src/ imports)
```

Key rule: **`lib/` and `services/` never import from `features/`.**

---

## File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React component | PascalCase | `DishCard.tsx` |
| Hook | camelCase, `use` prefix | `useFavorites.ts` |
| Server Action | camelCase, verb prefix | `createDish.ts`, `getDish.ts` |
| Utility | camelCase | `buildSearchQuery.ts` |
| Mongoose model | PascalCase | `Dish.ts` |
| Type file | camelCase, `.types.ts` suffix | `dish.types.ts` |
| Config file | camelCase | `site.ts` |
| Route handler | `route.ts` (required by Next.js) | `route.ts` |

---

## Environment Variables

```
# Server-only (no NEXT_PUBLIC_ prefix)
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
ANTHROPIC_API_KEY=
GOOGLE_MAPS_API_KEY=

# Client-accessible
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GOOGLE_MAPS_PUBLIC_KEY=
```

Typed in `src/types/env.d.ts` via `declare global { namespace NodeJS { interface ProcessEnv { ... } } }`.
