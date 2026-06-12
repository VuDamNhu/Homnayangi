# MongoDB Relationships

## Complete Relationship Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                              ADMIN                                   │
│                          (users collection)                          │
│         createdBy / updatedBy references flow from here              │
└──┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬────────────────┘
   │      │      │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼
 CATEG  DISH  RECIPE  INGR  BANNER NOTIF SYSCONF FEEDBACK
   │      │      │             
   │      │      │             
   │   ┌──┘      └──────────────────────────┐
   │   │                                    │
   ▼   ▼                                    ▼
  DISH (categoryId)            RECIPE_INGREDIENT (recipeId)
   │                                        │
   ├──► recipes (dishId)                    │
   │                                        ▼
   ├──► viewHistories (dishId)        INGREDIENT (ingredientId)
   │
   ├──► randomHistories (dishId)
   │
   ├──► favorites (targetId, type=dish)
   │
   └──► feedbacks (targetId, type=dish)
        recipes ──► feedbacks (targetId, type=recipe)
        recipes ──► favorites (targetId, type=recipe)
```

---

## 1. Core Content Chain

```
users (Admin)
    │
    │  createdBy / updatedBy
    │
    ├────────────────────────────────────────────────┐
    │                                                │
    ▼                                                │
categories ──────────────────────────────────────── │
    │                                                │
    │  ONE category HAS MANY dishes                 │
    │  (Dish stores categoryId)                     │
    ▼                                                │
dishes ◄─────────────────────────────────────────── │
    │                                                │
    │  ONE dish HAS MANY recipes                    │
    │  (Recipe stores dishId)                       │
    ▼                                                │
recipes ◄────────────────────────────────────────── │
    │                                                │
    │  ONE recipe HAS MANY recipeIngredients        │
    │  (RecipeIngredient stores recipeId)           │
    ▼                                                │
recipeIngredients ◄──────────────────────────────── ┘
    │
    │  MANY recipeIngredients REFERENCE ONE ingredient
    │  (RecipeIngredient stores ingredientId)
    ▼
ingredients
```

### Relationship Types in Core Chain

```
Relationship                  Type        Foreign Key Location
────────────────────────────────────────────────────────────
Category (1) → Dish (N)       Referenced  Dish.categoryId
Dish     (1) → Recipe (N)     Referenced  Recipe.dishId
Recipe   (1) → RecipeIngredient (N)  Referenced  RecipeIngredient.recipeId
Ingredient (1) ← RecipeIngredient (N)  Referenced  RecipeIngredient.ingredientId
Recipe.instructions           Embedded    Array inside Recipe document
```

---

## 2. Admin Content Management

Every content entity records who created it and who last modified it.

```
users (Admin)
    │
    ├── createdBy ──► categories
    │   updatedBy ──► categories
    │
    ├── createdBy ──► dishes
    │   updatedBy ──► dishes
    │
    ├── createdBy ──► recipes
    │   updatedBy ──► recipes
    │
    ├── createdBy ──► ingredients
    │   updatedBy ──► ingredients
    │
    ├── createdBy ──► banners
    │   updatedBy ──► banners
    │
    ├── userId ────► notifications  (recipient)
    │   createdBy ──► notifications (sender / system)
    │
    └── updatedBy ──► systemConfigs
```

### Audit Fields on Every Content Document

```
Content Document
┌─────────────────────────────────┐
│  ...content fields...           │
│  createdBy: ObjectId → users    │  Which admin created this
│  updatedBy: ObjectId → users    │  Which admin last edited this
│  createdAt: Date                │  Mongoose auto-timestamp
│  updatedAt: Date                │  Mongoose auto-timestamp
└─────────────────────────────────┘
```

Collections that carry `createdBy` / `updatedBy`:

```
categories        ✓ createdBy  ✓ updatedBy
dishes            ✓ createdBy  ✓ updatedBy
recipes           ✓ createdBy  ✓ updatedBy
ingredients       ✓ createdBy  ✓ updatedBy
recipeIngredients ✗ (child of recipe — inherits context)
banners           ✓ createdBy  ✓ updatedBy
notifications     ✓ createdBy  (updatedBy not needed — notifications are immutable)
systemConfigs     ✗ createdBy  ✓ updatedBy (settings are pre-seeded, only changes matter)
```

---

## 3. Feedback Relationships

Visitors can submit feedback on a dish or on a specific recipe. A single `feedbacks` collection handles both using a polymorphic reference.

```
dishes  ──────────────────────────────────────┐
                                              │
