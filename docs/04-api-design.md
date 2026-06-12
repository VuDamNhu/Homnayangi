# API Design

## Conventions

- Base path: `/api`
- All responses: `{ success: boolean, data?: T, error?: string, meta?: PaginationMeta }`
- Pagination: `?page=1&limit=20` (offset-based for admin), cursor-based for public feeds
- Auth: session cookie via NextAuth — server reads with `auth()` helper
- Admin-only routes: `role === 'ADMIN'` checked server-side; return 403 if not
- Slugs are preferred over IDs in public-facing routes for SEO
- Soft-deleted resources (`isActive: false`) are excluded from public endpoints

### Pagination Meta

```typescript
{
  page: number
  limit: number
  total: number
  totalPages: number
}
```

---

## Dishes

### `GET /api/dishes`

List dishes.

| Query | Type | Description |
|---|---|---|
| `page` | number | default 1 |
| `limit` | number | default 20, max 100 |
| `category` | string | category slug filter |
| `type` | string | `normal` \| `vegetarian` \| `diet` |
| `q` | string | text search on name/tags |
| `sort` | string | `viewCount` \| `name` \| `createdAt` (default: `createdAt`) |

Response: `{ data: Dish[], meta: PaginationMeta }`

---

### `GET /api/dishes/random`

Return one randomly selected dish, weighted by type.

| Query | Type | Description |
|---|---|---|
| `type` | string | `normal` (default) \| `vegetarian` \| `diet` |

Response: `{ data: DishWithRecipes }`

`DishWithRecipes` = Dish + `recipes: Recipe[]`

---

### `GET /api/dishes/[slug]`

Dish detail with all active recipes.

Response: `{ data: DishWithRecipes }`

---

### `POST /api/dishes` 🔒 Admin

Create dish.

Body: `CreateDishInput` (all Dish fields except `_id`, `viewCount`, `favoriteCount`, `createdAt`, `updatedAt`)

---

### `PUT /api/dishes/[id]` 🔒 Admin

Update dish. Partial update (only fields provided are changed).

---

### `DELETE /api/dishes/[id]` 🔒 Admin

Soft delete (sets `isActive: false`).

---

### `POST /api/dishes/[id]/view`

Increment `viewCount` and log to ViewHistory. Unauthenticated allowed (uses sessionId from cookie).

Body: `{ sessionId: string }`

---

## Recipes

### `GET /api/recipes`

| Query | Type | Description |
|---|---|---|
| `dishId` | string | required — filter by dish |

Response: `{ data: RecipeWithIngredients[] }`

`RecipeWithIngredients` = Recipe + `ingredients: PopulatedRecipeIngredient[]`

---

### `GET /api/recipes/[id]`

Single recipe with populated ingredients.

---

### `POST /api/recipes` 🔒 Admin

Create recipe. Body includes `instructions[]` and `ingredients[]` (array of `{ ingredientId, amount, unit, note }`). RecipeIngredient documents created server-side.

---

### `PUT /api/recipes/[id]` 🔒 Admin

Update recipe and its ingredients (full replace of ingredients array).

---

### `DELETE /api/recipes/[id]` 🔒 Admin

Soft delete. Also removes associated RecipeIngredient documents.

---

## Categories

### `GET /api/categories`

List all active categories.

| Query | Type | Description |
|---|---|---|
| `type` | string | filter by type |

Response: `{ data: Category[] }`

---

### `GET /api/categories/[slug]`

Category detail + first page of dishes.

Response: `{ data: Category, dishes: Dish[], meta: PaginationMeta }`

---

### `POST /api/categories` 🔒 Admin
### `PUT /api/categories/[id]` 🔒 Admin
### `DELETE /api/categories/[id]` 🔒 Admin

Standard CRUD.

---

## Ingredients

### `GET /api/ingredients`

| Query | Type | Description |
|---|---|---|
| `q` | string | name search |
| `category` | string | ingredient category filter |
| `page`, `limit` | number | pagination |

---

### `POST /api/ingredients` 🔒 Admin
### `PUT /api/ingredients/[id]` 🔒 Admin
### `DELETE /api/ingredients/[id]` 🔒 Admin

