# UI Screen → Component Mapping — Recipe AI

Each screen from the Stitch design is broken down into its components and the user actions it supports.

Format per screen:
```
Screen → Components → Actions
```

---

## 1. Home Screen

**Route:** `/`
**Type:** Server Component (ISR) + Client islands

```
HomeScreen
├── Header
│   ├── Logo (link → /)
│   ├── SearchBar (collapsed icon on mobile)
│   ├── DietModeSelector
│   └── MobileNav (bottom bar on mobile)
│
├── BannerCarousel
│   └── BannerSlide (×N — from admin)
│
├── RandomDishHero
│   ├── DietModeSelector (full-width on mobile)
│   ├── RandomDishButton ("Hôm nay ăn gì?")
│   └── RandomResultCard (appears after button tap)
│       ├── ImageWithFallback
│       ├── DishMeta
│       ├── CategoryBadge
│       ├── DietTypeBadge
│       └── FavoriteButton
│
├── SectionHeading ("Danh mục món ăn", link → /categories)
├── CategoryFilterBar
│
├── SectionHeading ("Gợi ý hôm nay", link → /dishes)
├── DishGrid
│   └── DishCard (×6)
│       ├── ImageWithFallback
│       ├── CategoryBadge
│       ├── DietTypeBadge
│       └── FavoriteButton
│
└── Footer
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Get random dish | Tap `RandomDishButton` | Fetch `GET /api/dishes/random?type={mode}` → show `RandomResultCard` |
| Change diet mode | Tap mode pill in `DietModeSelector` | Update client state → re-fetch random dish with new mode |
| Navigate to dish | Tap `RandomResultCard` or `DishCard` | Route to `/dishes/[slug]` |
| Navigate to category | Tap `CategoryFilterBar` pill | Filter `DishGrid` or route to `/categories/[slug]` |
| Toggle favorite | Tap `FavoriteButton` on any card | Read/write `localStorage` favorites list |
| Open search | Tap `SearchBar` icon | Expand search input or route to `/search` |
| View banner link | Tap `BannerSlide` | Navigate to banner's configured URL |

---

## 2. Search Screen

**Route:** `/search?q={query}`
**Type:** Server Component (dynamic, no-cache) + Client search input

```
SearchScreen
├── Header
│   ├── SearchBar (expanded, focused, pre-filled with query)
│   ├── DietModeSelector
│   └── MobileNav
│
├── PageContainer
│   ├── CategoryFilterBar (filter results by category)
│   │
│   ├── [if results exist]
│   │   ├── SectionHeading ("{N} kết quả cho '{query}'")
│   │   ├── DishGrid
│   │   │   └── DishCard (×N)
│   │   └── Pagination
│   │
│   └── [if no results]
│       └── EmptyState
│           └── RandomDishButton (secondary CTA)
│
└── Footer
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Submit search | Type + Enter in `SearchBar` | Navigate to `/search?q={query}` |
| Clear search | Tap × in `SearchBar` | Clear input, focus remains |
| Filter by category | Tap `CategoryFilterBar` pill | Append `&category={slug}` to URL, re-fetch |
| Navigate to dish | Tap `DishCard` | Route to `/dishes/[slug]` |
| Toggle favorite | Tap `FavoriteButton` | Read/write `localStorage` |
| Paginate results | Tap `Pagination` controls | Append `&page={n}` to URL |
| Get random dish | Tap `RandomDishButton` in empty state | Route to `/random` |

---

## 3. Dish Detail Screen

**Route:** `/dishes/[slug]`
**Type:** Server Component (ISR) + Client islands

