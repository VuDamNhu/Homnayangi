# Features & Modules — Recipe AI

All system modules grouped by domain. Each entry covers purpose, main functions, and the pages it drives.

---

## 1. User Website

The public-facing site. Fully anonymous — no login, no registration.

---

### 1.1 Home / Random Dish Discovery

**Purpose:** Answer the primary user question — "What should I eat today?" — with a single tap.

**Main functions:**
- Display a random dish based on the active diet mode (Normal / Vegetarian / Diet)
- Let the user re-roll to get another random dish
- Show the current diet mode selector (Normal 80% / Vegetarian 10% / Diet 10%)
- Surface featured or trending dishes below the hero

**Related pages:**
- `/` — Home page with random dish CTA
- `/random` — Server redirect that resolves a random dish and forwards to its detail page

---

### 1.2 Dish Discovery & Detail

**Purpose:** Give the user full context about a dish and let them choose a recipe source.

**Main functions:**
- Display dish name, description, category, diet type, and cover image
- List all available recipes for the dish (one card per source — Cookpad, Dien May Xanh, Savoury Days, etc.)
- Show a source badge and external link on each recipe card
- Display nutritional summary if available
- Allow the user to add/remove the dish from favorites

**Related pages:**
- `/dishes/[slug]` — Dish detail page with recipe list

---

### 1.3 Category Browsing

**Purpose:** Let users explore dishes by food category (e.g., Soup, Stir-fry, Dessert).

**Main functions:**
- List all active categories with cover images
- Filter and paginate dishes within a category
- Show dish count per category
- Respect the active diet mode filter

**Related pages:**
- `/categories/[slug]` — Dishes within a category

---

### 1.4 Search

**Purpose:** Let users find a dish or ingredient by keyword.

**Main functions:**
- Full-text search across dish names and descriptions
- Filter results by category or diet type
- Return ranked results with dish cards
- Handle empty states and typo-tolerance (via MongoDB Atlas Search or basic regex)

**Related pages:**
- `/search?q=` — Search results page

---

### 1.5 Favorites

**Purpose:** Let users bookmark dishes they like without requiring an account.

**Main functions:**
- Save and remove dishes from a favorites list stored in `localStorage`
- Persist favorites across browser sessions (no server, no account)
- Display the full favorites list with dish cards
- Show a heart/bookmark toggle on every dish card and detail page

**Related pages:**
- `/favorites` — Full favorites list (client-rendered from localStorage)

---

### 1.6 Nearby Restaurants

**Purpose:** Suggest real restaurants near the user that serve a given dish.

**Main functions:**
- Request the user's geolocation (browser API)
- Query Google Maps Places API for restaurants matching the dish name
- Display results on an embedded map and as a card list
- Show distance, rating, and opening hours per restaurant

**Related pages:**
- `/dishes/[slug]` — "Find nearby" section within the dish detail page

---

## 2. Admin CMS

The admin panel at `/admin/*`. Requires login — the only authenticated area in the entire app.

---

### 2.1 Admin Authentication

**Purpose:** Gate the entire admin panel behind a secure login.

**Main functions:**
- Email + password login via NextAuth.js (credentials provider)
- Server-side session validation on every admin route
- Automatic redirect to `/admin/login` for unauthenticated requests
- Secure sign-out

**Related pages:**
- `/admin/login` — The only login page in the app

---

### 2.2 Dashboard

**Purpose:** Give admins a high-level overview of system health and content counts.

**Main functions:**
- Display total counts: dishes, recipes, categories, ingredients
- Show recent activity (newly added dishes, recipes)
- Surface quick-action shortcuts (add dish, add recipe)
- Display basic traffic metrics (page views, popular dishes)

**Related pages:**
- `/admin/dashboard`

---

### 2.3 Dish Management

**Purpose:** Full CRUD for dishes — the primary content unit.

**Main functions:**
- List all dishes with search, filter by category and diet type, and pagination
- Create a new dish (name, slug, description, category, diet type, cover image, tags)
- Edit existing dish fields
- Toggle a dish's published/draft status
- Delete a dish (soft delete preferred)
- Assign recipes to a dish

**Related pages:**
- `/admin/dishes` — List view
- `/admin/dishes/new` — Create form
- `/admin/dishes/[id]` — Edit form

---

### 2.4 Recipe Management

**Purpose:** Full CRUD for recipes linked to dishes.

**Main functions:**
- List all recipes with filter by dish and source
- Create a new recipe (title, source URL, source name, instructions, ingredients)
- Edit recipe fields and re-link to a different dish
- Delete a recipe
- Manage the ingredient list within a recipe (RecipeIngredient junction)

**Related pages:**
- `/admin/recipes` — List view
- `/admin/recipes/new` — Create form
- `/admin/recipes/[id]` — Edit form

---

### 2.5 Category Management

**Purpose:** Manage the taxonomy that groups dishes.

