# Database Schema

## Relationships

```
Category
  └── Dish (many)
        └── Recipe (many)
              └── RecipeIngredient (many)
                    └── Ingredient

User
  ├── Favorite (many)       → references Dish or Recipe
  ├── SearchHistory (many)
  └── ViewHistory (many)    → references Dish

Banner
Analytics (PageView)
```

---

## Category

```typescript
{
  _id:         ObjectId
  name:        string          // "Vietnamese", "Salad", "Soup"
  slug:        string          // "vietnamese"  [unique, indexed]
  description: string
  image:       string          // URL
  type:        'normal' | 'vegetarian' | 'diet'
  isActive:    boolean
  order:       number          // display sort order
  seo: {
    metaTitle:       string
    metaDescription: string
    canonicalUrl:    string
  }
  createdAt:   Date
  updatedAt:   Date
}
```

**Indexes:** `slug` (unique), `type`, `isActive`

---

## Dish

```typescript
{
  _id:          ObjectId
  name:         string          // "Bun Bo Hue"
  slug:         string          // "bun-bo-hue"  [unique, indexed]
  description:  string
  image:        string          // URL
  categoryId:   ObjectId        // ref: Category
  type:         'normal' | 'vegetarian' | 'diet'

  // Nutrition (estimated average across recipes)
  calories:     number          // kcal per serving
  protein:      number          // grams
  fat:          number          // grams
  carbohydrates: number         // grams
  cookingTime:  number          // minutes
  servings:     number

  difficulty:   'easy' | 'medium' | 'hard'
  tags:         string[]        // ["spicy", "noodle", "soup"]

  isActive:     boolean
  viewCount:    number
  favoriteCount: number

  seo: {
    metaTitle:       string
    metaDescription: string
    canonicalUrl:    string
  }
  createdAt:    Date
  updatedAt:    Date
}
```

**Indexes:** `slug` (unique), `categoryId`, `type`, `isActive`, `name + tags` (text), `viewCount`, `favoriteCount`

---

## Recipe

```typescript
{
  _id:         ObjectId
  dishId:      ObjectId        // ref: Dish
  title:       string          // "Bun Bo Hue - Cookpad Version"
  slug:        string          // unique per dish
  source:      string          // "Cookpad" | "Dien May Xanh" | "Savoury Days" | ...
  sourceUrl:   string          // original URL

  description: string
  image:       string          // URL
  videoUrl:    string          // YouTube embed URL

  servings:    number
  cookingTime: number          // minutes
  difficulty:  'easy' | 'medium' | 'hard'

  // Nutrition (calculated from RecipeIngredients)
  calories:    number
  protein:     number
  fat:         number
  carbohydrates: number

  instructions: [
    {
      step:        number
      description: string
      image:       string   // optional step image URL
    }
  ]

  isActive:    boolean
  createdAt:   Date
  updatedAt:   Date
}
```

**Indexes:** `dishId`, `slug` (unique), `source`, `isActive`

---

## Ingredient

```typescript
{
  _id:              ObjectId
  name:             string    // "Beef", "Rice Noodle", "Lemongrass"
  slug:             string    // unique
  nameVi:           string    // Vietnamese name (optional)

  // Nutrition per 100g
  caloriesPer100g:  number
  proteinPer100g:   number
  fatPer100g:       number
  carbsPer100g:     number

  defaultUnit:      string    // "g" | "ml" | "piece" | "tbsp" | ...
  category:         string    // "meat" | "vegetable" | "spice" | "grain" | ...

  isActive:         boolean
  createdAt:        Date
  updatedAt:        Date
}
```

**Indexes:** `slug` (unique), `name` (text), `category`

---

## RecipeIngredient

Join table between Recipe and Ingredient.

```typescript
{
  _id:          ObjectId
  recipeId:     ObjectId    // ref: Recipe
  ingredientId: ObjectId    // ref: Ingredient
  amount:       number      // e.g. 200
  unit:         string      // e.g. "g" (may differ from Ingredient.defaultUnit)
  note:         string      // "finely sliced", "optional"
}
```

**Indexes:** `recipeId`, `ingredientId`, compound `(recipeId, ingredientId)`

---

## User

```typescript
{
  _id:       ObjectId
  name:      string
  email:     string    // [unique, indexed]
  password:  string    // bcrypt hash (null if OAuth)
  avatar:    string    // URL
  role:      'ADMIN' | 'USER'
  isActive:  boolean
  provider:  'credentials' | 'google' | 'github'
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:** `email` (unique), `role`, `isActive`

---

## Favorite

```typescript
{
  _id:       ObjectId
  userId:    ObjectId                 // ref: User
  type:      'dish' | 'recipe'
  targetId:  ObjectId                 // ref: Dish or Recipe
  createdAt: Date
}
```

**Indexes:** compound `(userId, type, targetId)` (unique), `userId`, `targetId`

---

## SearchHistory

```typescript
{
  _id:         ObjectId
  userId:      ObjectId | null    // null for anonymous
  sessionId:   string             // for anonymous tracking
  keyword:     string
  resultCount: number
  createdAt:   Date
}
```

**Indexes:** `keyword` (text), `userId`, `createdAt`, `keyword + createdAt` (for analytics aggregation)

---

## ViewHistory

```typescript
{
  _id:       ObjectId
  userId:    ObjectId | null    // null for anonymous
  sessionId: string
  dishId:    ObjectId           // ref: Dish
  createdAt: Date
}
```

**Indexes:** `dishId`, `userId`, `createdAt`

---

## Banner

```typescript
{
  _id:       ObjectId
  title:     string
  image:     string    // URL
  link:      string    // destination URL
  order:     number
  isActive:  boolean
  startDate: Date | null
  endDate:   Date | null
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:** `isActive`, `order`, `startDate + endDate`

---

## PageView (Analytics)

```typescript
{
  _id:       ObjectId
  path:      string      // "/dishes/bun-bo-hue"
  referrer:  string
  userAgent: string
  sessionId: string
  userId:    ObjectId | null
  dishId:    ObjectId | null    // extracted from path if a dish page
  createdAt: Date
}
```

**Indexes:** `path`, `dishId`, `createdAt`, compound `(path, createdAt)` for time-series queries

---

## Notes

- All monetary/time/quantity fields use plain `number` — no embedded unit strings in value fields.
- `slug` fields are always URL-safe, lowercase, hyphenated. Generated on save with a pre-save hook.
- Soft deletes via `isActive: false` rather than hard deletes on Dish, Recipe, Category, User.
- Nutrition values on `Dish` are denormalized averages — recalculated whenever a child recipe's nutrition changes.
- `viewCount` and `favoriteCount` on `Dish` are denormalized counters — incremented via atomic `$inc` updates to avoid aggregation on every request.