```
DishDetailScreen
├── Header
│   ├── Back button (← on mobile)
│   ├── SearchBar
│   └── MobileNav
│
├── DishHero
│   ├── ImageWithFallback (cover, priority LCP)
│   ├── CategoryBadge
│   ├── DietTypeBadge
│   └── FavoriteButton
│
├── PageContainer
│   ├── DishDescription
│   │   └── "Read more / Read less" toggle
│   │
│   ├── DishMeta
│   │   ├── Category label
│   │   ├── Diet type label
│   │   ├── Cook time (if available)
│   │   └── Servings (if available)
│   │
│   ├── NutritionPanel (hidden if no nutrition data)
│   │   └── NutritionRow (×5 — calories, protein, carbs, fat, fiber)
│   │
│   ├── SectionHeading ("Công thức nấu")
│   ├── RecipeList
│   │   └── RecipeCard (×N — one per source)
│   │       ├── ImageWithFallback
│   │       ├── RecipeSourceBadge
│   │       └── "Xem công thức" button (external link)
│   │
│   ├── SectionHeading ("Gợi ý nguyên liệu")
│   ├── IngredientSuggestionPanel
│   │   ├── IngredientTagInput
│   │   └── IngredientMatchResult
│   │
│   ├── SectionHeading ("Nhà hàng gần đây")
│   └── NearbyRestaurantsSection
│       ├── GeolocationPrompt (if permission not yet granted)
│       ├── NearbyMap (if permission granted + results)
│       └── RestaurantList
│           └── RestaurantCard (×N)
│
└── Footer
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Toggle favorite | Tap `FavoriteButton` | Read/write `localStorage` |
| Expand description | Tap "Read more" in `DishDescription` | Show full text |
| Open recipe | Tap "Xem công thức" on `RecipeCard` | Open source URL in new tab |
| Enter ingredients | Type in `IngredientTagInput` | Add ingredient tag |
| Get suggestions | Submit `IngredientSuggestionPanel` | POST to AI endpoint → show `IngredientMatchResult` |
| Enable location | Tap `GeolocationPrompt` button | Trigger browser geolocation prompt |
| View restaurant | Tap `RestaurantCard` "View on Maps" | Open Google Maps URL in new tab |
| Click map pin | Tap pin in `NearbyMap` | Highlight corresponding `RestaurantCard` |
| Go back | Tap back button / Header ← | Browser history back |

---

## 4. Recipe Detail Screen

**Route:** External URL (Cookpad / Dien May Xanh / Savoury Days)

Recipe detail pages live on external source sites. The app links to them; it does not host them. The "Recipe Detail" screen in Stitch represents the recipe source card on the Dish Detail screen, not a separate in-app page.

```
RecipeCard (within DishDetailScreen → RecipeList)
├── ImageWithFallback (recipe thumbnail)
├── RecipeSourceBadge
├── Recipe title
└── "Xem công thức" button → external link
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| View recipe | Tap "Xem công thức" | Opens external recipe source URL in new tab |

---

## 5. Lucky Wheel Screen

**Route:** `/random` (redirect) or embedded in `/` as `RandomDishHero`
**Type:** Client Component

The Lucky Wheel is the animated variant of the random dish feature. The wheel spins and lands on a dish.

