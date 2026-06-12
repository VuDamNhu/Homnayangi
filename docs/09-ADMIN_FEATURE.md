# Admin Feature Specification

## Overview

The admin panel is a separate section of the same Next.js application, accessed at `/admin`. It is visible only to users with `role === 'ADMIN'`.

The admin panel is built for **content managers** who are comfortable with web tools but are not developers.

---

## Access Control

- Route group: `(admin)/`
- Middleware intercepts every `/admin` and `/admin/**` request.
- Non-admin users → redirect to `/admin/login`.
- API write routes (`POST`, `PUT`, `DELETE`) check `role === 'ADMIN'` server-side.
- The public website has **no login or registration** — admin login exists only at `/admin/login`.

---

## Layout

### Admin Sidebar

Fixed left panel (240px) on desktop. Collapses to icon-only rail on medium screens.

**Navigation groups:**

```
CONTENT
  Dashboard
  Dishes
  Recipes
  Categories
  Ingredients

PLATFORM
  Users
  Banners
  Analytics
  SEO

SYSTEM
  Settings
```

Each nav item shows:
- Icon (Lucide)
- Label (hidden in collapsed mode)
- Active state: amber-100 background, amber-600 text

### Admin Header

Top bar containing:
- Page title and breadcrumb
- Logged-in user avatar + name (dropdown: "View Profile", "Logout")
- Optional: notification bell (future)

---

## Feature 1 — Dashboard

**Route:** `/admin/dashboard`

**Purpose:** Give the admin an at-a-glance view of platform health and content trends.

### Stats Cards (top row)

| Card | Value | Change indicator |
|---|---|---|
| Total Dishes | Count | vs. last 30 days |
| Total Recipes | Count | vs. last 30 days |
| Total Users | Count | vs. last 30 days |
| Page Views (30d) | Count | vs. previous 30 days |

### Charts

**Views Over Time (line chart)**
- X-axis: last 30 days
- Y-axis: daily page view count
- Tooltip shows exact count on hover

**Top 10 Dishes by Views (horizontal bar chart)**
- Shows dish name + view count
- Clickable — navigates to that dish's edit page

**Views by Category (pie or donut chart)**
- Slice per category
- Shows percentage

### Tables

**Top Searched Keywords (this week)**
- Keyword | Count | Trend (↑ ↓)

**Recently Added Dishes**
- Name | Category | Status | Created At | Edit link

---

## Feature 2 — Dish Management

**Route:** `/admin/dishes`

### Dish List Table

Columns:
- Thumbnail (50×50px)
- Name + slug (two-line cell)
- Category
- Type badge (Normal / Vegetarian / Diet)
- Recipes count
- View count
- Status toggle (Active / Inactive)
- Actions: Edit | Delete

**Filters (above table):**
- Search by name
- Filter by category (select)
- Filter by type (select)
- Filter by status (All / Active / Inactive)

**Sorting:** clickable column headers — Name, View Count, Created At.

**Pagination:** 20 per page, page controls at bottom.

### New / Edit Dish Form

**Sections:**

**1. Basic Information**
- Name (required)
- Slug (auto-generated from name, editable)
- Description (rich text or textarea)
- Image URL (with preview) — file upload in Sprint 10

**2. Classification**
- Category (searchable select)
- Type: Normal / Vegetarian / Diet (radio or select)
- Difficulty: Easy / Medium / Hard

**3. Time and Servings**
- Cooking time (minutes)
- Servings

**4. Nutrition** *(estimated per serving)*
- Calories (kcal)
- Protein (g)
- Fat (g)
- Carbohydrates (g)

**5. Tags**
- Multi-value tag input (type + Enter to add, click to remove)
- Suggested tags shown as you type

**6. SEO**
- Meta title (character count indicator, max 60)
- Meta description (character count indicator, max 160)
- Canonical URL (auto-filled, editable)

**7. Settings**
- Active toggle (default: on)

**Form actions:**
- "Save" — saves and stays on form
- "Save and View" — saves and navigates to public dish page
- "Cancel" — navigates back to list (with unsaved changes warning)

**Validation:**
- Name: required, min 2 chars
- Slug: required, URL-safe, unique
- Category: required
- Nutrition fields: non-negative numbers

---

## Feature 3 — Recipe Management

**Route:** `/admin/recipes`

### Recipe List Table

Columns:
- Dish name (linked)
- Recipe title
- Source badge (Cookpad, Dien May Xanh, etc.)
- Status toggle
- Actions: Edit | Delete

**Filters:**
- Dish name search
- Filter by source
- Filter by status

### New / Edit Recipe Form

**Sections:**

**1. Link to Dish**
- Dish selector (required, searchable)

**2. Basic Information**
- Title (required)
- Source (text input — e.g., "Cookpad")
- Source URL
- Description
- Image URL (with preview)
- YouTube URL (embed preview shown)

**3. Time and Servings**
- Cooking time (minutes)
- Servings
- Difficulty

**4. Ingredients Builder**

Dynamic list. Each row:
```
[Ingredient selector] [Amount] [Unit] [Note]  [× Remove]
[+ Add Ingredient]
```
- Ingredient selector: searchable select from Ingredient collection
- Unit: dropdown (g, ml, cup, tbsp, tsp, piece, clove, stalk, ...)
- Note: optional free text

