# API Design

## Conventions

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

### Response Envelope

Every response follows this shape:

```json
{
  "success": true,
  "data": { ... },
  "meta": { ... },
  "error": null
}
```

On error:

```json
{
  "success": false,
  "data": null,
  "error": "Descriptive error message"
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (logged in but wrong role) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

### Pagination

Offset-based pagination on all list endpoints:

```
GET /api/dishes?page=2&limit=20
```

Pagination meta in response:

```json
{
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 247,
    "totalPages": 13
  }
}
```

Default `limit`: 20. Maximum `limit`: 100.

### Auth

- Session via HttpOnly cookie (managed by NextAuth).
- Server reads session with `auth()` helper — never trust client-sent user IDs.
- `🔒 User` = requires login (any role).
- `🔒 Admin` = requires `role === 'ADMIN'`.
- Public endpoints work for unauthenticated users.

---

## Dishes

### GET /api/dishes

List dishes with filtering and search.

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `category` | string | — | Filter by category slug |
| `type` | string | — | `normal` \| `vegetarian` \| `diet` |
| `q` | string | — | Full-text search on name and tags |
| `sort` | string | `createdAt` | `viewCount` \| `favoriteCount` \| `name` \| `createdAt` |
| `order` | string | `desc` | `asc` \| `desc` |

**Response:** `{ data: Dish[], meta: PaginationMeta }`

---

### GET /api/dishes/random

Returns one randomly selected dish.

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `type` | string | `normal` | `normal` \| `vegetarian` \| `diet` |

**Algorithm:** Weighted random — pulls all matching dishes, randomly selects one. Includes populated recipes.

**Response:** `{ data: DishWithRecipes }`

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Bun Bo Hue",
    "slug": "bun-bo-hue",
    "image": "...",
    "calories": 450,
    "protein": 28,
    "fat": 12,
    "carbohydrates": 58,
    "cookingTime": 90,
    "recipes": [ { ... } ]
  }
}
```

---

### GET /api/dishes/[slug]

Dish detail with all active recipes.

**Response:** `{ data: DishWithRecipes }` — recipe objects include populated ingredients.

**Status 404** if dish not found or `isActive: false`.

---

### POST /api/dishes 🔒 Admin

Create a dish.

**Request Body:**

```json
{
  "name": "Bun Bo Hue",
  "description": "Spicy Vietnamese noodle soup...",
  "image": "https://...",
  "categoryId": "66f3a...",
  "type": "normal",
  "calories": 450,
  "protein": 28,
  "fat": 12,
  "carbohydrates": 58,
  "cookingTime": 90,
  "servings": 2,
  "difficulty": "medium",
  "tags": ["spicy", "noodle", "soup"],
  "seo": {
    "metaTitle": "Bun Bo Hue Recipe",
    "metaDescription": "...",
    "canonicalUrl": "https://..."
  }
}
```

**Response:** `{ data: Dish }` with status 201.

---

### PUT /api/dishes/[id] 🔒 Admin

Partial update — only fields present in body are updated.

**Response:** `{ data: Dish }`

---

### DELETE /api/dishes/[id] 🔒 Admin

Soft delete — sets `isActive: false`.

**Response:** `{ data: { id: "..." } }`

---

### POST /api/dishes/[id]/view

Increment view count and log to ViewHistory. Fire-and-forget from client.

**Request Body:**

```json
{ "sessionId": "abc123" }
```

**Response:** `{ success: true }` — always 200, even on DB error (non-blocking).

---

## Recipes

### GET /api/recipes

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `dishId` | string | yes | Filter recipes by parent dish ID |

**Response:** `{ data: RecipeWithIngredients[] }`

Each recipe includes an `ingredients` array of populated `RecipeIngredient` objects.

---

### GET /api/recipes/[id]

Single recipe with populated ingredients.

**Response:** `{ data: RecipeWithIngredients }`

---

### POST /api/recipes 🔒 Admin

**Request Body:**

```json
{
  "dishId": "66f3a...",
  "title": "Bun Bo Hue — Cookpad Version",
  "source": "Cookpad",
  "sourceUrl": "https://cookpad.com/...",
  "description": "...",
  "image": "https://...",
  "videoUrl": "https://youtube.com/embed/...",
  "servings": 4,
  "cookingTime": 90,
  "difficulty": "medium",
  "calories": 450,
  "protein": 28,
  "fat": 12,
  "carbohydrates": 58,
  "instructions": [
    { "step": 1, "description": "Boil the beef bones...", "image": null }
  ],
  "ingredients": [
    { "ingredientId": "66f4b...", "amount": 500, "unit": "g", "note": "thinly sliced" }
  ]
}
```

Server creates the Recipe document and all `RecipeIngredient` documents in a single transaction.

**Response:** `{ data: RecipeWithIngredients }` with status 201.

---

### PUT /api/recipes/[id] 🔒 Admin

Full replace of ingredients array (old RecipeIngredient docs deleted, new ones created).

**Response:** `{ data: RecipeWithIngredients }`

---

### DELETE /api/recipes/[id] 🔒 Admin

Soft delete. Cascades to delete associated RecipeIngredient documents.

**Response:** `{ data: { id: "..." } }`

---

## Categories

### GET /api/categories

List all active categories.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `type` | string | `normal` \| `vegetarian` \| `diet` |

**Response:** `{ data: Category[] }` — ordered by `order` ascending.

---

### GET /api/categories/[slug]

Category detail plus the first page of dishes.

**Response:**

```json
{
  "data": {
    "category": { ... },
    "dishes": [ ... ],
    "meta": { "page": 1, "limit": 20, "total": 47, "totalPages": 3 }
  }
}
```