```
LuckyWheelScreen
├── Header
│   └── MobileNav
│
├── PageContainer
│   ├── LuckyWheel
│   │   ├── WheelCanvas (animated SVG or canvas segments — dish categories)
│   │   ├── SpinButton ("Quay!")
│   │   └── WheelPointer (arrow indicator)
│   │
│   ├── DietModeSelector (above or below the wheel)
│   │
│   └── [after spin completes]
│       └── RandomResultCard
│           ├── ImageWithFallback
│           ├── DishMeta
│           ├── CategoryBadge
│           ├── DietTypeBadge
│           ├── FavoriteButton
│           └── "Xem món này" button → /dishes/[slug]
│
└── Footer
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Spin wheel | Tap `SpinButton` | Animate wheel → fetch `GET /api/dishes/random?type={mode}` → show `RandomResultCard` |
| Change diet mode | Tap `DietModeSelector` pill | Update mode, wheel segments update visually |
| View dish | Tap "Xem món này" on result | Route to `/dishes/[slug]` |
| Toggle favorite | Tap `FavoriteButton` on result | Read/write `localStorage` |
| Re-spin | Tap `SpinButton` again | New random fetch, new animation |

---

## 6. Ingredient Suggestion Screen

**Route:** Embedded panel in `/dishes/[slug]` or standalone `/ingredients`
**Type:** Client Component

```
IngredientSuggestionScreen
├── Header
│   └── MobileNav
│
├── PageContainer
│   ├── SectionHeading ("Tôi có gì trong tủ lạnh?")
│   │
│   ├── IngredientSuggestionPanel
│   │   ├── IngredientTagInput
│   │   │   ├── Tag chips (entered ingredients)
│   │   │   └── Autocomplete dropdown
│   │   └── "Tìm món" submit button
│   │
│   ├── [if results]
│   │   ├── SectionHeading ("Món bạn có thể nấu")
│   │   └── IngredientMatchResult
│   │       └── MatchResultCard (×N)
│   │           ├── DishCard (mini)
│   │           ├── Match percentage bar
│   │           └── Missing ingredients list
│   │
│   └── [if no match]
│       └── EmptyState ("Không tìm thấy món phù hợp")
│           └── RandomDishButton (fallback CTA)
│
└── Footer
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Add ingredient | Type + Enter or select autocomplete | Append tag to `IngredientTagInput` |
| Remove ingredient | Tap × on a tag | Remove tag from list |
| Find matches | Tap "Tìm món" | POST ingredients to AI endpoint → show `IngredientMatchResult` |
| View matched dish | Tap `MatchResultCard` | Route to `/dishes/[slug]` |
| Get random dish | Tap `RandomDishButton` in empty state | Route to `/random` |

---

## 7. Favorites Screen

**Route:** `/favorites`
**Type:** Client Component (fully localStorage-driven)

```
FavoritesScreen
├── Header
│   ├── SearchBar
│   └── MobileNav
│
├── PageContainer
│   ├── SectionHeading ("Món yêu thích của bạn")
│   │
│   ├── [if favorites exist]
│   │   └── FavoritesList
│   │       └── DishGrid
│   │           └── DishCard (×N — resolved from localStorage IDs)
│   │               ├── ImageWithFallback
│   │               ├── CategoryBadge
│   │               ├── DietTypeBadge
│   │               └── FavoriteButton (filled — tap to remove)
│   │
│   └── [if no favorites]
│       └── FavoritesEmptyState
│           ├── Illustration
│           ├── "Bạn chưa có món yêu thích nào"
│           └── RandomDishButton ("Khám phá ngay")
│
└── Footer
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Load favorites | Page mount | Read IDs from `localStorage` → fetch dish data from API |
| Remove favorite | Tap filled `FavoriteButton` on card | Remove ID from `localStorage` → remove card from list |
| Navigate to dish | Tap `DishCard` (not the heart) | Route to `/dishes/[slug]` |
| Get random dish | Tap `RandomDishButton` in empty state | Route to `/random` |

---

## 8. History Screen

**Route:** `/history`
**Type:** Client Component (sessionStorage or localStorage)

The history feature records dishes the user has viewed in the current or recent sessions.

```
HistoryScreen
├── Header
│   ├── SearchBar
│   └── MobileNav
│
├── PageContainer
│   ├── SectionHeading ("Đã xem gần đây")
│   ├── "Xóa lịch sử" clear button (top right of section)
│   │
│   ├── [if history exists]
│   │   └── DishGrid
│   │       └── DishCard (×N — chronological, newest first)
│   │           ├── ImageWithFallback
│   │           ├── CategoryBadge
│   │           ├── DietTypeBadge
│   │           ├── FavoriteButton
│   │           └── "Viewed {time ago}" label
│   │
│   └── [if no history]
│       └── EmptyState
│           └── RandomDishButton ("Bắt đầu khám phá")
│
└── Footer
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Load history | Page mount | Read viewed dish IDs from `localStorage` → fetch dish data |
| Navigate to dish | Tap `DishCard` | Route to `/dishes/[slug]` (also appends to history) |
| Toggle favorite | Tap `FavoriteButton` | Read/write `localStorage` favorites |
| Clear all history | Tap "Xóa lịch sử" | Show `ConfirmDialog` → on confirm, clear history key from `localStorage` |
| Add to history | User visits `/dishes/[slug]` | Automatically prepend dish ID to history in `localStorage` |