recipes ──────────────────────────────────────┤
                                              │
                                              ▼
                                         feedbacks
                                        ┌───────────────────────┐
                                        │ targetId: ObjectId    │ → dishes._id
                                        │ targetType: "dish"    │   OR
                                        │                       │ → recipes._id
                                        │ targetType: "recipe"  │
                                        └───────────────────────┘
```

### Polymorphic Reference Pattern

```
feedbacks document
┌──────────────────────────────────────────────┐
│  targetId:   ObjectId                        │
│  targetType: "dish" | "recipe"               │
│                                              │
│  When targetType = "dish"                    │
│    → look up dishes collection               │
│                                              │
│  When targetType = "recipe"                  │
│    → look up recipes collection              │
└──────────────────────────────────────────────┘
```

---

## 4. Activity Tracking Relationships

Anonymous visitor activity flows into several tracking collections, all keyed by `sessionId` (no user account required).

```
dishes
  │
  ├──► viewHistories
  │       sessionId  (anonymous visitor)
  │       dishId     (which dish was viewed)
  │
  ├──► randomHistories
  │       sessionId  (anonymous visitor)
  │       dishId     (which dish was randomly selected)
  │
  └──► favorites  (type = "dish")
          sessionId  (anonymous visitor)
          targetId   (dish or recipe saved)

recipes
  └──► favorites  (type = "recipe")
          sessionId
          targetId

Any page
  └──► searchHistories
          sessionId  (anonymous visitor)
          keyword    (what was searched)
```

---

## 5. Favorites — Polymorphic Design

```
favorites document
┌──────────────────────────────────────────────┐
│  sessionId: String                           │ anonymous visitor
│  type:      "dish" | "recipe"                │ what type was saved
│  targetId:  ObjectId                         │ → dishes._id
│                                              │   OR → recipes._id
└──────────────────────────────────────────────┘

Unique constraint: (sessionId + type + targetId)
→ prevents same visitor saving the same item twice
```

---

## 6. Full ObjectId Reference Map

Every arrow below represents an ObjectId field stored in the source collection.

```
SOURCE COLLECTION           FIELD               TARGET COLLECTION
───────────────────────────────────────────────────────────────────
dishes                      categoryId      →   categories
dishes                      createdBy       →   users
dishes                      updatedBy       →   users

recipes                     dishId          →   dishes
recipes                     createdBy       →   users
recipes                     updatedBy       →   users

recipeIngredients           recipeId        →   recipes
recipeIngredients           ingredientId    →   ingredients

categories                  createdBy       →   users
categories                  updatedBy       →   users

ingredients                 createdBy       →   users
ingredients                 updatedBy       →   users

banners                     createdBy       →   users
banners                     updatedBy       →   users

notifications               userId          →   users  (recipient)
notifications               createdBy       →   users  (sender)

systemConfigs               updatedBy       →   users

favorites                   targetId        →   dishes  OR  recipes  (polymorphic)

feedbacks                   targetId        →   dishes  OR  recipes  (polymorphic)

viewHistories               dishId          →   dishes
randomHistories             dishId          →   dishes
```

---

## 7. Denormalized Fields Map

Denormalization copies data from one collection into another to eliminate expensive queries at read time.

```
SOURCE OF TRUTH                  DENORMALIZED INTO              REASON
────────────────────────────────────────────────────────────────────────────────
viewHistories (count)            Dish.viewCount                 Avoid COUNT on every dish card
favorites (count, type=dish)     Dish.favoriteCount             Avoid COUNT on every dish card
recipes[].calories (average)     Dish.calories                  Single read, no aggregation
recipes[].protein (average)      Dish.protein                   Single read, no aggregation
recipes[].fat (average)          Dish.fat                       Single read, no aggregation
recipes[].carbohydrates (avg)    Dish.carbohydrates             Single read, no aggregation
Dish.name                        ViewHistory.dishName           Preserve analytics if dish renamed
Dish.name                        RandomHistory.dishName         Preserve analytics if dish renamed
Search keyword (processed)       SearchHistory.normalizedKeyword Aggregate "Pho" + "phở" together
```

### How Denormalized Counters Stay in Sync

```
Event                            Action
────────────────────────────────────────────────────────────────────
Visitor views dish page     →   $inc dishes.viewCount by 1  (atomic)
                                Insert viewHistories document
Visitor saves dish          →   $inc dishes.favoriteCount by 1  (atomic)
                                Insert favorites document
Visitor removes saved dish  →   $inc dishes.favoriteCount by -1  (atomic)
                                Delete favorites document
