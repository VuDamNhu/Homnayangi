# Component Inventory — Recipe AI

All UI components grouped by domain. Based on the Stitch UI design.

Legend — Reusability:
- **Global** — used across multiple features and pages
- **Feature** — used within one feature, may appear on multiple pages in that feature
- **Page** — used on a single specific page only

---

## 1. Layout Components

Structural shell components that wrap page content. These never contain business logic.

---

### `Header`
**Purpose:** Top navigation bar shown on all public pages. Contains the site logo, navigation links, diet mode selector, and the search trigger.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `activeDietMode` | `'normal' \| 'vegetarian' \| 'diet'` | Highlights the active mode pill |

---

### `Footer`
**Purpose:** Bottom section with site links, category shortcuts, and branding. Shown on all public pages.
**Reusability:** Global
**Main props:** None — static content only

---

### `PageContainer`
**Purpose:** Centred content wrapper with consistent horizontal padding and max-width. Wraps the main content area of every public page.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `children` | `ReactNode` | Page content |
| `className` | `string?` | Optional additional Tailwind classes |

---

### `SectionHeading`
**Purpose:** Consistent section title with an optional subtitle and action link (e.g. "See all →"). Used to open content sections within a page.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Main heading text |
| `subtitle` | `string?` | Optional supporting text below the title |
| `actionLabel` | `string?` | Label for the right-side link |
| `actionHref` | `string?` | URL for the right-side link |

---

### `MobileNav`
**Purpose:** Bottom navigation bar shown on mobile viewports. Provides quick access to Home, Search, Random, and Favorites.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `activeRoute` | `string` | Current pathname — used to highlight the active tab |

---

### `AdminLayout`
**Purpose:** Admin panel shell. Contains the sidebar, topbar, and main content area. Wraps all `/admin/*` pages.
**Reusability:** Feature (admin only)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `children` | `ReactNode` | Admin page content |
| `pageTitle` | `string` | Title shown in the topbar |

---

### `AdminSidebar`
**Purpose:** Left navigation panel in the admin layout. Lists all CMS sections with icons and active state highlighting.
**Reusability:** Feature (admin only)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `activeSection` | `string` | Current section key — used to highlight the active link |

---

### `AdminTopbar`
**Purpose:** Top bar inside the admin layout. Shows the page title, admin user name, and sign-out button.
**Reusability:** Feature (admin only)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `pageTitle` | `string` | Displayed as the current page heading |
| `adminName` | `string` | Admin user's display name |

---

## 2. Shared Components

Cross-feature components with no domain-specific knowledge.

---

### `SearchBar`
**Purpose:** Text input that triggers a dish search. Includes a clear button and keyboard shortcut hint. Present in the Header on desktop and as a full-width input on the Search page.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `defaultValue` | `string?` | Pre-filled query value (used on the Search page) |
| `placeholder` | `string?` | Input placeholder text |
| `onSearch` | `(query: string) => void` | Callback on submit |
| `autoFocus` | `boolean?` | Focus input on mount |

---

### `DietModeSelector`
**Purpose:** Three-button toggle (Normal / Vegetarian / Diet) that sets the active diet mode. Used in the Header and on the Home page hero.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `value` | `'normal' \| 'vegetarian' \| 'diet'` | Currently active mode |
| `onChange` | `(mode: string) => void` | Callback when mode changes |

---

### `CategoryBadge`
**Purpose:** Small pill label displaying a category name with a colour accent. Shown on dish cards and dish detail page.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `name` | `string` | Category display name |
| `slug` | `string` | Used to build the link href |
| `asLink` | `boolean?` | Renders as an anchor if true |

---

### `DietTypeBadge`
**Purpose:** Pill label indicating the dish's diet type (Normal / Vegetarian / Diet) with a distinct colour per type.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `type` | `'normal' \| 'vegetarian' \| 'diet'` | Determines label text and colour |

---