---

## 9. Profile Screen

**Route:** `/admin/settings` (admin only — no public profile)
**Type:** Server Component + Client form islands

Public users have no profile. This screen is the admin's own settings page.

```
ProfileScreen (Admin)
├── AdminLayout
│   ├── AdminSidebar
│   └── AdminTopbar ("Hồ sơ & Cài đặt")
│
└── PageContainer
    ├── AdminProfileCard
    │   ├── AdminAvatar
    │   ├── Admin name + email
    │   ├── "Chỉnh sửa" button → opens EditProfileDialog
    │   └── "Đổi mật khẩu" button → opens ChangePasswordDialog
    │
    ├── EditProfileDialog (modal)
    │   ├── ImageUploadField (avatar)
    │   ├── Input: Display name
    │   └── Save / Cancel buttons
    │
    ├── ChangePasswordDialog (modal)
    │   ├── Input: Current password
    │   ├── Input: New password
    │   ├── Input: Confirm new password
    │   └── Save / Cancel buttons
    │
    └── SiteSettingsForm
        ├── Toggle: Maintenance mode
        ├── NumberInput: Normal dish weight (%)
        ├── NumberInput: Vegetarian dish weight (%)
        ├── NumberInput: Diet dish weight (%)
        └── Save button
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Open edit profile | Tap "Chỉnh sửa" | Open `EditProfileDialog` modal |
| Upload avatar | Select file in `ImageUploadField` | POST to `/api/upload` → Cloudinary → update `publicId` |
| Save profile | Submit `EditProfileDialog` | PATCH `/api/admin/users/[id]` → toast success |
| Open change password | Tap "Đổi mật khẩu" | Open `ChangePasswordDialog` modal |
| Change password | Submit `ChangePasswordDialog` | PATCH `/api/admin/users/[id]/password` → toast success → close modal |
| Save site settings | Submit `SiteSettingsForm` | PATCH `/api/admin/settings` → toast success |
| Toggle maintenance mode | Flip toggle | Immediate PATCH to settings |

---

## 10. Restaurants Screen

**Route:** Embedded section in `/dishes/[slug]`
**Type:** Client Component

```
RestaurantsSection (within DishDetailScreen)
├── SectionHeading ("Nhà hàng phục vụ món này gần bạn")
│
├── [state: permission not granted]
│   └── GeolocationPrompt
│       ├── Location icon illustration
│       ├── "Cho phép truy cập vị trí để xem nhà hàng gần bạn"
│       └── "Bật vị trí" button
│
├── [state: loading]
│   └── LoadingSpinner
│
├── [state: results]
│   ├── NearbyMap
│   │   └── RestaurantPin (×N — clickable)
│   └── RestaurantList
│       └── RestaurantCard (×N)
│           ├── Restaurant name
│           ├── Distance label
│           ├── RatingStars
│           ├── Open / Closed badge
│           └── "Xem trên Maps" link
│
├── [state: zero results]
│   └── EmptyState ("Không tìm thấy nhà hàng gần bạn")
│       └── Link to Google Maps search (external)
│
└── [state: error / permission denied]
    └── EmptyState ("Không thể lấy vị trí của bạn")
        └── "Kiểm tra cài đặt trình duyệt" hint text
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Request location | Tap "Bật vị trí" | Browser geolocation prompt → on grant, fetch Places API |
| Click map pin | Tap `RestaurantPin` | Scroll + highlight matching `RestaurantCard` |
| View on Maps | Tap "Xem trên Maps" | Open Google Maps URL in new tab |
| Retry on error | Tap retry button | Re-trigger geolocation request |

