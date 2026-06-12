# User Flow

## Flow Notation

```
[ Page ]       — a screen or page
( Action )     — user action
{ Decision }   — branching condition
→              — navigates to
↓              — next step
```

---

## 1. New Visitor — First Visit

```
[ Home Page ]
    ↓
( Arrives on site )
    ↓
Full experience immediately — no login or registration required.
All content is publicly accessible.
```

---

## 2. Random Dish Discovery (Core Flow)

This is the primary user journey.

```
[ Home Page ]
    ↓
( Selects category mode: Normal / Vegetarian / Diet )
    ↓
( Clicks "Random Dish" button )
    ↓
[ Dish Detail Page ]
    ├── Dish image, name, description
    ├── Nutrition card (calories, protein, fat, carbs)
    ├── Cooking time + difficulty
    ├── [ Recipe List ]
    │       ↓
    │   ( Clicks recipe card from source: Cookpad / Dien May Xanh / etc. )
    │       ↓
    │   [ Expanded Recipe Detail ]
    │       ├── Ingredient list
    │       ├── Step-by-step instructions
    │       └── YouTube video embed
    │
    ├── [ Nearby Restaurants Section ]
    │       ↓
    │   { Location permission granted? }
    │       ├── Yes → Auto-fetch restaurants near user
    │       └── No  → Prompt: "Enter your location"
    │                   ↓
    │               ( Types location )
    │                   ↓
    │               [ Restaurant list with name, rating, distance, hours ]
    │
    └── ( Clicks "Save to Favorites" )
            ↓
        Dish saved to localStorage immediately — no login required
        Heart icon fills instantly
```

---

## 3. Search Flow

```
[ Any Page — Header Search Bar ]
    ↓
( User types dish name, e.g. "Pho" )
    ↓
( Debounce: 300ms )
    ↓
[ Search Dropdown — quick results ]
    ↓
( User presses Enter or clicks "See all results" )
    ↓
[ Search Results Page ]
    ├── Dish cards grid
    ├── Pagination
    └── Empty state if no results
    ↓
( User clicks a dish card )
    ↓
[ Dish Detail Page ]
```

---

## 4. Browse by Category

```
[ Home Page — Category Bar ]
    ↓
( Clicks a category: e.g. "Vietnamese" )
    ↓
[ Category Page ]
    ├── Category header with image and description
    ├── Dish grid — filtered by selected category
    ├── Subcategory filter (Normal / Vegetarian / Diet)
    └── Pagination
    ↓
( Clicks a dish card )
    ↓
[ Dish Detail Page ]
```

---

## 5. Favorites Flow

### Saving a Favorite

No account required. Favorites are stored in the browser's localStorage.

```
[ Dish Detail Page or Dish Card ]
    ↓
( Clicks heart icon )
    ↓
Read/write localStorage key "favorites"
    ↓
Heart fills immediately (no API call, no login)
```

### Viewing Favorites

```
[ Header — "Favorites" link (always visible) ]
    ↓
[ Favorites Page ]
    ├── Reads IDs from localStorage
    ├── Fetches dish/recipe details from API
    ├── Tab: Dishes
    └── Tab: Recipes
    ↓
( Clicks a favorited dish card )
    ↓
[ Dish Detail Page ]

( Clicks remove button )
    ↓
Removed from localStorage → heart unfills
```

> **Note:** Favorites are device-local. They are not synced across devices or browsers.

---

## 8. Admin — Content Management Flow

### Add New Dish

```
[ Admin Dashboard ]
    ↓
( Navigates to: Dishes → "New Dish" )
    ↓
[ New Dish Form ]
    ├── Basic info: name, slug (auto), description, image
    ├── Category and type
    ├── Nutrition: calories, protein, fat, carbs
    ├── Cooking time, servings, difficulty, tags
    ├── SEO: meta title, meta description
    └── ( Save )
            ↓
        { Validation OK? }
            ├── No  → Field errors
            └── Yes → Dish created → Redirect to Dish Detail (admin view)
```

### Add Recipe to a Dish

```
[ Dish Detail — Admin View ]
    ↓
( Clicks "Add Recipe" )
    ↓
[ New Recipe Form ]
    ├── Source, source URL, title, description
    ├── Image, YouTube URL
    ├── Servings, cooking time, difficulty
    ├── Ingredient builder: [ Add Row: ingredient, amount, unit, note ]
    ├── ( Estimate Nutrition ) → calls AI → auto-fills nutrition fields
    ├── Instruction builder: [ Add Step: step number, description, image ]
    └── ( Save )
            ↓
        Recipe created and linked to dish
```

---

## 9. Nutrition Estimation Flow (AI)

```
[ Admin — Recipe Form ]
    ↓
( Admin fills in ingredient list )
    ↓
( Clicks "Estimate Nutrition" )
    ↓
[ Loading state: spinner on nutrition fields ]
    ↓
POST /api/ai/nutrition
    ↓
[ Claude API — processes ingredients ]
    ↓
{ API returns result? }
    ├── Yes → Auto-fill: calories, protein, fat, carbs
    │           Show confidence indicator (High / Medium / Low)
    │           Admin can edit values if needed
    └── No  → Error toast: "Could not estimate — please fill manually"
```

---

## 10. Nearby Restaurants Flow

```
[ Dish Detail Page — "Nearby Restaurants" section ]
    ↓
( Section mounts in browser )
    ↓
{ Location already in localStorage? }
    ├── Yes → Use cached location
    └── No  → ( Browser requests geolocation permission )
                    ↓
                { Permission granted? }
                    ├── Yes → Use GPS coordinates
                    └── No  → Show: "Enter your location"
                                ↓
                            ( User types location )
    ↓
GET /api/restaurants/nearby?dishName=&lat=&lng=
    ↓
[ Restaurant list ]
    ├── Name, star rating, distance, open/closed, address
    └── "View on Maps" link per restaurant

{ No restaurants found? }
    └── Empty state: "No restaurants found within 2km"
```

---

## 11. View History (Passive Flow)

```
[ User navigates to Dish Detail Page ]
    ↓
( Page loads — Server Component renders )
    ↓
POST /api/dishes/[id]/view  ← fire-and-forget (non-blocking)
    ├── Increments Dish.viewCount
    └── Logs to ViewHistory (sessionId — no user account required)
```

No user action required. Fully automatic and transparent.

---

## 12. Error States

| Scenario | Behavior |
|---|---|
| Dish not found | 404 page with "Back to Home" CTA |
| Search returns 0 results | Empty state with suggested categories |
| Location denied | Manual location input prompt |
| API timeout | Error message with "Try again" button |
| Admin unauthorized | 403 page |
| Server error (5xx) | Friendly error page, no technical details shown |
