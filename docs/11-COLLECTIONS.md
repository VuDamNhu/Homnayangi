# MongoDB Collections

## Architecture

```
categories
    └── dishes
            └── recipes
                    └── recipeIngredients
                                └── ingredients
```

All other collections are standalone or reference the above hierarchy.

---

## Table of Contents

1. [categories](#1-categories)
2. [dishes](#2-dishes)
3. [recipes](#3-recipes)
4. [ingredients](#4-ingredients)
5. [recipeIngredients](#5-recipeingredients)
6. [users](#6-users)
7. [favorites](#7-favorites)
8. [randomHistories](#8-randomhistories)
9. [searchHistories](#9-searchhistories)
10. [viewHistories](#10-viewhistories)
11. [notifications](#11-notifications)
12. [banners](#12-banners)
13. [feedbacks](#13-feedbacks)
14. [systemConfigs](#14-systemconfigs)

---

## 1. categories

**Purpose:** Organizes dishes into top-level groups (e.g., Vietnamese, Salads, Soups). Each category has a dietary type that drives the random dish weighting system (80% normal / 10% vegetarian / 10% diet).

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `name` | String | Yes | Display name, e.g. "Vietnamese" |
| `slug` | String | Yes | URL-safe identifier, e.g. "vietnamese" — unique |
| `description` | String | No | Short paragraph shown on category page |
| `image` | String | No | URL to cover image |
| `type` | String | Yes | Enum: `normal` \| `vegetarian` \| `diet` |
| `isActive` | Boolean | Yes | Soft delete flag — default `true` |
| `order` | Number | Yes | Display sort order — default `0` |
| `seo.metaTitle` | String | No | Custom `<title>` for this category page |
| `seo.metaDescription` | String | No | Custom `<meta description>` |
| `seo.canonicalUrl` | String | No | Absolute canonical URL |
| `createdAt` | Date | Auto | Mongoose timestamps |
| `updatedAt` | Date | Auto | Mongoose timestamps |

**Indexes:** `slug` (unique), `type`, `isActive`, `order`

**Notes:**
- Deleting a category does not delete its dishes — use `isActive: false` for soft delete.
- A category's `type` determines which random weight bucket its dishes fall into.

---

## 2. dishes

**Purpose:** The primary content unit of the platform. A dish represents a food item that users discover (e.g., "Bun Bo Hue"). It is intentionally dish-first, not recipe-first — multiple recipe versions live under one dish. Stores denormalized nutrition averages for fast rendering without aggregation.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `name` | String | Yes | Full dish name, e.g. "Bun Bo Hue" |
| `slug` | String | Yes | URL-safe identifier — unique |
| `description` | String | No | Overview paragraph about the dish |
| `image` | String | No | URL to hero image |
| `categoryId` | ObjectId | Yes | Reference to `categories._id` |
| `type` | String | Yes | Enum: `normal` \| `vegetarian` \| `diet` |
| `calories` | Number | No | Avg kcal per serving across recipes — default `0` |
| `protein` | Number | No | Avg grams protein per serving — default `0` |
| `fat` | Number | No | Avg grams fat per serving — default `0` |
| `carbohydrates` | Number | No | Avg grams carbs per serving — default `0` |
| `cookingTime` | Number | No | Estimated minutes to cook |
| `servings` | Number | No | Default number of servings |
| `difficulty` | String | No | Enum: `easy` \| `medium` \| `hard` |
| `tags` | [String] | No | Searchable keywords e.g. `["spicy", "noodle", "soup"]` |
| `isActive` | Boolean | Yes | Soft delete flag — default `true` |
| `viewCount` | Number | Yes | Denormalized total view count — default `0` |
| `favoriteCount` | Number | Yes | Denormalized total saves — default `0` |
| `seo.metaTitle` | String | No | Custom `<title>` |
| `seo.metaDescription` | String | No | Custom `<meta description>` |
| `seo.canonicalUrl` | String | No | Absolute canonical URL |
| `createdAt` | Date | Auto | Mongoose timestamps |
| `updatedAt` | Date | Auto | Mongoose timestamps |

**Indexes:** `slug` (unique), `categoryId`, `type`, `isActive`, `name` + `tags` (text index for search), `viewCount` (desc), `favoriteCount` (desc)

**Notes:**
- `viewCount` and `favoriteCount` are updated with atomic `$inc` — never read-modify-write.
- Nutrition fields are recalculated whenever a child recipe's nutrition changes.
- The text index on `name` + `tags` powers the `/api/search` endpoint.

---

## 3. recipes

**Purpose:** A specific version of a dish from a particular source (Cookpad, Dien May Xanh, Savoury Days, etc.). One dish can have many recipes, each with its own ingredients, instructions, and YouTube video. Stores its own nutrition values, which are calculated from its ingredient list via the AI estimation feature.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `dishId` | ObjectId | Yes | Reference to `dishes._id` |
| `title` | String | Yes | Recipe title, e.g. "Bun Bo Hue — Cookpad Version" |
| `slug` | String | Yes | URL-safe identifier — unique |
| `source` | String | No | Source site name, e.g. "Cookpad" |
| `sourceUrl` | String | No | Original recipe URL |
| `description` | String | No | Short intro paragraph |
| `image` | String | No | URL to recipe cover image |
| `videoUrl` | String | No | YouTube embed URL |
| `servings` | Number | No | Number of servings this recipe yields |
| `cookingTime` | Number | No | Minutes to cook |
| `difficulty` | String | No | Enum: `easy` \| `medium` \| `hard` |
| `calories` | Number | No | kcal per serving — filled by AI or manually |
| `protein` | Number | No | Grams per serving |
| `fat` | Number | No | Grams per serving |
| `carbohydrates` | Number | No | Grams per serving |
| `instructions` | [Object] | No | Ordered cooking steps — see sub-schema below |
| `instructions[].step` | Number | Yes | Step number (1, 2, 3…) |
| `instructions[].description` | String | Yes | Instruction text for this step |
| `instructions[].image` | String | No | Optional image URL for this step |
| `isActive` | Boolean | Yes | Soft delete flag — default `true` |
| `createdAt` | Date | Auto | Mongoose timestamps |
| `updatedAt` | Date | Auto | Mongoose timestamps |

**Indexes:** `dishId`, `slug` (unique), `source`, `isActive`

**Notes:**
- Instructions are embedded as an array (not a separate collection) because they are always queried with the recipe and never queried independently.
- When a recipe is soft-deleted, its `recipeIngredients` documents are hard-deleted (they have no independent value).
- Nutrition fields are populated by the AI nutrition estimation endpoint and can be manually overridden by admins.

---

## 4. ingredients

**Purpose:** A shared library of ingredients with standardized nutrition data per 100g. Used across all recipes. Admins manage this library; new entries are created when the recipe crawler encounters unknown ingredients.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `name` | String | Yes | English name, e.g. "Beef Shank" |
| `nameVi` | String | No | Vietnamese name, e.g. "Bắp Bò" |
| `slug` | String | Yes | URL-safe identifier — unique |
| `caloriesPer100g` | Number | No | kcal per 100g — default `0` |
| `proteinPer100g` | Number | No | Grams protein per 100g — default `0` |
| `fatPer100g` | Number | No | Grams fat per 100g — default `0` |
| `carbsPer100g` | Number | No | Grams carbs per 100g — default `0` |
| `defaultUnit` | String | No | Default measurement unit: `g` \| `ml` \| `piece` \| `tbsp` \| `tsp` \| `cup` \| `clove` \| `stalk` |
| `category` | String | No | Ingredient category: `meat` \| `seafood` \| `vegetable` \| `grain` \| `dairy` \| `spice` \| `oil` \| `other` |
| `isActive` | Boolean | Yes | Default `true` |
| `createdAt` | Date | Auto | Mongoose timestamps |
| `updatedAt` | Date | Auto | Mongoose timestamps |

**Indexes:** `slug` (unique), `name` + `nameVi` (text index for admin search), `category`

**Notes:**
- This is a shared library — one ingredient entry is reused across many recipes via `recipeIngredients`.
- The AI nutrition endpoint uses this data as a reference when estimating recipe nutrition.
- Admins should check for existing entries before creating new ones to avoid duplicates.

---

## 5. recipeIngredients

**Purpose:** Join table connecting a recipe to its ingredients. Stores the specific amount and unit for each ingredient in that recipe, which may differ from the ingredient's default unit. Used to calculate the recipe's total nutrition values.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `recipeId` | ObjectId | Yes | Reference to `recipes._id` |
| `ingredientId` | ObjectId | Yes | Reference to `ingredients._id` |
| `amount` | Number | Yes | Quantity, e.g. `500` |
| `unit` | String | Yes | Unit for this recipe, e.g. `"g"` — may differ from ingredient default |
| `note` | String | No | Prep note, e.g. "thinly sliced", "optional" |

**Indexes:** `recipeId`, `ingredientId`, compound `(recipeId, ingredientId)` unique

**Notes:**
- All `recipeIngredients` for a recipe are fetched together in a single query using `recipeId`.
- When a recipe is deleted, all its `recipeIngredients` are hard-deleted via cascade.
- When a recipe is edited, the entire ingredient list is replaced (delete old + insert new).

---

## 6. users

**Purpose:** Stores admin accounts only. There is no public user registration — the website is fully accessible to all visitors without an account. Admin accounts are created by existing admins or via a setup script. These accounts log in to the admin panel at `/admin/login` to manage content.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `name` | String | Yes | Display name |
| `email` | String | Yes | Login email — unique, lowercase |
| `password` | String | Yes | bcrypt hash (cost factor 12) |
| `avatar` | String | No | URL to profile picture |
| `role` | String | Yes | Enum: `ADMIN` — all accounts in this collection are admins |
| `isActive` | Boolean | Yes | Default `true` — deactivated admins cannot log in |
| `lastLoginAt` | Date | No | Timestamp of most recent successful login |
| `createdAt` | Date | Auto | Mongoose timestamps |
| `updatedAt` | Date | Auto | Mongoose timestamps |

**Indexes:** `email` (unique), `isActive`

**Notes:**
- There is no `USER` role — regular visitors have no accounts.
- Admin accounts cannot be self-registered; they are created by an existing admin or the initial setup script.
- Deactivating an account (`isActive: false`) immediately invalidates existing sessions.

---

## 7. favorites

**Purpose:** Tracks dishes and recipes that visitors have saved, identified by a browser session ID. Since the site has no user accounts, favorites are associated with an anonymous `sessionId` stored in the browser's localStorage. This enables server-side persistence so favorites survive browser cache clears, and provides admin analytics on which content is most saved.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `sessionId` | String | Yes | Anonymous browser session identifier (UUID, stored in localStorage) |
| `type` | String | Yes | Enum: `dish` \| `recipe` — the type of content saved |
| `targetId` | ObjectId | Yes | Reference to `dishes._id` or `recipes._id` depending on `type` |
| `createdAt` | Date | Auto | No `updatedAt` needed |

**Indexes:** compound `(sessionId, type, targetId)` unique — prevents duplicates, `targetId`, `createdAt`

**TTL:** Auto-expire records older than 1 year.

**Notes:**
- The `sessionId` is a UUID generated on the visitor's first page load and stored in localStorage. It is sent with every favorites API call.
- The uniqueness constraint on `(sessionId, type, targetId)` prevents the same item being saved twice from one browser.
- `Dish.favoriteCount` is incremented/decremented with `$inc` when favorites are added/removed.
- Favorites are identified by `sessionId`, not a user account — they are device-local by design.

---

## 8. randomHistories

**Purpose:** Logs every "Random Dish" button click. Records which dish was shown and which dietary filter was active at the time. Used by the admin analytics dashboard to understand recommendation patterns and verify the weighting distribution is working correctly.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `sessionId` | String | Yes | Anonymous browser session identifier |
| `dishId` | ObjectId | Yes | Reference to the dish that was randomly selected |
| `dishName` | String | Yes | Denormalized dish name — preserved even if dish is renamed later |
| `filterType` | String | Yes | Active dietary filter: `normal` \| `vegetarian` \| `diet` |
| `createdAt` | Date | Auto | Timestamp of the random event |

**Indexes:** `dishId`, `filterType`, `createdAt`

**TTL:** Auto-expire records older than 90 days.

**Notes:**
- `dishName` is denormalized to preserve analytics accuracy if the dish name changes later.
- This collection feeds the "Trending Dishes" widget on the admin dashboard (most randomly selected in the past 7 days).
- Non-blocking: the log write is fire-and-forget and does not delay the response to the user.

---

## 9. searchHistories

**Purpose:** Logs every search query submitted on the site. Used by the admin analytics dashboard to identify the most popular keywords, discover content gaps (searches with zero results), and understand user intent. All records are anonymous — keyed by session ID only.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `sessionId` | String | Yes | Anonymous browser session identifier |
| `keyword` | String | Yes | The exact search string submitted, trimmed |
| `normalizedKeyword` | String | Yes | Lowercase, diacritics-removed version for aggregation |
| `resultCount` | Number | Yes | Number of results returned — `0` indicates a content gap |
| `createdAt` | Date | Auto | Timestamp of the search event |

**Indexes:** `normalizedKeyword`, `resultCount`, `createdAt`

**TTL:** Auto-expire records older than 90 days.

**Notes:**
- `normalizedKeyword` ensures "Phở", "pho", and "PHO" are counted as the same keyword in analytics.
- Searches returning `resultCount: 0` are especially valuable — they reveal content the admin should add.
- Non-blocking: logged asynchronously, does not affect search response time.
- Minimum keyword length before logging: 2 characters (single-character inputs are noise).

---

## 10. viewHistories

**Purpose:** Logs every dish detail page visit. Used to populate `Dish.viewCount` (the denormalized counter on the dish document) and to power the "Top Viewed Dishes" analytics report. The sessionId is used to apply a cooldown window that prevents a single browser refresh from inflating counts.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `sessionId` | String | Yes | Anonymous browser session identifier |
| `dishId` | ObjectId | Yes | Reference to `dishes._id` |
| `dishName` | String | Yes | Denormalized dish name for analytics |
| `path` | String | Yes | Full URL path, e.g. `/dishes/bun-bo-hue` |
| `referrer` | String | No | HTTP referrer header — where the visitor came from |
| `createdAt` | Date | Auto | Timestamp of the page view |

**Indexes:** `dishId`, `createdAt`, compound `(sessionId, dishId)` for deduplication check

**TTL:** Auto-expire records older than 1 year.

**Notes:**
- Deduplication: `Dish.viewCount` is only incremented if no `viewHistory` record exists for the same `(sessionId, dishId)` within the last 30 minutes.
- `Dish.viewCount` is the live fast counter; `viewHistories` is the raw log used for time-series reports.
- `dishName` is denormalized so analytics remain readable even after a dish is renamed.

---

## 11. notifications

**Purpose:** Stores internal notifications for admin users. Alerts admins about system events: new feedback submitted by a visitor, crawler job completed, recipe pending review after crawl, system config changed by another admin. Only admin accounts receive notifications.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `userId` | ObjectId | Yes | Reference to `users._id` — the recipient admin |
| `title` | String | Yes | Short notification headline |
| `message` | String | Yes | Full notification body |
| `type` | String | Yes | Enum: `feedback` \| `crawler` \| `review` \| `system` \| `info` |
| `isRead` | Boolean | Yes | Default `false` |
| `link` | String | No | Admin panel URL to navigate to on click, e.g. `/admin/feedbacks/123` |
| `createdAt` | Date | Auto | No `updatedAt` needed |

**Indexes:** compound `(userId, isRead)` for unread badge count, `userId`, `createdAt`

**TTL:** Auto-expire records older than 60 days.

**Notes:**
- Unread count badge in the admin header: `countDocuments({ userId, isRead: false })`.
- Marking all as read: `updateMany({ userId }, { $set: { isRead: true } })`.
- Notifications are never sent to public visitors — only admin `userId` references are valid.

---

## 12. banners

**Purpose:** Manages promotional banners displayed on the homepage hero carousel. Each banner has an image, a click-through link, and optional scheduling (start and end date). Admins can drag to reorder banners, which updates the `order` field.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `title` | String | Yes | Internal label for the admin panel |
| `image` | String | Yes | URL to banner image (recommended: 1440×400px desktop, 768×300px mobile) |
| `link` | String | No | Destination URL when user clicks the banner |
| `order` | Number | Yes | Display sequence — lower number shown first, default `0` |
| `isActive` | Boolean | Yes | Master on/off toggle — default `true` |
| `startDate` | Date | No | Banner becomes visible on or after this date — `null` means no restriction |
| `endDate` | Date | No | Banner hides after this date — `null` means no restriction |
| `createdAt` | Date | Auto | Mongoose timestamps |
| `updatedAt` | Date | Auto | Mongoose timestamps |

**Indexes:** `isActive`, `order`, compound `(startDate, endDate)`

**Notes:**
- Public API filter: `isActive: true` AND `(startDate <= now OR startDate is null)` AND `(endDate >= now OR endDate is null)`.
- Hard delete is allowed — banners have no dependent collections.
- Reordering: `bulkWrite` to update the `order` field on all affected banners atomically.

---

## 13. feedbacks

**Purpose:** Stores messages submitted through the public feedback or contact form on the website. Any visitor can submit feedback without an account. Admins review submissions in the admin panel and update the status as they process each item. New submissions trigger an admin notification.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `name` | String | Yes | Visitor's name |
| `email` | String | No | Contact email — optional, no verification required |
| `subject` | String | No | Short subject line |
| `message` | String | Yes | Full feedback message body |
| `type` | String | Yes | Enum: `general` \| `bug` \| `suggestion` \| `recipe_request` \| `other` |
| `status` | String | Yes | Enum: `new` \| `read` \| `resolved` \| `dismissed` — default `new` |
| `sessionId` | String | No | Anonymous browser session ID for spam context |
| `adminNote` | String | No | Internal note added by the admin when reviewing |
| `createdAt` | Date | Auto | No `updatedAt` needed — status changes don't need a timestamp |

**Indexes:** `status`, `type`, `createdAt`

**Notes:**
- No authentication required to submit — fully public form.
- `status: "new"` items trigger a notification in the `notifications` collection for all active admins.
- The `adminNote` field lets the admin record their decision or response reasoning privately.
- Rate limiting on the submission endpoint: max 5 submissions per `sessionId` per 24 hours to prevent spam.
- Hard delete is allowed once feedback is resolved or dismissed.

---

## 14. systemConfigs

**Purpose:** Key-value store for all global system settings managed through the admin Settings page. Centralizes configurable behavior — random dish weights, restaurant search radius, AI feature toggles, site metadata — so settings can be changed by admins without a code deployment.

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | Primary key |
| `key` | String | Yes | Unique config identifier, e.g. `random_weight_normal` — unique |
| `value` | Mixed | Yes | The config value — String, Number, Boolean, or nested Object |
| `valueType` | String | Yes | Enum: `string` \| `number` \| `boolean` \| `json` — used to render the correct input in the admin UI |
| `label` | String | Yes | Human-readable label shown in the admin Settings UI |
| `description` | String | No | Explanation of what this setting controls and its effects |
| `group` | String | Yes | Settings section for UI grouping: `general` \| `random` \| `restaurants` \| `ai` \| `seo` |
| `updatedAt` | Date | Auto | Timestamp of last change |
| `updatedBy` | ObjectId | No | Reference to `users._id` — which admin last modified this value |

**Indexes:** `key` (unique), `group`

**Default Entries:**

| Key | Default Value | Group | Description |
|---|---|---|---|
| `site_name` | `"Recipe AI"` | general | Website display name |
| `site_description` | `"Discover what to eat today"` | general | Default meta description |
| `og_default_image` | `"https://..."` | seo | Fallback Open Graph image |
| `random_weight_normal` | `80` | random | % chance normal dishes are selected |
| `random_weight_vegetarian` | `10` | random | % chance vegetarian dishes are selected |
| `random_weight_diet` | `10` | random | % chance diet dishes are selected |
| `restaurant_search_radius` | `2000` | restaurants | Default nearby restaurant radius in meters |
| `restaurant_max_results` | `10` | restaurants | Max restaurants returned per search |
| `ai_nutrition_enabled` | `true` | ai | Enable/disable the AI nutrition estimation button |
| `ai_rate_limit_per_minute` | `20` | ai | Max AI requests per minute per admin account |

**Notes:**
- The three `random_weight_*` values must always sum to 100. Server-side validation enforced on save.
- System configs are cached (e.g. 5 minutes) to avoid hitting the database on every page render.
- `updatedBy` creates an implicit audit trail — which admin changed what and when.
- `valueType` drives the admin UI: `number` renders a numeric input, `boolean` renders a toggle switch, `json` renders a code editor.

---

## Relationships Summary

```
categories    (1) ──── (N)  dishes
dishes        (1) ──── (N)  recipes
recipes       (1) ──── (N)  recipeIngredients
ingredients   (1) ──── (N)  recipeIngredients

dishes        (1) ──── (N)  viewHistories
dishes        (1) ──── (N)  randomHistories
dishes        (1) ──── (N)  favorites        (type = "dish")
recipes       (1) ──── (N)  favorites        (type = "recipe")

users         (1) ──── (N)  notifications

searchHistories  — standalone (sessionId only)
banners          — standalone
feedbacks        — standalone
systemConfigs    — standalone (key/value store)
```

---

## Index Summary

| Collection | Index | Type |
|---|---|---|
| categories | slug | unique |
| categories | type, isActive | compound |
| dishes | slug | unique |
| dishes | name, tags | text |
| dishes | categoryId, type, isActive | compound |
| dishes | viewCount | descending |
| dishes | favoriteCount | descending |
| recipes | slug | unique |
| recipes | dishId, isActive | compound |
| ingredients | slug | unique |
| ingredients | name, nameVi | text |
| recipeIngredients | recipeId, ingredientId | unique compound |
| users | email | unique |
| favorites | sessionId, type, targetId | unique compound |
| favorites | createdAt | TTL (1 year) |
| randomHistories | dishId, createdAt | compound |
| randomHistories | createdAt | TTL (90 days) |
| searchHistories | normalizedKeyword | standard |
| searchHistories | createdAt | TTL (90 days) |
| viewHistories | sessionId, dishId | compound |
| viewHistories | createdAt | TTL (1 year) |
| notifications | userId, isRead | compound |
| notifications | createdAt | TTL (60 days) |
| banners | isActive, order | compound |
| feedbacks | status, createdAt | compound |
| systemConfigs | key | unique |
| systemConfigs | group | standard |