---

## 11. Admin Screens

---

### 11.1 Admin Login

**Route:** `/admin/login`

```
AdminLoginScreen
└── LoginCard (centred, no sidebar)
    ├── Site logo
    ├── Input: Email
    ├── Input: Password (with show/hide toggle)
    ├── "Đăng nhập" button
    └── Error message (inline, if credentials invalid)
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Submit login | Tap "Đăng nhập" or Enter | POST credentials via NextAuth → on success, redirect to `/admin/dashboard` |
| Show/hide password | Tap eye icon | Toggle input type |

---

### 11.2 Admin Dashboard

**Route:** `/admin/dashboard`

```
AdminDashboardScreen
├── AdminLayout
└── PageContainer
    ├── StatsRow
    │   ├── StatsCard ("Tổng món ăn", count, icon)
    │   ├── StatsCard ("Công thức", count, icon)
    │   ├── StatsCard ("Danh mục", count, icon)
    │   └── StatsCard ("Lượt xem hôm nay", count, trend)
    │
    ├── SectionHeading ("Hoạt động gần đây")
    ├── RecentActivityList
    │   └── ActivityRow (×N — dish added, recipe updated, etc.)
    │
    ├── SectionHeading ("Thao tác nhanh")
    └── QuickActionGrid
        ├── QuickActionCard → /admin/dishes/new
        ├── QuickActionCard → /admin/recipes/new
        ├── QuickActionCard → /admin/categories
        └── QuickActionCard → /admin/banners
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Quick navigate | Tap `QuickActionCard` | Route to target admin page |
| Sign out | Tap "Đăng xuất" in `AdminTopbar` | NextAuth signOut → redirect to `/admin/login` |

---

### 11.3 Dish List

**Route:** `/admin/dishes`

```
AdminDishListScreen
├── AdminLayout
└── PageContainer
    ├── Topbar row
    │   ├── SearchBar (admin dish search)
    │   ├── CategoryFilter (select)
    │   ├── DietTypeFilter (select)
    │   ├── StatusFilter (All / Published / Draft)
    │   └── "Thêm món" button → /admin/dishes/new
    │
    └── DataTable (dishes)
        ├── Column: Cover image (thumbnail)
        ├── Column: Name + slug
        ├── Column: Category
        ├── Column: Diet type
        ├── Column: Status (PublishToggle)
        ├── Column: Recipe count
        ├── Column: Updated at
        └── Column: Actions
            ├── Edit icon → /admin/dishes/[id]
            └── Delete icon → ConfirmDialog
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Search dishes | Type in `SearchBar` | Filter table rows |
| Filter | Change select filters | Re-fetch with filter params |
| Toggle publish | Flip `PublishToggle` | PATCH `/api/admin/dishes/[id]` → `revalidateTag` |
| Edit dish | Tap edit icon | Route to `/admin/dishes/[id]` |
| Delete dish | Tap delete icon | Open `ConfirmDialog` → DELETE `/api/admin/dishes/[id]` |
| Add dish | Tap "Thêm món" | Route to `/admin/dishes/new` |

---

### 11.4 Dish Create / Edit

**Route:** `/admin/dishes/new` and `/admin/dishes/[id]`

```
AdminDishFormScreen
├── AdminLayout
└── PageContainer
    ├── Breadcrumb (Dishes → New / Edit)
    └── AdminDishForm
        ├── ImageUploadField (cover image)
        ├── Input: Name
        ├── Input: Slug (auto-generated, editable)
        ├── Textarea: Description
        ├── Select: Category
        ├── Select: Diet type
        ├── PublishToggle
        ├── NutritionParseButton (edit mode only)
        └── FormActions
            ├── "Lưu" submit button
            └── "Hủy" cancel link
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Upload cover | Select file in `ImageUploadField` | POST `/api/upload` → Cloudinary → store `publicId` in form state |
| Auto-generate slug | Type in Name field | Client-side slug generation updates Slug field |
| Parse nutrition | Tap `NutritionParseButton` | POST `/api/ai/nutrition` → fill nutrition fields |
| Save | Submit form | POST `/api/admin/dishes` (new) or PATCH (edit) → toast → redirect to list |
| Cancel | Tap "Hủy" | Route to `/admin/dishes` |