Recipe nutrition updated    →   Recalculate avg across all recipes for that dish
                                $set dishes.calories, protein, fat, carbs
```

---

## Explanation

### One — One-to-Many Relationships

```
Relationship                  Cardinality   How Implemented
───────────────────────────────────────────────────────────────────────
Category → Dishes             1 : N         Dish stores categoryId
Dish → Recipes                1 : N         Recipe stores dishId
Recipe → RecipeIngredients    1 : N         RecipeIngredient stores recipeId
Ingredient → RecipeIngredients 1 : N        RecipeIngredient stores ingredientId
Admin → created content       1 : N         Content stores createdBy / updatedBy
Dish → ViewHistories          1 : N         ViewHistory stores dishId
Dish → RandomHistories        1 : N         RandomHistory stores dishId
Dish → Favorites (dish)       1 : N         Favorite stores targetId (type=dish)
Recipe → Favorites (recipe)   1 : N         Favorite stores targetId (type=recipe)
Dish → Feedbacks (dish)       1 : N         Feedback stores targetId (type=dish)
Recipe → Feedbacks (recipe)   1 : N         Feedback stores targetId (type=recipe)
Admin → Notifications         1 : N         Notification stores userId
```

In every 1:N relationship, the foreign key is placed on the **many side** — never stored as an array on the one side. This is the standard MongoDB referencing pattern and avoids unbounded array growth.

---

### Two — Embedded vs Referenced

#### Embedded (data lives inside the parent document)

```
Recipe document
┌──────────────────────────────────────────────────────┐
│  _id, title, source, dishId, ...                     │
│                                                      │
│  instructions: [          ← EMBEDDED ARRAY           │
│    { step: 1, description: "...", image: "..." },    │
│    { step: 2, description: "...", image: "..." },    │
│    { step: 3, description: "..." }                   │
│  ]                                                   │
└──────────────────────────────────────────────────────┘
```

**Why instructions are embedded:**

- Always fetched together with the recipe — never queried in isolation.
- Bounded size: a recipe will never have more than ~30 steps.
- Embedding avoids a second DB round-trip on every recipe page load.
- No admin use case requires querying "all step 3s across all recipes."

#### Referenced (separate collections linked by ObjectId)

```
Dish document                  Recipe document
┌──────────────────┐           ┌──────────────────────────┐
│  _id: ObjectId   │◄──────────│  dishId: ObjectId        │
│  name: "..."     │           │  title: "..."            │
│  ...             │           │  ...                     │
└──────────────────┘           └──────────────────────────┘

Recipe document                RecipeIngredient document
┌──────────────────┐           ┌──────────────────────────┐
│  _id: ObjectId   │◄──────────│  recipeId: ObjectId      │
│  title: "..."    │           │  ingredientId: ObjectId  │
│  ...             │           │  amount: 500             │
└──────────────────┘           │  unit: "g"               │
                               └──────────────────────────┘
                                          │
