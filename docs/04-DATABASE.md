# Database Design

## Technology

**Database:** MongoDB Atlas (cloud-hosted)

**ODM:** Mongoose 8.x

**Strategy:** Document-oriented with selective denormalization for performance-critical read paths.

---

## Entity Relationship Overview

```
Category (1) ──────────── (N) Dish
                                │
                          (N) Recipe
                                │
                     (N) RecipeIngredient
                                │
                          (1) Ingredient

User  ← admin accounts only (no public user registration)

ViewHistory  ← sessionId-based (no userId, anonymous)

Banner (standalone)
PageView (standalone analytics log)
```

> **Public site is fully anonymous.** No user registration or login is required for any visitor-facing feature. Favorites are stored in the browser's `localStorage`. The `User` collection exists only for admin accounts.

---

## Collections

### 1. categories

Represents a top-level grouping of dishes (e.g., "Vietnamese", "Salads", "Soups").

```
Field              Type              Constraints / Notes
─────────────────────────────────────────────────────────
_id                ObjectId          Auto-generated
name               String            Required, trimmed
slug               String            Required, unique, lowercase, indexed
description        String            Optional
image              String            URL to image
type               String            Enum: normal | vegetarian | diet
isActive           Boolean           Default: true
order              Number            Display sort order, default: 0
seo.metaTitle      String            Optional
seo.metaDescription String           Optional
seo.canonicalUrl   String            Optional
createdAt          Date              Auto (Mongoose timestamps)
updatedAt          Date              Auto (Mongoose timestamps)
```

**Indexes:** `slug` (unique), `type`, `isActive`

---

### 2. dishes

The primary discovery unit. One dish has many recipes.

```
Field              Type              Constraints / Notes
─────────────────────────────────────────────────────────
_id                ObjectId          Auto-generated
name               String            Required, trimmed
slug               String            Required, unique, indexed
description        String            Optional
image              String            URL
categoryId         ObjectId          ref: categories, required
type               String            Enum: normal | vegetarian | diet
calories           Number            kcal per serving, default: 0
protein            Number            grams per serving, default: 0
fat                Number            grams per serving, default: 0
carbohydrates      Number            grams per serving, default: 0
cookingTime        Number            minutes
servings           Number            Default: 1
difficulty         String            Enum: easy | medium | hard
tags               [String]          Searchable tags e.g. ["spicy","noodle"]
isActive           Boolean           Default: true
viewCount          Number            Denormalized counter, $inc on view
favoriteCount      Number            Denormalized counter, $inc/$dec on favorite toggle
seo.metaTitle      String            Optional
seo.metaDescription String           Optional
seo.canonicalUrl   String            Optional
createdAt          Date              Auto
updatedAt          Date              Auto
```

**Indexes:**
- `slug` (unique)
- `categoryId`
- `type`
- `isActive`
- `name` + `tags` (text index for search)
- `viewCount` (descending, for trending queries)
- `favoriteCount` (descending)

---

### 3. recipes

A specific version of a dish from a particular source.

```
Field              Type              Constraints / Notes
─────────────────────────────────────────────────────────
_id                ObjectId          Auto-generated
dishId             ObjectId          ref: dishes, required, indexed
title              String            Required
slug               String            Required, unique
source             String            e.g. "Cookpad", "Dien May Xanh"
sourceUrl          String            Original recipe URL
description        String            Optional
image              String            URL
videoUrl           String            YouTube embed URL
servings           Number            Default: 1
cookingTime        Number            minutes
difficulty         String            Enum: easy | medium | hard
calories           Number            Calculated from ingredients
protein            Number            Calculated from ingredients
fat                Number            Calculated from ingredients
carbohydrates      Number            Calculated from ingredients
instructions       [Object]          Array — see sub-schema below
isActive           Boolean           Default: true
createdAt          Date              Auto
updatedAt          Date              Auto
```

**Instruction sub-document:**
```
step               Number            Step number (1, 2, 3…)
description        String            Instruction text
image              String            Optional step image URL
```

**Indexes:** `dishId`, `slug` (unique), `source`, `isActive`

---

### 4. ingredients

Reusable ingredient library with nutrition data.

```
Field              Type              Constraints / Notes
─────────────────────────────────────────────────────────
_id                ObjectId          Auto-generated
name               String            Required, trimmed
nameVi             String            Vietnamese name, optional
slug               String            Required, unique, indexed
caloriesPer100g    Number            kcal, default: 0
proteinPer100g     Number            grams, default: 0
fatPer100g         Number            grams, default: 0
carbsPer100g       Number            grams, default: 0
defaultUnit        String            "g" | "ml" | "piece" | "tbsp" | "cup"
category           String            "meat" | "vegetable" | "spice" | "grain" | "dairy" | "seafood" | "other"
isActive           Boolean           Default: true
createdAt          Date              Auto
updatedAt          Date              Auto
```

**Indexes:** `slug` (unique), `name` (text), `category`

---

### 5. recipeingredients

Join table linking recipes to ingredients with amount and unit.