---

### 11.5 Recipe List

**Route:** `/admin/recipes`

```
AdminRecipeListScreen
├── AdminLayout
└── PageContainer
    ├── Topbar row
    │   ├── SearchBar
    │   ├── DishFilter (select — filter by parent dish)
    │   ├── SourceFilter (select — Cookpad / Dien May Xanh / etc.)
    │   └── "Thêm công thức" button → /admin/recipes/new
    │
    └── DataTable (recipes)
        ├── Column: Thumbnail
        ├── Column: Title
        ├── Column: Dish name (link)
        ├── Column: Source (RecipeSourceBadge)
        ├── Column: Ingredient count
        ├── Column: Updated at
        └── Column: Actions (Edit, Delete)
```

**Actions:** Same pattern as Dish List — filter, edit, delete, add.

---

### 11.6 Category List

**Route:** `/admin/categories`

```
AdminCategoryListScreen
├── AdminLayout
└── PageContainer
    ├── "Thêm danh mục" button
    └── DataTable (categories)
        ├── Column: Cover image
        ├── Column: Name
        ├── Column: Slug
        ├── Column: Dish count
        ├── Column: Display order (InlineEditField)
        └── Column: Actions (Edit, Delete)
```

**Actions:** Reorder display order inline, edit, delete (blocked if dishes assigned), add.

---

### 11.7 Ingredient List

**Route:** `/admin/ingredients`

```
AdminIngredientListScreen
├── AdminLayout
└── PageContainer
    ├── SearchBar + "Thêm nguyên liệu" button
    └── DataTable (ingredients)
        ├── Column: Name
        ├── Column: Unit
        ├── Column: Used in (recipe count)
        └── Column: Actions (Edit, Merge, Delete)
```

**Actions:** Search, edit, merge duplicates, delete (blocked if in use).

---

### 11.8 Banner List

**Route:** `/admin/banners`

```
AdminBannerListScreen
├── AdminLayout
└── PageContainer
    ├── "Thêm banner" button
    └── DataTable (banners)
        ├── Column: Preview (BannerPreview thumbnail)
        ├── Column: Link URL
        ├── Column: Date range
        ├── Column: Status (active toggle)
        ├── Column: Display order (InlineEditField)
        └── Column: Actions (Edit, Delete)
```

**Actions:** Toggle active status, reorder, edit, delete, add.

---

### 11.9 Analytics Screen

**Route:** `/admin/analytics`