Ingredient document                       │
┌──────────────────┐                      │
│  _id: ObjectId   │◄─────────────────────┘
│  name: "Beef"    │  ingredientId
│  cal: 250        │
└──────────────────┘
```

**Why ingredients are NOT embedded in Recipe:**

- Ingredients are a shared library — "Beef Shank" exists once and is reused across hundreds of recipes.
- Embedding would duplicate ingredient nutrition data across every recipe.
- Admin needs to independently CRUD the ingredient library.
- Ingredient-level analytics: "Which ingredients appear most often?"
- The `recipeIngredients` join table stores recipe-specific `amount` and `unit`, which differ per recipe even when the ingredient is the same.

**Why Dish→Recipe is referenced (not embedded):**

- A dish can have many recipes (potentially 5–10+ sources).
- Recipe documents can be large (instructions array, image URLs, nutrition).
- Embedding all recipes inside a dish document would cause the dish document to exceed MongoDB's 16MB limit at scale.
- Recipes are paginated, filtered, and managed independently by admins.
- The dish list page only needs dish-level data — recipes are fetched lazily on the detail page.

---

### Three — Why Each Relationship Is Designed This Way

| Relationship | Design Choice | Reasoning |
|---|---|---|
| `Dish.categoryId` references `categories` | Reference | A category contains many dishes. Storing an array of dish IDs on the category would grow unbounded. Placing `categoryId` on the dish allows efficient index-based filtering. |
| `Recipe.dishId` references `dishes` | Reference | A dish has multiple recipes from different sources. Embedding recipes in the dish document would bloat it quickly and break independent recipe management. |
| `RecipeIngredient` as a separate collection | Reference join table | Ingredients are shared library entities. The join table stores recipe-specific `amount` and `unit` without duplicating ingredient nutrition data. |
| `Recipe.instructions` embedded | Embed | Instructions are meaningless without their parent recipe. They are always fetched together, have bounded size (~30 steps), and never queried independently. |
| `createdBy`/`updatedBy` on every content doc | Reference | Lightweight audit trail — just an ObjectId. Only populated in admin views that need to display "Last edited by…". Does not affect public-facing query performance. |
| `favorites.targetId` polymorphic | Polymorphic reference | Both dishes and recipes can be saved. Two separate collections (`favoriteDishes`, `favoriteRecipes`) would duplicate the save/remove logic for no benefit. The `type` field disambiguates at read time. |
| `feedbacks.targetId` polymorphic | Polymorphic reference | Same rationale as favorites. Feedback can belong to a dish or a recipe. One collection, one API endpoint, one admin panel view. |
| `Dish.viewCount` denormalized | Denormalize | The dish grid renders hundreds of cards per page. Aggregating `viewHistories` on every render would be expensive. `$inc` on write keeps the counter accurate with zero read cost. |

---

### Four — Collections That Carry ObjectId References

```
Collection            ObjectId Fields
─────────────────────────────────────────────────────────────
dishes                categoryId, createdBy, updatedBy
recipes               dishId, createdBy, updatedBy
recipeIngredients     recipeId, ingredientId
categories            createdBy, updatedBy
ingredients           createdBy, updatedBy
banners               createdBy, updatedBy
notifications         userId (recipient), createdBy (sender)
systemConfigs         updatedBy
favorites             targetId  (polymorphic → dish or recipe)
feedbacks             targetId  (polymorphic → dish or recipe)
viewHistories         dishId
randomHistories       dishId
```

**Collections with NO ObjectId references (fully standalone):**

```
searchHistories       sessionId only — no cross-collection reference
systemConfigs         updatedBy only (optional)
banners               createdBy, updatedBy only
```

---

### Five — Denormalized Fields for Performance

Denormalization deliberately duplicates data to eliminate queries at read time. Each field below trades a slightly more complex write path for a much simpler read path.

```
Denormalized Field          Lives In     Source             Update Trigger
──────────────────────────────────────────────────────────────────────────────
Dish.viewCount              dishes       viewHistories      Each dish page view
Dish.favoriteCount          dishes       favorites          Save / unsave action
Dish.calories               dishes       recipes (avg)      Recipe nutrition change
Dish.protein                dishes       recipes (avg)      Recipe nutrition change
Dish.fat                    dishes       recipes (avg)      Recipe nutrition change
Dish.carbohydrates          dishes       recipes (avg)      Recipe nutrition change
ViewHistory.dishName        viewHistories dishes.name       Denormalized on insert
RandomHistory.dishName      randomHistories dishes.name     Denormalized on insert
SearchHistory.normalizedKeyword searchHistories keyword     Processed on insert
```

**Impact on read queries:**

```
Without denormalization                     With denormalization
───────────────────────────────────────     ────────────────────────────────────
GET /dishes (list 20 dishes)                GET /dishes (list 20 dishes)
  → 1 query on dishes                         → 1 query on dishes
  → 20 COUNT queries on viewHistories         → 0 additional queries
  → 20 COUNT queries on favorites             viewCount is already on each dish
  → 20 AGGREGATE queries for avg nutrition    calories is already on each dish
  = 61 total queries                        = 1 total query
```

---

### Six — How This Architecture Supports 10,000 Users

The website is fully public — no user accounts, no sessions to maintain at the database level. All visitors are anonymous. This significantly reduces database pressure compared to an authenticated system.

#### Request Volume Estimate

```
10,000 monthly visitors
  → ~333 daily visitors
  → ~14 visitors per hour (average)
  → peak: ~50-100 concurrent visitors

Read/write split:
  → 95% reads  (browsing, search, dish detail)
  → 5%  writes (view logs, search logs, favorites, feedback)