```
Field              Type              Constraints / Notes
─────────────────────────────────────────────────────────
_id                ObjectId          Auto-generated
recipeId           ObjectId          ref: recipes, required
ingredientId       ObjectId          ref: ingredients, required
amount             Number            Required, e.g. 200
unit               String            Required, e.g. "g" (may differ from ingredient.defaultUnit)
note               String            Optional, e.g. "finely sliced"
```

**Indexes:** `recipeId`, `ingredientId`, compound `(recipeId, ingredientId)` (unique)

---

### 6. users

**Admin accounts only.** There is no public user registration. This collection stores accounts created manually for the admin panel.

```
Field              Type              Constraints / Notes
─────────────────────────────────────────────────────────
_id                ObjectId          Auto-generated
name               String            Required, trimmed
email              String            Required, unique, lowercase, indexed
password           String            bcrypt hash (credentials login)
avatar             String            URL, optional
role               String            Enum: ADMIN, default: ADMIN
isActive           Boolean           Default: true
createdAt          Date              Auto
updatedAt          Date              Auto
```

**Indexes:** `email` (unique), `isActive`

> Admin accounts are created directly in the database or via a setup script — there is no public-facing registration endpoint.

---

### 7. ~~favorites~~ — Not stored in DB

Favorites are stored in the **browser's localStorage** under the key `"favorites"`. No server-side collection is needed. Format:

```json
{
  "dishes": ["dishId1", "dishId2"],
  "recipes": ["recipeId1"]
}
```

The `/favorites` page reads these IDs and fetches full details from the existing public API.

---

### 8. searchhistories

Anonymous search log used purely for analytics. No user reference.

```
Field              Type              Constraints / Notes
─────────────────────────────────────────────────────────
_id                ObjectId          Auto-generated
sessionId          String            Browser session ID (anonymous)
keyword            String            Required, trimmed
resultCount        Number            How many results were returned
createdAt          Date              Auto
```

**Indexes:** `keyword` (text), `createdAt`

**TTL:** Auto-expire records older than 90 days.

---

### 9. viewhistories

Anonymous view log. Used to power trending dishes and `Dish.viewCount`.

```
Field              Type              Constraints / Notes
─────────────────────────────────────────────────────────
_id                ObjectId          Auto-generated
sessionId          String            Browser session ID (anonymous)
dishId             ObjectId          ref: dishes, required
createdAt          Date              Auto
```

**Indexes:** `dishId`, `createdAt`

---

### 10. banners

```
Field              Type              Constraints / Notes
─────────────────────────────────────────────────────────
_id                ObjectId          Auto-generated
title              String            Required
image              String            URL, required
link               String            Destination URL on click
order              Number            Display order, default: 0
isActive           Boolean           Default: true
startDate          Date              null = no start restriction
endDate            Date              null = no end restriction
createdAt          Date              Auto
updatedAt          Date              Auto
```

**Indexes:** `isActive`, `order`, compound `(startDate, endDate)`

---

### 11. pageviews

Analytics log — append-only.

```
Field              Type              Constraints / Notes
─────────────────────────────────────────────────────────
_id                ObjectId          Auto-generated
path               String            URL path, e.g. "/dishes/bun-bo-hue"
referrer           String            HTTP referrer, optional
userAgent          String            Browser user agent
sessionId          String            Browser session ID
userId             ObjectId          ref: users, nullable
dishId             ObjectId          ref: dishes, nullable (extracted from path)
createdAt          Date              Auto
```

**Indexes:** `path`, `dishId`, `createdAt`, compound `(path, createdAt)`

**TTL:** Auto-expire records older than 1 year.

---

## Design Decisions

### Denormalization

| Denormalized Field | Source | Why |
|---|---|---|
| `Dish.viewCount` | PageView count | Avoid COUNT query on every dish card render |
| `Dish.favoriteCount` | Favorite count | Same as above |
| `Dish.calories/protein/fat/carbs` | Average of Recipe nutrition | Single read on dish detail, no aggregation |

Updates use MongoDB `$inc` for atomicity — no read-modify-write cycles.

### Soft Deletes

`isActive: false` used instead of hard deletes for: Category, Dish, Recipe, User (admin accounts).

Hard deletes allowed for: Ingredient (low risk), RecipeIngredient (cascades with recipe), SearchHistory, ViewHistory, PageView (analytics purge).

### Favorites in localStorage

Favorites are not stored in MongoDB. The browser's `localStorage` holds the list of saved dish/recipe IDs. The `/favorites` page fetches details from the public API using those IDs. This eliminates the need for any user authentication on the public site.

### Slug Generation

Slugs are auto-generated on document creation via a Mongoose pre-save hook:

```
"Bun Bo Hue" → "bun-bo-hue"
"Gà Kho Gừng" → "ga-kho-gung"  (diacritics removed)
```

Uniqueness enforced by the unique index. Collision handling: append `-2`, `-3`, etc.

---

## Index Strategy Summary

| Collection | Index | Type |
|---|---|---|
| categories | slug | unique |
| dishes | slug | unique |
| dishes | name, tags | text (full-text search) |
| dishes | viewCount | descending |
| recipes | dishId, slug | compound |
| recipeingredients | recipeId, ingredientId | unique compound |
| users | email | unique |
| searchhistories | createdAt | TTL (90 days) |
| pageviews | createdAt | TTL (1 year) |