### `ImageWithFallback`
**Purpose:** Wrapper around Next.js `<Image>` that renders a placeholder illustration when the src is missing or fails to load.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `src` | `string?` | Cloudinary public URL |
| `alt` | `string` | Alt text |
| `fill` | `boolean?` | Next.js fill mode |
| `width` | `number?` | Fixed width |
| `height` | `number?` | Fixed height |
| `className` | `string?` | Tailwind classes |

---

### `EmptyState`
**Purpose:** Centred illustration + message shown when a list has no results (empty search, empty favorites, no dishes in category).
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Primary message |
| `description` | `string?` | Supporting text |
| `action` | `ReactNode?` | Optional CTA button or link |
| `icon` | `ReactNode?` | Illustration or icon override |

---

### `LoadingSpinner`
**Purpose:** Animated spinner for indicating loading state in buttons and inline async sections.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | Controls dimensions |
| `className` | `string?` | Additional Tailwind classes |

---

### `SkeletonCard`
**Purpose:** Animated shimmer placeholder that matches the shape of a dish card. Shown while dish grid data is loading.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `count` | `number?` | Number of skeleton cards to render (default 6) |

---

### `Pagination`
**Purpose:** Page number controls for navigating multi-page lists. Includes previous/next buttons and page number pills.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `currentPage` | `number` | Active page number |
| `totalPages` | `number` | Total number of pages |
| `onPageChange` | `(page: number) => void` | Callback on page select |
| `baseHref` | `string?` | If set, renders links instead of buttons |

---

### `Toast`
**Purpose:** Non-blocking notification shown at the bottom of the screen. Used for success, error, and info feedback across the app.
**Reusability:** Global
**Main props:** Controlled by `useToast()` hook — not rendered directly with props

---

### `ConfirmDialog`
**Purpose:** Modal confirmation prompt for destructive actions (delete dish, delete recipe). Blocks action until the user explicitly confirms.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `open` | `boolean` | Controls visibility |
| `title` | `string` | Dialog heading |
| `description` | `string` | Warning message body |
| `onConfirm` | `() => void` | Callback on confirm |
| `onCancel` | `() => void` | Callback on cancel / close |
| `confirmLabel` | `string?` | Confirm button label (default "Delete") |
| `loading` | `boolean?` | Shows spinner on confirm button while request is in-flight |

---

## 3. Dish Components

Components that display dish data on public-facing pages.

---

### `DishCard`
**Purpose:** The primary content unit. Displays dish cover image, name, category badge, diet type badge, and a favorite toggle. Used in grids and lists throughout the site.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `dish` | `DishCardData` | Dish data (id, name, slug, coverImage, category, type) |
| `isFavorited` | `boolean` | Controls the favorite heart state |
| `onFavoriteToggle` | `(id: string) => void` | Callback on heart click |
| `priority` | `boolean?` | Passes to Next.js Image for LCP optimization |

---

### `DishGrid`
**Purpose:** Responsive grid of `DishCard` components. Handles layout breakpoints (1 col mobile → 2 col tablet → 3 col desktop).
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `dishes` | `DishCardData[]` | Array of dish data |
| `favoritedIds` | `string[]` | IDs of currently favorited dishes |
| `onFavoriteToggle` | `(id: string) => void` | Passed down to each DishCard |
| `loading` | `boolean?` | Shows SkeletonCards if true |

---