---

### POST /api/categories 🔒 Admin
### PUT /api/categories/[id] 🔒 Admin
### DELETE /api/categories/[id] 🔒 Admin

Standard CRUD. Delete is soft (`isActive: false`).

---

## Ingredients

### GET /api/ingredients

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `q` | string | Name search (text index) |
| `category` | string | Ingredient category filter |
| `page`, `limit` | number | Pagination |

**Response:** `{ data: Ingredient[], meta: PaginationMeta }`

---

### POST /api/ingredients 🔒 Admin
### PUT /api/ingredients/[id] 🔒 Admin
### DELETE /api/ingredients/[id] 🔒 Admin

Hard delete allowed (no referential integrity enforcement at DB level — admin must check before deleting).

---

## Search

### GET /api/search

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `q` | string | yes | Min 2 characters |
| `type` | string | no | `dish` (default) |
| `page`, `limit` | number | no | Pagination |

Uses MongoDB full-text search on `Dish` collection (`name` + `tags` text index).

Logs to `SearchHistory` with `sessionId` (anonymous, no user account). Non-blocking.

**Response:** `{ data: Dish[], meta: PaginationMeta }`

---

## Favorites

> Favorites are stored in the **browser's localStorage** — no API needed. The frontend reads IDs from localStorage and calls `GET /api/dishes` or `GET /api/recipes` to hydrate the details. No server-side favorites endpoints exist.

---

## Auth

**There is no public registration endpoint.** Admin accounts are created via a setup script. The only auth endpoints are for the admin panel.

### POST /api/auth/[...nextauth]

Handled by NextAuth.js. Admin credentials login only.

- `credentials` — email/password (admin only)

---

## Restaurants

### GET /api/restaurants/nearby

Calls Google Maps Places API server-side. API key never exposed to client.

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `dishName` | string | yes | Used as the search keyword |
| `lat` | number | yes | User latitude |
| `lng` | number | yes | User longitude |
| `radius` | number | no | Meters, default: 2000 |

**Response:**

```json
{
  "data": [
    {
      "placeId": "ChIJ...",
      "name": "Quan Bun Bo Hue O Ba Tuyet",
      "rating": 4.5,
      "userRatingsTotal": 342,
      "vicinity": "123 Le Loi, District 1",
      "distance": 850,
      "openNow": true,
      "mapsUrl": "https://maps.google.com/?place_id=..."
    }
  ]
}
```

Results cached per `(dishName, lat, lng)` for 10 minutes server-side.

---

## AI — Nutrition

### POST /api/ai/nutrition 🔒 Admin

Rate limited: 20 requests per minute per admin user (returns 429 if exceeded).

**Request Body:**

```json
{
  "ingredients": [
    { "name": "beef", "amount": 500, "unit": "g" },
    { "name": "rice noodle", "amount": 200, "unit": "g" },
    { "name": "lemongrass", "amount": 3, "unit": "stalks" }
  ],
  "servings": 4
}
```

**Response:**

```json
{
  "data": {
    "totalCalories": 1820,
    "totalProtein": 112,
    "totalFat": 48,
    "totalCarbohydrates": 232,
    "perServing": {
      "calories": 455,
      "protein": 28,
      "fat": 12,
      "carbohydrates": 58
    },
    "confidence": "high",
    "notes": "Lemongrass estimated as 20g per stalk. Noodle amount is dry weight."
  }
}
```

Confidence levels:
- `high` — all ingredients recognized and standard units used
- `medium` — some unit conversions estimated
- `low` — one or more ingredients not recognized

---

## Analytics

### POST /api/analytics/pageview

Fire-and-forget. Never blocks the page render. Always returns 200.

**Request Body:**

```json
{
  "path": "/dishes/bun-bo-hue",
  "referrer": "https://google.com",
  "sessionId": "abc123",
  "dishId": "66f3a..."
}
```

---

### GET /api/analytics/summary 🔒 Admin

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `period` | string | `30d` | `7d` \| `30d` \| `90d` |

**Response:**

```json
{
  "data": {
    "totalViews": 12480,
    "totalSearches": 3210,
    "viewsByDay": [
      { "date": "2026-06-01", "count": 423 }
    ],
    "topDishes": [
      { "dishId": "...", "name": "Bun Bo Hue", "views": 1203, "slug": "bun-bo-hue" }
    ],
    "topKeywords": [
      { "keyword": "pho", "count": 342 }
    ],
    "viewsByCategory": [
      { "category": "Vietnamese", "views": 5430 }
    ]
  }
}
```

---

## Users (Admin)

### GET /api/users 🔒 Admin

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `q` | string | Search by name or email |
| `role` | string | `USER` \| `ADMIN` |
| `isActive` | boolean | Filter by active status |
| `page`, `limit` | number | Pagination |

---

### GET /api/users/[id] 🔒 Admin
### PUT /api/users/[id] 🔒 Admin

Updatable fields: `role`, `isActive`. Email and password not editable via this endpoint.

---

## Banners

### GET /api/banners

Returns banners where `isActive: true` and current date is within `startDate`–`endDate` range (or dates are null). Ordered by `order` ascending.

**Response:** `{ data: Banner[] }`

---

### POST /api/banners 🔒 Admin
### PUT /api/banners/[id] 🔒 Admin
### DELETE /api/banners/[id] 🔒 Admin

Hard delete — banners can be fully removed.

---

## Health

### GET /api/health

No auth required. Used by uptime monitoring.

**Response:**

```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2026-06-12T10:00:00.000Z"
}
```

Returns `status: "degraded"` if MongoDB connection is down.