```
AdminAnalyticsScreen
├── AdminLayout
└── PageContainer
    ├── DateRangePicker
    │
    ├── StatsRow
    │   ├── StatsCard ("Tổng lượt xem")
    │   ├── StatsCard ("Lượt tìm kiếm")
    │   ├── StatsCard ("Món phổ biến nhất")
    │   └── StatsCard ("Từ khóa nhiều nhất")
    │
    ├── SectionHeading ("Lượt xem theo ngày")
    ├── AnalyticsChart (line — daily page views)
    │
    ├── SectionHeading ("Top 10 món ăn được xem nhiều nhất")
    ├── DataTable (top dishes — name, view count, trend)
    │
    ├── SectionHeading ("Top tìm kiếm")
    └── DataTable (search terms — keyword, count)
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Change date range | Select in `DateRangePicker` | Re-fetch analytics with new range |
| Sort table | Click column header | Re-sort DataTable |

---

### 11.10 SEO Screen

**Route:** `/admin/seo`

```
AdminSeoScreen
├── AdminLayout
└── PageContainer
    ├── SectionHeading ("Cài đặt SEO toàn trang")
    ├── SeoMetaForm (global)
    │   ├── Input: Site title template
    │   ├── Textarea: Default meta description
    │   └── ImageUploadField (default OG image)
    │
    ├── SectionHeading ("Override theo trang")
    ├── Tabs: Dishes | Categories
    └── DataTable
        ├── Column: Name / slug
        ├── Column: Custom title (InlineEditField)
        ├── Column: Custom description (InlineEditField)
        └── Column: OG image (ImageUploadField thumbnail)
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Save global SEO | Submit `SeoMetaForm` | PATCH `/api/admin/seo/global` → toast |
| Edit per-dish meta | `InlineEditField` in table | PATCH `/api/admin/seo/dish/[id]` |
| Upload OG image | `ImageUploadField` in table | POST `/api/upload` → update record |

---

### 11.11 Settings Screen

**Route:** `/admin/settings`

```
AdminSettingsScreen
├── AdminLayout
└── PageContainer
    ├── SectionHeading ("Chế độ trang")
    ├── Toggle: Maintenance mode
    │
    ├── SectionHeading ("Tỷ lệ gợi ý ngẫu nhiên")
    ├── WeightForm
    │   ├── NumberInput: Normal (%)
    │   ├── NumberInput: Vegetarian (%)
    │   ├── NumberInput: Diet (%)
    │   └── Save button (validates sum = 100%)
    │
    ├── SectionHeading ("Danh mục nổi bật (trang chủ)")
    ├── FeaturedCategorySelector
    │   ├── CategoryMultiSelect (drag to reorder)
    │   └── Save button
    │
    └── AdminProfileCard
        ├── AdminAvatar
        ├── "Chỉnh sửa hồ sơ" button
        └── "Đổi mật khẩu" button
```

**Actions:**

| Action | Trigger | Result |
|---|---|---|
| Toggle maintenance | Flip switch | PATCH `/api/admin/settings` → immediate effect |
| Save weights | Submit `WeightForm` | Validate total = 100% → PATCH settings → toast |
| Reorder categories | Drag in `FeaturedCategorySelector` | Update display order → save on submit |
| Edit profile | Tap "Chỉnh sửa hồ sơ" | Open `EditProfileDialog` |
| Change password | Tap "Đổi mật khẩu" | Open `ChangePasswordDialog` |

---

## Screen × Route Summary

| Screen | Route | Auth | Render |
|---|---|---|---|
| Home | `/` | None | ISR |
| Search | `/search` | None | Dynamic |
| Dish Detail | `/dishes/[slug]` | None | ISR |
| Lucky Wheel | `/random` | None | Client |
| Ingredient Suggestion | `/dishes/[slug]` (section) | None | Client |
| Favorites | `/favorites` | None | Client |
| History | `/history` | None | Client |
| Restaurants | `/dishes/[slug]` (section) | None | Client |
| Admin Login | `/admin/login` | None | Static |
| Admin Dashboard | `/admin/dashboard` | Admin | Dynamic |
| Dish List | `/admin/dishes` | Admin | Dynamic |
| Dish Create/Edit | `/admin/dishes/[id]` | Admin | Dynamic |
| Recipe List | `/admin/recipes` | Admin | Dynamic |
| Category List | `/admin/categories` | Admin | Dynamic |
| Ingredient List | `/admin/ingredients` | Admin | Dynamic |
| Banner List | `/admin/banners` | Admin | Dynamic |
| Analytics | `/admin/analytics` | Admin | Dynamic |
| SEO | `/admin/seo` | Admin | Dynamic |
| Settings / Profile | `/admin/settings` | Admin | Dynamic |