### `DishHero`
**Purpose:** Full-width hero section on the dish detail page. Shows the dish cover image, name, category, diet type, and favorite button in a large format.
**Reusability:** Page (`/dishes/[slug]`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `dish` | `DishDetailData` | Full dish data |
| `isFavorited` | `boolean` | Heart button state |
| `onFavoriteToggle` | `() => void` | Callback on heart click |

---

### `DishDescription`
**Purpose:** Displays the dish's long-form description text with a "Read more / Read less" toggle for long content.
**Reusability:** Page (`/dishes/[slug]`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `text` | `string` | Full description text |
| `clampLines` | `number?` | Number of lines shown before "Read more" (default 3) |

---

### `DishMeta`
**Purpose:** Small info row below the hero — shows category, diet type, estimated cook time (if available), and serving size.
**Reusability:** Page (`/dishes/[slug]`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `category` | `string` | Category name |
| `type` | `string` | Diet type label |
| `cookTime` | `string?` | e.g. "30 phút" |
| `servings` | `number?` | Serving count |

---

### `CategoryCard`
**Purpose:** Card for a single category. Shows category cover image and name. Used in the category navigation grid.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `category` | `CategoryCardData` | Category data (name, slug, coverImage, dishCount) |

---

### `CategoryGrid`
**Purpose:** Responsive grid of `CategoryCard` components. Used on the home page and as a category browsing section.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `categories` | `CategoryCardData[]` | Array of category data |

---

### `CategoryFilterBar`
**Purpose:** Horizontal scrollable row of category pill buttons. Used on the home page and search results to filter by category.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `categories` | `{ name: string; slug: string }[]` | Available categories |
| `activeSlug` | `string?` | Currently selected category slug |
| `onSelect` | `(slug: string \| null) => void` | Callback on selection change |

---

## 4. Recipe Components

Components that display recipe content within a dish detail page.

---

### `RecipeList`
**Purpose:** Container that renders a list of recipe source cards for a dish. Shows a heading and handles the empty case (no recipes yet).
**Reusability:** Page (`/dishes/[slug]`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `recipes` | `RecipeCardData[]` | Array of recipe data |
| `dishName` | `string` | Used in the empty state message |

---

### `RecipeCard`
**Purpose:** Card representing a single recipe from a specific source. Shows the source logo, recipe title, thumbnail, and a prominent "View Recipe" button that opens the external URL.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `recipe` | `RecipeCardData` | Recipe data (title, sourceUrl, sourceName, image) |

---

### `RecipeSourceBadge`
**Purpose:** Small logo-and-name badge indicating where a recipe comes from (Cookpad, Dien May Xanh, Savoury Days, etc.).
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `sourceName` | `string` | Source identifier |
| `size` | `'sm' \| 'md'` | Badge size |

---

### `RecipeStepList`
**Purpose:** Numbered list of cooking steps for a recipe. Each step has a number indicator and text content.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `steps` | `string[]` | Array of step text strings |

---

### `RecipeIngredientList`
**Purpose:** Formatted ingredient list for a recipe. Groups ingredients and shows quantity, unit, and name per line.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `ingredients` | `RecipeIngredientData[]` | Array of ingredient items |

---

## 5. Random Components

Components specific to the random dish discovery flow.

---

### `RandomDishButton`
**Purpose:** Large, prominent CTA button that requests a new random dish. Shows a loading spinner while the next dish is being fetched. The centrepiece of the Home page hero.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `loading` | `boolean` | Shows spinner during fetch |
| `onClick` | `() => void` | Triggers random dish request |
| `label` | `string?` | Button label (default "Hôm nay ăn gì?") |

---

### `RandomDishHero`
**Purpose:** Full home page hero section. Combines the `DietModeSelector`, `RandomDishButton`, and a brief tagline. The dish returned appears in the `DishCard` directly below.
**Reusability:** Page (`/`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `dietMode` | `'normal' \| 'vegetarian' \| 'diet'` | Active mode |
| `onDietModeChange` | `(mode: string) => void` | Mode change callback |
| `onRandom` | `() => void` | Random dish request callback |
| `loading` | `boolean` | Propagated to RandomDishButton |

---

### `RandomResultCard`
**Purpose:** Highlighted dish card displayed immediately after the random result is returned. Visually distinct from a regular `DishCard` — larger, with a subtle animation on entry.
**Reusability:** Page (`/`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `dish` | `DishCardData` | The random dish result |
| `isFavorited` | `boolean` | Heart state |
| `onFavoriteToggle` | `(id: string) => void` | Heart toggle callback |

---

## 6. Ingredient AI Components

Components for the AI-powered nutrition and ingredient suggestion features.

---

### `NutritionPanel`
**Purpose:** Displays structured nutritional data for a dish (calories, protein, carbs, fat, fiber per serving). Shown on the dish detail page. Hidden entirely if no nutrition data exists.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `nutrition` | `NutritionData` | Parsed nutrition object |
| `servings` | `number?` | Serving size label |

---

### `NutritionRow`
**Purpose:** Single row in the nutrition panel. Shows an icon, label, and value with unit.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Nutrient name |
| `value` | `number` | Nutrient amount |
| `unit` | `string` | e.g. `"g"`, `"kcal"` |
| `icon` | `ReactNode?` | Optional nutrient icon |

---

### `IngredientSuggestionPanel`
**Purpose:** Interactive panel on the dish detail page. User inputs ingredients they have on hand; the panel suggests which recipes they can make. Powered by AI.
**Reusability:** Page (`/dishes/[slug]`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `dishId` | `string` | Used to scope suggestions to this dish's recipes |
| `availableIngredients` | `IngredientData[]` | Master ingredient list for autocomplete |

---

### `IngredientTagInput`
**Purpose:** Multi-value text input for entering ingredient names. Each entered ingredient becomes a removable tag/chip. Used inside `IngredientSuggestionPanel`.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `value` | `string[]` | Current list of entered ingredient names |
| `onChange` | `(tags: string[]) => void` | Callback when tags change |
| `suggestions` | `string[]` | Autocomplete options |
| `placeholder` | `string?` | Input placeholder |

---

### `IngredientMatchResult`
**Purpose:** Shows which recipes can be made with the user's entered ingredients. Displays a match percentage and a list of missing ingredients per recipe.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `results` | `IngredientMatchData[]` | Array of recipe match results |
| `loading` | `boolean` | Shows skeleton while AI responds |

---

### `NutritionParseButton`
**Purpose:** Admin-only button that triggers the Claude API nutrition parsing job for a recipe. Shows a progress state and result summary after completion.
**Reusability:** Feature (admin only)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `recipeId` | `string` | Recipe to parse |
| `onSuccess` | `(nutrition: NutritionData) => void` | Callback with parsed result |
| `loading` | `boolean` | Spinner state |

---

## 7. Favorite Components

Components for the localStorage-based favorites feature.

---

### `FavoriteButton`
**Purpose:** Heart icon button that toggles a dish's favorite status. Manages its own visual state (filled / outline) and calls the toggle callback.
**Reusability:** Global
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `dishId` | `string` | Identifies which dish to toggle |
| `isFavorited` | `boolean` | Current state — filled or outline heart |
| `onToggle` | `(id: string) => void` | Callback on click |
| `size` | `'sm' \| 'md' \| 'lg'` | Icon size |

---

### `FavoritesList`
**Purpose:** Grid of `DishCard` components pulled from the localStorage favorites list. Handles the empty state when no dishes are favorited.
**Reusability:** Page (`/favorites`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `dishes` | `DishCardData[]` | Resolved dish data for favorited IDs |
| `onFavoriteToggle` | `(id: string) => void` | Remove from list on toggle |
| `loading` | `boolean?` | Shows skeleton while dish data resolves |

---

### `FavoritesEmptyState`
**Purpose:** Specific empty state for the favorites page. Shows an illustration with a prompt to browse dishes and get a random suggestion.
**Reusability:** Page (`/favorites`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `onRandomClick` | `() => void` | Triggers random dish navigation |

---

## 8. Profile Components

Components for the admin user profile. Public users have no profile.

---

### `AdminAvatar`
**Purpose:** Circular avatar image for the admin user. Falls back to initials in a coloured circle if no image is uploaded.
**Reusability:** Feature (admin only)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `name` | `string` | Admin's display name (used for initials fallback) |
| `imageUrl` | `string?` | Cloudinary avatar URL |
| `size` | `'sm' \| 'md' \| 'lg'` | Avatar dimensions |

---

### `AdminProfileCard`
**Purpose:** Card in the admin settings area showing the current admin's name, email, and avatar, with edit and change-password actions.
**Reusability:** Page (`/admin/settings`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `admin` | `AdminProfileData` | Name, email, imageUrl, role |
| `onEdit` | `() => void` | Opens the edit profile form |
| `onChangePassword` | `() => void` | Opens the change password dialog |

---

### `ChangePasswordDialog`
**Purpose:** Modal form for changing the admin password. Fields: current password, new password, confirm new password.
**Reusability:** Page (`/admin/settings`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `open` | `boolean` | Controls visibility |
| `onClose` | `() => void` | Close callback |
| `onSubmit` | `(data: ChangePasswordData) => Promise<void>` | Submit callback |

---

## 9. Restaurant Components

Components for the nearby restaurants feature on the dish detail page.

---

### `NearbyRestaurantsSection`
**Purpose:** Full section on the dish detail page. Requests the user's geolocation, queries the Places API, and renders either a map + list, an empty state, or an error state depending on the result.
**Reusability:** Page (`/dishes/[slug]`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `dishName` | `string` | Used as the Places API search query |

---

### `RestaurantCard`
**Purpose:** Card for a single nearby restaurant result. Shows name, distance, rating stars, open/closed status, and a "View on Maps" link.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `restaurant` | `RestaurantData` | Name, address, distance, rating, isOpen, mapsUrl |

---

### `RestaurantList`
**Purpose:** Vertical list of `RestaurantCard` components. Shown beside or below the map depending on viewport.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `restaurants` | `RestaurantData[]` | Array of Places API results |

---

### `NearbyMap`
**Purpose:** Embedded Google Maps view with pins for each nearby restaurant result. Clicking a pin highlights the corresponding `RestaurantCard`.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `restaurants` | `RestaurantData[]` | Provides pin coordinates |
| `center` | `{ lat: number; lng: number }` | User's current location |
| `selectedId` | `string?` | ID of the currently highlighted restaurant |
| `onPinClick` | `(id: string) => void` | Callback on map pin click |

---

### `GeolocationPrompt`
**Purpose:** Shown when the user has not yet granted location permission. Explains why location is needed and provides a "Enable location" button.
**Reusability:** Feature
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `onRequest` | `() => void` | Triggers the browser geolocation prompt |

---

## 10. Admin Components

CMS-specific components. Used only within `/admin/*` pages.

---

### `DataTable`
**Purpose:** Generic sortable, filterable, paginated table for listing CMS resources (dishes, recipes, categories, etc.). Renders rows based on a column definition array.
**Reusability:** Feature (admin only)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `columns` | `ColumnDef[]` | Column definitions (header, accessor, cell renderer) |
| `data` | `Record<string, unknown>[]` | Row data |
| `loading` | `boolean?` | Shows skeleton rows |
| `totalPages` | `number` | For pagination controls |
| `currentPage` | `number` | Active page |
| `onPageChange` | `(page: number) => void` | Pagination callback |

---

### `StatsCard`
**Purpose:** Single metric card on the admin dashboard. Shows a label, a large number, an icon, and an optional trend indicator.
**Reusability:** Feature (admin only)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Metric name — "Total Dishes" |
| `value` | `number \| string` | The metric value |
| `icon` | `ReactNode` | Icon for the card |
| `trend` | `'up' \| 'down' \| 'flat'?` | Optional trend arrow |
| `trendValue` | `string?` | e.g. "+12 this week" |

---

### `AdminDishForm`
**Purpose:** Full create/edit form for a dish. Includes all fields: name, slug, description, category, diet type, cover image upload, and published toggle.
**Reusability:** Page (`/admin/dishes/new`, `/admin/dishes/[id]`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `defaultValues` | `DishFormData?` | Pre-filled values for edit mode |
| `categories` | `CategoryOption[]` | Available categories for the select input |
| `onSubmit` | `(data: DishFormData) => Promise<void>` | Form submit callback |
| `loading` | `boolean` | Disables form while submitting |

---

### `AdminRecipeForm`
**Purpose:** Full create/edit form for a recipe. Includes: dish selector, source name, source URL, ingredient list builder, and step list builder.
**Reusability:** Page (`/admin/recipes/new`, `/admin/recipes/[id]`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `defaultValues` | `RecipeFormData?` | Pre-filled values for edit mode |
| `dishes` | `DishOption[]` | Available dishes for the dish selector |
| `onSubmit` | `(data: RecipeFormData) => Promise<void>` | Form submit callback |
| `loading` | `boolean` | Disables form while submitting |

---

### `ImageUploadField`
**Purpose:** Drag-and-drop (or click-to-browse) image upload input. Shows a preview of the selected image, file validation feedback, and an upload progress bar. Calls `/api/upload` server-side.
**Reusability:** Feature (admin only)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `value` | `string?` | Current Cloudinary public ID |
| `onChange` | `(publicId: string) => void` | Callback with confirmed public ID after upload |
| `aspectRatio` | `'16/9' \| '1/1' \| '3/1'` | Preview crop shape |

---

### `PublishToggle`
**Purpose:** Toggle switch that sets a dish's `published` status. Labelled "Published / Draft". Triggers immediate API update on change.
**Reusability:** Feature (admin only)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `dishId` | `string` | Target dish |
| `published` | `boolean` | Current state |
| `onChange` | `(published: boolean) => Promise<void>` | Toggle callback |

---

### `InlineEditField`
**Purpose:** Text field that switches between display mode and edit mode on click. Used for quick edits in the admin data table without opening a full form.
**Reusability:** Feature (admin only)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `value` | `string` | Current display value |
| `onSave` | `(value: string) => Promise<void>` | Save callback |
| `inputType` | `'text' \| 'number'?` | Input type |

---

### `BannerPreview`
**Purpose:** Visual preview of a banner image as it will appear on the home page. Shown in the banner create/edit form.
**Reusability:** Page (`/admin/banners`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `imageUrl` | `string?` | Banner Cloudinary URL |
| `linkUrl` | `string?` | Shows the destination link below the preview |

---

### `AnalyticsChart`
**Purpose:** Line or bar chart rendering time-series data (daily views, search counts). Wraps a lightweight charting library (e.g. Recharts).
**Reusability:** Page (`/admin/analytics`)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `data` | `ChartDataPoint[]` | Array of `{ date, value }` objects |
| `type` | `'line' \| 'bar'` | Chart type |
| `label` | `string` | Y-axis label |
| `color` | `string?` | Line or bar colour |

---

### `SeoMetaForm`
**Purpose:** Form for editing the SEO meta fields of a dish or category: title override, description override, and OG image upload.
**Reusability:** Feature (admin only)
**Main props:**
| Prop | Type | Description |
|---|---|---|
| `resourceType` | `'dish' \| 'category'` | Determines which record is updated |
| `resourceId` | `string` | MongoDB ID of the record |
| `defaultValues` | `SeoMetaData?` | Pre-filled current values |
| `onSubmit` | `(data: SeoMetaData) => Promise<void>` | Save callback |

---

## Component Count Summary

| Group | Count |
|---|---|
| Layout Components | 7 |
| Shared Components | 10 |
| Dish Components | 7 |
| Recipe Components | 5 |
| Random Components | 3 |
| Ingredient AI Components | 6 |
| Favorite Components | 3 |
| Profile Components | 3 |
| Restaurant Components | 5 |
| Admin Components | 11 |
| **Total** | **60** |