**5. Nutrition** *(auto-fill with AI or manual)*
- "Estimate Nutrition" button — calls `/api/ai/nutrition` with current ingredient list
  - Shows loading spinner on button
  - On success: fills all four fields, shows confidence indicator
  - On failure: shows error, fields remain editable
- Calories, Protein, Fat, Carbohydrates fields (always editable regardless of AI result)

**6. Instructions Builder**

Dynamic ordered list. Each step:
```
Step [N]
[Textarea for description]
[Image URL for this step]  (optional)
[↑ Move up] [↓ Move down] [× Remove]
[+ Add Step]
```

Steps are renumbered automatically on add/remove.

**7. Settings**
- Active toggle

---

## Feature 4 — Category Management

**Route:** `/admin/categories`

### Category List

Displayed as a sortable list (drag handle on left). Order is saved immediately on drop.

Each row:
- Thumbnail image
- Name + slug
- Type badge
- Dish count
- Status toggle
- Edit | Delete

### New / Edit Category Form

- Name
- Slug (auto + editable)
- Description
- Image URL
- Type (Normal / Vegetarian / Diet)
- Display order (number input, reflected in drag-to-reorder)
- SEO fields
- Active toggle

---

## Feature 5 — Ingredient Management

**Route:** `/admin/ingredients`

### Ingredient List Table

Columns:
- Name (+ Vietnamese name if present)
- Category
- Calories/100g | Protein | Fat | Carbs
- Default unit
- Actions: Edit | Delete

**Search:** by name or Vietnamese name.

**Filter:** by ingredient category (meat, vegetable, spice, grain, dairy, seafood, other).

### New / Edit Ingredient Form

- Name (English, required)
- Vietnamese Name (optional)
- Ingredient category (select)
- Default unit (select)
- Nutrition per 100g:
  - Calories (kcal)
  - Protein (g)
  - Fat (g)
  - Carbohydrates (g)

---

## Feature 6 — Admin Account Management

**Route:** `/admin/users`

> The public site has no user accounts. This section manages **admin accounts only** — the accounts that can log in to this admin panel.

### Admin User List Table

Columns:
- Avatar (32px)
- Name
- Email
- Status badge (Active / Inactive)
- Registered date
- Actions: View | Edit | Deactivate

**Filters:**
- Search by name or email
- Filter by status

### Admin User Detail Page

**Tabs:**

1. **Profile** — name, email, avatar, registration date, last login
2. **Actions**
   - Edit name and avatar
   - Deactivate account (with confirmation — cannot deactivate your own active account)
   - Reset password (generates a new temporary password)

### Create Admin Account

Button: "Add Admin" — opens a form:
- Name
- Email
- Temporary password (must be changed on first login)

---

## Feature 7 — Banner Management

**Route:** `/admin/banners`

### Banner List

Ordered list with:
- Preview thumbnail (120×40px)
- Title
- Link destination
- Date range (start–end, or "Always active")
- Status toggle
- Edit | Delete

### New / Edit Banner Form

- Title
- Image URL (with preview — shows banner proportions)
- Click-through link URL
- Display order
- Start date (optional)
- End date (optional)
- Active toggle

---

## Feature 8 — Analytics

**Route:** `/admin/analytics`

**Period selector:** Last 7 days / 30 days / 90 days

**Sections:**

### Overview Cards
- Total page views
- Unique sessions
- Total searches
- New users

### Views Over Time
Line chart — daily view count for selected period.

### Top Dishes
Table: rank, dish name, views, favorites, link to dish.

### Search Keywords
Table: keyword, search count, trend (vs previous period).

### Traffic by Category
Bar chart — views per category.

### User Growth
Line chart — cumulative registered users over time.

---

## Feature 9 — SEO Management

**Route:** `/admin/seo`

**Purpose:** Surface all content pages that are missing SEO fields so admins can complete them.

### SEO Health Report

Table showing:
- Page type (Dish / Category)
- Name + link
- Meta title (✓ / ✗ — shows character count if present)
- Meta description (✓ / ✗)
- Canonical URL (✓ / ✗)

**Filter:** Show only pages with missing fields.

**Action:** "Edit SEO" link navigates directly to that dish/category's SEO section in its edit form.

---

## Feature 10 — Settings

**Route:** `/admin/settings`

**Sections:**

### General
- Site name
- Site description (used as default meta description)
- Default OG image URL

### Random Dish Weights
- Normal dish weight (default: 80)
- Vegetarian dish weight (default: 10)
- Diet dish weight (default: 10)
- These three must sum to 100 (validated on save)

### Nearby Restaurants
- Default search radius (meters, default: 2000)
- Max results per search (default: 10)

### AI Nutrition
- Enable / Disable AI nutrition estimation
- Rate limit per minute (default: 20)

---

## Admin UX Principles

- **Confirm before destroy.** All delete actions require a confirmation dialog with the entity name displayed.
- **No data loss on navigate.** Forms warn before leaving if there are unsaved changes (browser `beforeunload` + React state comparison).
- **Inline status toggles.** Active/inactive toggled inline on list rows without opening the form — instant `PUT` API call with optimistic UI.
- **Slug auto-generation.** Slugs are generated in real-time as the admin types the name, but remain editable and validated for uniqueness on save.
- **Search is instant.** All admin tables have a debounced search input — no "Submit" button needed.
- **Breadcrumbs always.** Every admin page shows a breadcrumb so the admin knows where they are.