```

#### How the Architecture Handles This

```
Layer              Strategy                              Effect
────────────────────────────────────────────────────────────────────────────
Next.js ISR        Dish detail pages cached for 30 min   Zero DB hits per cached page
Next.js ISR        Category pages cached for 60 min      Zero DB hits per cached page
Denormalized       viewCount, favoriteCount on Dish       Dish list = 1 query, not N+1
Denormalized       Nutrition averages on Dish             No aggregation on reads
Text indexes       name + tags on dishes                  Fast full-text search
Compound indexes   categoryId + type + isActive           Fast category filter
TTL indexes        viewHistories, searchHistories         Auto-cleanup, bounded storage
Soft deletes       isActive on dishes, recipes            No orphaned FK lookups
MongoDB Atlas      Replica set with auto-failover         High availability
```

#### Query Load per Page Type

```
Page                      DB Queries    Notes
──────────────────────────────────────────────────────────────
Home (ISR cached)         0             Served from Vercel CDN
Dish detail (ISR cached)  0             Served from Vercel CDN
Dish detail (cache miss)  2             1 dish + 1 recipes
Category page (ISR)       0             Served from Vercel CDN
Search results            1             Text index on dishes
Random dish               1             Filter + sample
Favorites page            1–2           Batch fetch by IDs from localStorage
Admin dashboard           4–6           Aggregations run on low-traffic admin
```

#### Storage Estimate at 10,000 Monthly Visitors

```
Collection          Estimated Documents    Avg Size    Total
──────────────────────────────────────────────────────────────
dishes              500                    2 KB        1 MB
recipes             2,000                  4 KB        8 MB
ingredients         1,000                  0.5 KB      0.5 MB
recipeIngredients   30,000                 0.2 KB      6 MB
viewHistories       100,000 / year         0.3 KB      30 MB  (TTL 1 yr)
searchHistories     50,000 / 90 days       0.2 KB      10 MB  (TTL 90 days)
randomHistories     20,000 / 90 days       0.2 KB      4 MB   (TTL 90 days)
favorites           10,000 active          0.2 KB      2 MB   (TTL 1 yr)
feedbacks           1,000                  0.5 KB      0.5 MB
──────────────────────────────────────────────────────────────
Total estimated                                        ~62 MB
```

Well within MongoDB Atlas M0 free tier (512 MB) for development and M10 (10 GB) for production.

---

### Seven — Future Scalability Considerations

#### If traffic grows beyond 10,000 monthly visitors

```
10,000 → 100,000 monthly visitors
──────────────────────────────────────────────────────────────────
Action                         Why
──────────────────────────────────────────────────────────────────
Upgrade Atlas M10 → M30        More RAM for working set in memory
Add Redis caching layer         Cache hot dish queries beyond ISR TTL
Reduce ISR revalidate time      Dish pages: 1800s → 900s for freshness
Add Atlas Search                Replace text index with full-text search
                                with relevance ranking, typo tolerance
Move analytics writes           Queue view/search logs via a message
to async queue                  queue instead of direct DB writes
```

#### If user accounts are introduced later

```
Current design                  Migration path
──────────────────────────────────────────────────────────────
favorites.sessionId             Add optional favorites.userId field
viewHistories (sessionId)       Add optional viewHistories.userId
searchHistories (sessionId)     Add optional searchHistories.userId

No schema breaking changes — all new fields are additive (optional).
Existing anonymous records remain valid and queryable.
```

#### If content volume scales significantly

```
500 dishes → 10,000 dishes
──────────────────────────────────────────────────────────────────
Action                         Why
──────────────────────────────────────────────────────────────────
Add Atlas Search index          Richer search than basic text index:
                                fuzzy matching, Vietnamese diacritics,
                                synonyms, weighted fields
Shard by dishId                 Horizontal scaling across shards
                                when single-node write throughput hits limit
Add CDN image layer             Dish images served from Cloudinary CDN
                                not database — this is already designed in
Paginate /api/dishes/random     When dish pool is large, weighted random
differently                     sampling with $sample is efficient in Atlas
```

#### If admin team grows

```
Few admins → Large content team
──────────────────────────────────────────────────────────────────
createdBy / updatedBy           Already designed in — full audit trail
                                without schema changes
Add USER role to users          Keep ADMIN collection — add EDITOR role
                                with write access to content only,
                                no access to system settings or users
Add activity log collection     Track every admin action:
                                { userId, action, targetCollection,
                                  targetId, diff, createdAt }
```

#### Collections Designed for Extension

```
Collection          Extension Point
──────────────────────────────────────────────────────────────────
systemConfigs       New settings added as new documents — zero schema change
feedbacks           Add status workflow: new → in_review → resolved
notifications       Add push delivery channel field (email, browser, etc.)
favorites           Add userId field (optional) when accounts are introduced
dishes              Add nutritionSource field to track AI vs manual values
recipes             Add crawlStatus field: pending | approved | rejected
```