---

## Search

### `GET /api/search`

| Query | Type | Description |
|---|---|---|
| `q` | string | required, min 2 chars |
| `type` | string | `dish` (default) |
| `page`, `limit` | number | pagination |

Logs to SearchHistory. Response includes `{ data: Dish[], meta: PaginationMeta }`.

---

### `GET /api/search/history` 🔒 User

Last 10 searches for authenticated user.

---

### `DELETE /api/search/history` 🔒 User

Clear user's search history.

---

## Favorites

### `GET /api/favorites` 🔒 User

| Query | Type | Description |
|---|---|---|
| `type` | string | `dish` \| `recipe` |

---

### `POST /api/favorites` 🔒 User

Body: `{ type: 'dish' | 'recipe', targetId: string }`

---

### `DELETE /api/favorites/[id]` 🔒 User

---

### `GET /api/favorites/check` 🔒 User

| Query | Type | Description |
|---|---|---|
| `type` | string | `dish` \| `recipe` |
| `targetId` | string | target document ID |

Response: `{ data: { isFavorited: boolean, favoriteId: string | null } }`

---

## Auth

Handled by NextAuth. Key endpoints:

| Route | Description |
|---|---|
| `POST /api/auth/register` | Custom registration endpoint |
| `POST /api/auth/[...nextauth]` | NextAuth handler (login, session, logout, OAuth) |

---

## Restaurants

### `GET /api/restaurants/nearby`

| Query | Type | Description |
|---|---|---|
| `dishName` | string | used as search query |
| `lat` | number | user latitude |
| `lng` | number | user longitude |
| `radius` | number | meters, default 2000 |

Calls Google Maps Places API server-side (API key never exposed to client).

Response: `{ data: Restaurant[] }`

```typescript
type Restaurant = {
  placeId: string
  name: string
  rating: number
  userRatingsTotal: number
  vicinity: string
  distance: number       // meters
  openNow: boolean | null
  mapsUrl: string
}
```

---

## AI

### `POST /api/ai/nutrition` 🔒 Admin

| Body Field | Type | Description |
|---|---|---|
| `ingredients` | array | `[{ name, amount, unit }]` |
| `servings` | number | number of servings |

Response:

```typescript
{
  data: {
    calories: number
    protein: number
    fat: number
    carbohydrates: number
    perServing: { calories, protein, fat, carbohydrates }
    confidence: 'high' | 'medium' | 'low'
    notes: string     // e.g. "Unit 'cup' estimated as 240ml"
  }
}
```

Rate limited: 20 requests per minute per admin.

---

## Analytics

### `POST /api/analytics/pageview`

Fire-and-forget. Body: `{ path, referrer, sessionId, dishId? }`. Always returns 200.

---

### `GET /api/analytics/summary` 🔒 Admin

| Query | Type | Description |
|---|---|---|
| `period` | string | `7d` \| `30d` \| `90d` (default: `30d`) |

Response includes:
- Total views
- Views by day array
- Top 10 dishes by views
- Top 10 search keywords
- Views by category

---

## Users (Admin)

### `GET /api/users` 🔒 Admin

| Query | Type | Description |
|---|---|---|
| `q` | string | search by name/email |
| `role` | string | filter by role |
| `page`, `limit` | number | pagination |

---

### `GET /api/users/[id]` 🔒 Admin
### `PUT /api/users/[id]` 🔒 Admin

Updatable fields: `role`, `isActive`. Cannot change email or password via this endpoint.

---

## Banners

### `GET /api/banners`

Returns active banners where `startDate <= now <= endDate` (or dates are null), ordered by `order`.

---

### `POST /api/banners` 🔒 Admin
### `PUT /api/banners/[id]` 🔒 Admin
### `DELETE /api/banners/[id]` 🔒 Admin

---

## Health

### `GET /api/health`

Returns server status and DB connection state. Used by monitoring.

```typescript
{
  status: 'ok' | 'degraded',
  db: 'connected' | 'disconnected',
  timestamp: string
}
```
