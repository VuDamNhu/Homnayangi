# Folder Structure

## Root

```
recipe-ai/
├── src/                    # All application source code
├── public/                 # Static assets served as-is
├── scripts/                # One-off scripts (seed, crawl, migrate)
├── docs/                   # Project documentation (this folder)
├── .env.example            # Environment variable template
├── .env.local              # Local secrets — never commit
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
├── package.json
└── CLAUDE.md               # AI assistant project reference
```

---

## src/

```
src/
├── app/                    # Next.js App Router — pages and API routes
├── features/               # Feature modules (business logic)
├── components/             # Shared UI components
├── lib/                    # Core utilities and services
├── models/                 # Mongoose models
├── types/                  # Global TypeScript type definitions
└── config/                 # App-level constants and configuration
```

---

## src/app/

```
src/app/
├── layout.tsx              # Root layout (html, body, providers, fonts)
├── page.tsx                # Home page "/"
├── not-found.tsx           # Global 404 page
├── error.tsx               # Global error boundary
├── sitemap.ts              # Dynamic sitemap.xml
├── robots.ts               # robots.txt
│
├── (public)/               # Route group — public user-facing pages
│   ├── layout.tsx          # Public layout (Header + Footer)
│   ├── search/
│   │   └── page.tsx        # /search
│   ├── categories/
│   │   ├── page.tsx        # /categories
│   │   └── [slug]/
│   │       └── page.tsx    # /categories/[slug]
│   ├── dishes/
│   │   ├── page.tsx        # /dishes
│   │   └── [slug]/
│   │       ├── page.tsx    # /dishes/[slug]
│   │       └── loading.tsx # Suspense fallback
│   └── favorites/
│       └── page.tsx        # /favorites (localStorage-based, no auth)
│
├── (admin)/                # Route group — admin panel (login required)
│   ├── layout.tsx          # Admin layout (Sidebar + AdminHeader)
│   ├── login/
│   │   └── page.tsx        # /admin/login — only auth page in the app
│   ├── dashboard/
│   │   └── page.tsx
│   ├── dishes/
│   │   ├── page.tsx        # Dish list table
│   │   ├── new/
│   │   │   └── page.tsx    # New dish form
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   ├── recipes/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   ├── categories/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   ├── ingredients/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   ├── users/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── banners/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   ├── seo/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
└── api/                    # API Route Handlers
    ├── health/
    │   └── route.ts
    ├── dishes/
    │   ├── route.ts          # GET (list), POST (create)
    │   ├── random/
    │   │   └── route.ts      # GET
    │   └── [slug]/
    │       ├── route.ts      # GET (detail)
    │       └── [id]/
    │           ├── route.ts  # PUT, DELETE
    │           └── view/
    │               └── route.ts
    ├── recipes/
    │   ├── route.ts
    │   └── [id]/
    │       └── route.ts
    ├── categories/
    │   ├── route.ts
    │   └── [slug]/
    │       └── route.ts
    ├── ingredients/
    │   ├── route.ts
    │   └── [id]/
    │       └── route.ts
    ├── search/
    │   └── route.ts
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts        # Admin login only (NextAuth)
    ├── restaurants/
    │   └── nearby/
    │       └── route.ts
    ├── ai/
    │   └── nutrition/
    │       └── route.ts
    ├── analytics/
    │   ├── pageview/
    │   │   └── route.ts
    │   └── summary/
    │       └── route.ts
    ├── users/
    │   ├── route.ts
    │   └── [id]/
    │       └── route.ts
    └── banners/
        ├── route.ts
        └── [id]/
            └── route.ts
```

---

## src/features/

Each feature is self-contained: components, hooks, server actions, types, and utilities live together.

```
src/features/
│
├── dishes/
│   ├── components/
│   │   ├── DishCard.tsx
│   │   ├── DishGrid.tsx
│   │   ├── DishDetail.tsx
│   │   ├── DishHero.tsx
│   │   └── RandomDishButton.tsx
│   ├── hooks/
│   │   ├── useDish.ts
│   │   └── useRandomDish.ts
│   ├── actions/
│   │   └── dish.actions.ts   # Server Actions for mutations
│   ├── types/
│   │   └── dish.types.ts
│   └── utils/
│       └── dish.utils.ts
│
├── recipes/
│   ├── components/
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeDetail.tsx
│   │   ├── RecipeList.tsx
│   │   ├── IngredientList.tsx
│   │   ├── InstructionList.tsx
│   │   └── YoutubeEmbed.tsx
│   ├── hooks/
│   │   └── useRecipe.ts
│   ├── types/
│   │   └── recipe.types.ts
│   └── utils/
│       └── nutrition.utils.ts
│
├── categories/
│   ├── components/
│   │   ├── CategoryCard.tsx
│   │   ├── CategoryBar.tsx
│   │   └── CategoryGrid.tsx
│   ├── types/
│   │   └── category.types.ts
│   └── utils/
│
├── search/
│   ├── components/
│   │   ├── SearchBar.tsx
│   │   ├── SearchResults.tsx
│   │   └── SearchHistory.tsx
│   ├── hooks/
│   │   └── useSearch.ts
│   └── types/
│       └── search.types.ts
│
├── favorites/
│   ├── components/
│   │   ├── FavoriteButton.tsx  # reads/writes localStorage
│   │   ├── FavoritesList.tsx
│   │   └── FavoriteTabs.tsx
│   ├── hooks/
│   │   └── useFavorite.ts      # localStorage read/write, no API calls
│   └── types/
│       └── favorite.types.ts
│
├── restaurants/
│   ├── components/
│   │   ├── NearbyRestaurants.tsx
│   │   ├── RestaurantCard.tsx
│   │   └── LocationPrompt.tsx
│   ├── hooks/
│   │   └── useNearbyRestaurants.ts
│   └── types/
│       └── restaurant.types.ts
│
├── nutrition/
│   ├── components/
│   │   ├── NutritionCard.tsx
│   │   ├── NutritionChart.tsx
│   │   └── MacroBadge.tsx
│   └── types/
│       └── nutrition.types.ts
│
└── admin/
    ├── components/
    │   ├── AdminSidebar.tsx
    │   ├── AdminHeader.tsx
    │   ├── StatCard.tsx
    │   ├── DataTable.tsx
    │   ├── ConfirmDialog.tsx
    │   └── charts/
    │       ├── ViewsChart.tsx
    │       └── TopDishesChart.tsx
    ├── hooks/
    │   └── useAdminTable.ts
    └── types/
        └── admin.types.ts
```