**Main functions:**
- List all categories
- Create a new category (name, slug, cover image, display order)
- Edit category fields
- Delete a category (blocked if dishes are still assigned)

**Related pages:**
- `/admin/categories` — List + inline edit
- `/admin/categories/[id]` — Edit form

---

### 2.6 Ingredient Management

**Purpose:** Maintain the master ingredient library used across recipes.

**Main functions:**
- List all ingredients with search
- Create a new ingredient (name, unit, nutritional data)
- Edit ingredient fields
- Merge duplicate ingredients
- Delete unused ingredients

**Related pages:**
- `/admin/ingredients` — List view
- `/admin/ingredients/[id]` — Edit form

---

### 2.7 Banner Management

**Purpose:** Control promotional banners shown on the public home page.

**Main functions:**
- List all banners with status (active / inactive)
- Create a banner (image, link URL, display order, date range)
- Edit banner fields
- Activate or deactivate a banner
- Delete a banner

**Related pages:**
- `/admin/banners`

---

### 2.8 User Management

**Purpose:** Manage admin accounts. Public visitors have no accounts.

**Main functions:**
- List all admin users
- Create a new admin user (name, email, password, role)
- Edit user details
- Deactivate or delete an admin user
- Change passwords

**Related pages:**
- `/admin/users`

---

### 2.9 Analytics

**Purpose:** Give admins insight into what users are viewing and searching for.

**Main functions:**
- Track page views per dish and category
- Record search queries
- Display top dishes by view count
- Display top search terms
- Show daily/weekly active visitor counts

**Related pages:**
- `/admin/analytics`

---

### 2.10 SEO Management

**Purpose:** Control meta titles, descriptions, and Open Graph data for key pages.

**Main functions:**
- Edit the global site meta (title template, default description, OG image)
- Override meta per dish or category
- Preview how a page appears in search results and on social shares
- Manage the sitemap generation settings

**Related pages:**
- `/admin/seo`

---

### 2.11 Settings

**Purpose:** Configure site-wide options.

**Main functions:**
- Toggle maintenance mode
- Set random dish weights per diet type (Normal / Vegetarian / Diet percentages)
- Configure featured categories shown on the home page
- Manage environment-level feature flags

**Related pages:**
- `/admin/settings`

---

## 3. AI Features

Powered by the Claude API. All AI calls are server-side only — API keys never reach the client.

---

### 3.1 Nutrition Parsing

**Purpose:** Automatically extract and structure nutritional data from a recipe's free-text ingredient list.

**Main functions:**
- Accept a raw ingredient list (text scraped or manually entered)
- Send the text to Claude with a structured prompt requesting JSON output
- Parse the response into typed nutritional fields (calories, protein, carbs, fat, fiber per serving)
- Save the result to the recipe or dish document in MongoDB
- Display a formatted nutrition panel on the dish detail page

**Related pages:**
- `/dishes/[slug]` — Nutrition panel (public display)
- `/admin/recipes/[id]` — "Parse nutrition" trigger button (admin input)
- `POST /api/ai/nutrition` — Route handler that proxies to Claude API

---

### 3.2 Dish Description Generation (Planned — Sprint 6+)

**Purpose:** Auto-generate a short, appetising description for a dish if one is not provided.

**Main functions:**
- Accept dish name, category, and diet type as input
- Prompt Claude to produce a 2–3 sentence description in the site's tone
- Allow the admin to accept, edit, or discard the generated text before saving

**Related pages:**
- `/admin/dishes/new` — "Generate description" button
- `/admin/dishes/[id]` — Same button in edit mode

---

### 3.3 Recipe Crawler & Enrichment (Sprint 9)

**Purpose:** Automatically discover and import recipes from external sources.

**Main functions:**
- Crawl approved source domains (Cookpad, Dien May Xanh, Savoury Days) for recipe pages
- Extract recipe fields (title, ingredients, steps, images) via scraping
- Use Claude to clean and normalise extracted text into the app's data schema
- Queue imports for admin review before publishing
- Flag potential duplicates against existing recipes

**Related pages:**
- `/admin/recipes` — Import queue tab
- Background job — no user-facing page; admin reviews queued items

---

## Module × Sprint Map

| Module | Sprint |
|---|---|
| Home / Random Dish | 1 |
| Dish Detail | 1 |
| Category Browsing | 1 |
| Search | 1 |
| Favorites (localStorage) | 1 / 5 |
| Admin Auth | 4 |
| Admin Dashboard | 2 |
| Dish Management | 2 / 3 |
| Recipe Management | 2 / 3 |
| Category Management | 2 / 3 |
| Ingredient Management | 2 / 3 |
| Banner Management | 2 |
| User Management | 4 |
| Analytics | 8 |
| SEO Management | 8 |
| Settings | 2 |
| Nutrition Parsing (AI) | 6 |
| Description Generation (AI) | 6+ |
| Nearby Restaurants | 7 |
| Recipe Crawler (AI) | 9 |