---

## src/components/

Global shared components not tied to a specific feature.

```
src/components/
│
├── ui/                     # shadcn/ui components (auto-generated, do not edit)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   └── ... (all shadcn components)
│
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── MobileNav.tsx
│   └── Breadcrumb.tsx
│
└── common/
    ├── DishCard.tsx          # Used across features
    ├── SkeletonCard.tsx
    ├── EmptyState.tsx
    ├── Pagination.tsx
    ├── ImageWithFallback.tsx
    └── LoadingSpinner.tsx
```

---

## src/lib/

Core utilities and third-party service wrappers.

```
src/lib/
│
├── db/
│   ├── connect.ts            # Mongoose singleton connection
│   └── helpers.ts            # Common query helpers
│
├── auth/
│   ├── config.ts             # NextAuth config (providers, callbacks)
│   └── utils.ts              # Session helpers, role checks
│
├── cache/
│   ├── dish.cache.ts         # unstable_cache wrappers for dish queries
│   └── category.cache.ts
│
├── ai/
│   ├── nutrition.ts          # Claude API call + prompt builder
│   └── prompts/
│       └── nutrition.prompt.ts
│
├── maps/
│   └── places.ts             # Google Maps Places API wrapper
│
├── validations/              # Zod schemas for API input validation
│   ├── dish.schema.ts
│   ├── recipe.schema.ts
│   ├── category.schema.ts
│   ├── ingredient.schema.ts
│   └── auth.schema.ts
│
└── utils/
    ├── slug.ts               # Slug generation and sanitization
    ├── format.ts             # Date, number, string formatting
    ├── api.ts                # API response builder helpers
    └── rateLimit.ts          # Simple in-memory rate limiter
```

---

## src/models/

One Mongoose model per file.

```
src/models/
├── Category.ts
├── Dish.ts
├── Recipe.ts
├── Ingredient.ts
├── RecipeIngredient.ts
├── User.ts
├── Favorite.ts
├── SearchHistory.ts
├── ViewHistory.ts
├── Banner.ts
└── PageView.ts
```

---

## src/types/

Global TypeScript types shared across features.

```
src/types/
├── index.ts              # Re-exports all types
├── api.types.ts          # ApiResponse<T>, PaginationMeta
├── dish.types.ts         # Dish, DishWithRecipes
├── recipe.types.ts       # Recipe, RecipeWithIngredients
├── category.types.ts
├── ingredient.types.ts
├── user.types.ts
├── favorite.types.ts
└── analytics.types.ts
```

---

## src/config/

App-level constants.

```
src/config/
├── constants.ts          # SITE_NAME, DEFAULT_PAGE_SIZE, etc.
└── routes.ts             # Typed route constants (avoid magic strings)
```

---

## scripts/

Node.js scripts run outside Next.js.

```
scripts/
├── seed.ts               # Seed database with initial data
├── seed-ingredients.ts   # Seed ingredient library
└── crawlers/
    ├── base.crawler.ts
    ├── cookpad.crawler.ts
    └── dienmayxanh.crawler.ts
```

---

## public/

```
public/
├── images/
│   ├── logo.svg
│   ├── placeholder-dish.jpg
│   └── og-default.jpg       # Default Open Graph image
└── icons/
    └── favicon.ico
```

---

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Component files | PascalCase | `DishCard.tsx` |
| Hook files | camelCase | `useDish.ts` |
| Utility files | camelCase | `slug.ts` |
| Type files | camelCase + `.types.ts` | `dish.types.ts` |
| Model files | PascalCase | `Dish.ts` |
| API route files | always `route.ts` | `route.ts` |
| Page files | always `page.tsx` | `page.tsx` |
| CSS modules | camelCase + `.module.css` | (prefer Tailwind, avoid CSS modules) |

---

## Import Alias

Configured in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

Usage:

```typescript
import { DishCard } from "@/features/dishes/components/DishCard"
import { connectDB } from "@/lib/db/connect"
import type { Dish } from "@/types/dish.types"
```
