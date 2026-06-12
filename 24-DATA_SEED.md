# Sample Data — Recipe AI

Seed data used to populate a fresh MongoDB database for development, staging, and demo environments.

**Purpose of seeding:** A blank database produces an unusable application — empty grids, broken random dish selection, and no content to test UI states against. Seed data gives every developer and tester an identical, realistic starting point without manual data entry.

**Seed script location:** `scripts/seed.ts`
**Run command:** `npx tsx scripts/seed.ts`
**Behaviour:** Idempotent — running the script twice does not create duplicates. It checks for existing documents by slug or email before inserting.

---

## 1. Categories

**Purpose:** Categories are the backbone of the taxonomy. Every dish must belong to one category. Without seed categories, the dish create form cannot be submitted and the category filter bar is empty.

Three diet-type categories are required as a minimum. Additional cuisine-type categories make the content richer for UI testing.

---

### Diet-type Categories

These three categories map directly to the random dish weight system (Normal 80% / Vegetarian 10% / Diet 10%).

| # | Name | Slug | Diet type | Display order | Description |
|---|---|---|---|---|---|
| 1 | Món thường | mon-thuong | `normal` | 1 | Các món ăn thông thường, đa dạng nguyên liệu, phù hợp mọi người. |
| 2 | Món chay | mon-chay | `vegetarian` | 2 | Các món ăn không sử dụng thịt, cá, hải sản. Lành mạnh và thanh đạm. |
| 3 | Món ăn kiêng | mon-an-kieng | `diet` | 3 | Các món ít calo, ít tinh bột, phù hợp với người đang kiểm soát cân nặng. |

---

### Cuisine-type Categories

Additional categories that reflect common Vietnamese food groupings. Used to populate the category grid and filter bar.

| # | Name | Slug | Diet type | Display order | Description |
|---|---|---|---|---|---|
| 4 | Món canh | mon-canh | `normal` | 4 | Các loại canh, súp, lẩu truyền thống Việt Nam. |
| 5 | Món xào | mon-xao | `normal` | 5 | Các món xào nhanh, giữ nguyên độ giòn và hương vị tươi. |
| 6 | Món nướng | mon-nuong | `normal` | 6 | Các món nướng than hoa, lò nướng, hoặc chảo nướng. |
| 7 | Cơm & Bún | com-bun | `normal` | 7 | Cơm trắng, cơm chiên, bún, phở, hủ tiếu và các món nước. |
| 8 | Bánh & Tráng miệng | banh-trang-mieng | `normal` | 8 | Bánh ngọt, chè, kem và các món tráng miệng. |
| 9 | Salad & Gỏi | salad-goi | `diet` | 9 | Gỏi trộn, salad nhẹ, ít dầu mỡ. |
| 10 | Đồ ăn nhanh | do-an-nhanh | `normal` | 10 | Bánh mì, bánh tráng nướng, các món ăn vặt đường phố. |

---

## 2. Sample Dishes

**Purpose:** Dishes are the primary content unit. Seed dishes serve four testing needs:
1. Populate the home page grid and category pages so layout and spacing can be verified.
2. Provide slugs that seed recipes can reference.
3. Give the random dish endpoint something to return for all three diet modes.
4. Test the dish detail page with realistic Vietnamese food data including descriptions and metadata.

A minimum of 12 dishes is recommended: at least 8 normal, 2 vegetarian, 2 diet — matching the approximate random weight distribution.

---

### Normal Dishes

| # | Name | Slug | Category | Cook time | Servings | Published |
|---|---|---|---|---|---|---|
| 1 | Phở Bò Hà Nội | pho-bo-ha-noi | Cơm & Bún | 180 phút | 4 | true |
| 2 | Bún Bò Huế | bun-bo-hue | Cơm & Bún | 120 phút | 4 | true |
| 3 | Cơm Tấm Sườn Bì Chả | com-tam-suon-bi-cha | Cơm & Bún | 90 phút | 2 | true |
| 4 | Canh Chua Cá Lóc | canh-chua-ca-loc | Món canh | 45 phút | 4 | true |
| 5 | Thịt Kho Trứng | thit-kho-trung | Món thường | 60 phút | 4 | true |
| 6 | Gà Nướng Mật Ong | ga-nuong-mat-ong | Món nướng | 75 phút | 4 | true |
| 7 | Bò Xào Rau Muống | bo-xao-rau-muong | Món xào | 20 phút | 2 | true |
| 8 | Bánh Xèo Miền Tây | banh-xeo-mien-tay | Bánh & Tráng miệng | 60 phút | 4 | true |

**Sample dish description (Phở Bò Hà Nội):**
> Phở bò là tinh hoa ẩm thực Hà Nội, với nước dùng trong vắt hầm từ xương bò và gia vị thơm lừng như hồi, quế, đinh hương. Sợi phở mềm mại, thịt bò tươi ngon, ăn kèm giá đỗ, rau thơm và tương ớt. Đây là món ăn sáng cổ điển không thể thiếu trong bữa sáng của người Hà Nội.

---

### Vegetarian Dishes

| # | Name | Slug | Category | Cook time | Servings | Published |
|---|---|---|---|---|---|---|
| 9 | Đậu Hũ Sốt Cà Chua | dau-hu-sot-ca-chua | Món chay | 25 phút | 2 | true |
| 10 | Canh Rau Củ Chay | canh-rau-cu-chay | Món canh | 30 phút | 4 | true |

**Sample dish description (Đậu Hũ Sốt Cà Chua):**
> Đậu hũ chiên vàng, sốt cà chua ngọt chua cân bằng, hành lá thơm — món chay thanh đạm dễ làm, giàu đạm thực vật và phù hợp cho cả gia đình.

---

### Diet Dishes

| # | Name | Slug | Category | Cook time | Servings | Published |
|---|---|---|---|---|---|---|
| 11 | Gỏi Gà Bắp Cải | goi-ga-bap-cai | Salad & Gỏi | 30 phút | 2 | true |
| 12 | Ức Gà Áp Chảo Rau Củ | uc-ga-ap-chao-rau-cu | Món ăn kiêng | 25 phút | 1 | true |

**Sample dish description (Gỏi Gà Bắp Cải):**
> Gỏi gà bắp cải là lựa chọn lý tưởng cho người ăn kiêng: ít calo, nhiều chất xơ, giàu protein từ gà luộc xé nhỏ, trộn cùng bắp cải, cà rốt, hành tây và nước mắm chua ngọt.

---

### Draft Dish (for testing unpublished state)

| # | Name | Slug | Category | Published |
|---|---|---|---|---|
| 13 | Lẩu Thái Hải Sản | lau-thai-hai-san | Món canh | false |

**Purpose of draft dish:** Verifies that unpublished dishes do not appear on the public site, do not appear in search results, do not appear in the random endpoint, but do appear in the admin dish list with "Draft" status.

---

## 3. Sample Recipes

**Purpose:** Recipes are the secondary content unit — linked to dishes and pointing to external cooking sources. Seed recipes serve three testing needs:
1. Verify the recipe card list renders correctly on the dish detail page.
2. Test the `RecipeSourceBadge` with multiple different source names.
3. Confirm that multiple recipes per dish display without layout issues.

Each dish should have at least two recipes from different sources to test the multi-source display.

---

### Recipes for Phở Bò Hà Nội (`pho-bo-ha-noi`)

| # | Title | Source name | Source URL |
|---|---|---|---|
| 1 | Phở Bò Hà Nội Truyền Thống | Cookpad | `https://cookpad.com/vn/cong-thuc/pho-bo-ha-noi` |
| 2 | Cách Nấu Phở Bò Chuẩn Vị Bắc | Savoury Days | `https://savourydays.com/pho-bo-ha-noi` |
| 3 | Phở Bò Đơn Giản Tại Nhà | Dien May Xanh | `https://dienmayxanh.com/kinh-nghiem-hay/pho-bo-tai-nha` |

---

### Recipes for Bún Bò Huế (`bun-bo-hue`)

| # | Title | Source name | Source URL |
|---|---|---|---|
| 4 | Bún Bò Huế Cay Đúng Điệu | Cookpad | `https://cookpad.com/vn/cong-thuc/bun-bo-hue` |
| 5 | Nấu Bún Bò Huế Chuẩn Vị | Savoury Days | `https://savourydays.com/bun-bo-hue` |

---

### Recipes for Canh Chua Cá Lóc (`canh-chua-ca-loc`)

| # | Title | Source name | Source URL |
|---|---|---|---|
| 6 | Canh Chua Cá Lóc Miền Nam | Cookpad | `https://cookpad.com/vn/cong-thuc/canh-chua-ca-loc` |
| 7 | Canh Chua Cá Lóc Thơm Ngon | Dien May Xanh | `https://dienmayxanh.com/kinh-nghiem-hay/canh-chua-ca-loc` |

---

### Recipes for Gỏi Gà Bắp Cải (`goi-ga-bap-cai`)

| # | Title | Source name | Source URL |
|---|---|---|---|
| 8 | Gỏi Gà Bắp Cải Ăn Kiêng | Cookpad | `https://cookpad.com/vn/cong-thuc/goi-ga-bap-cai` |

---

### Recipe Ingredient List (for Phở Bò Hà Nội — Recipe #1)

**Purpose:** The ingredient list tests the `RecipeIngredientList` component and provides data for the AI nutrition parsing feature.

| # | Ingredient name | Quantity | Unit |
|---|---|---|---|
| 1 | Xương bò | 1 | kg |
| 2 | Thịt bò (nạm, gầu) | 500 | g |
| 3 | Bánh phở tươi | 400 | g |
| 4 | Hành tây | 2 | củ |
| 5 | Gừng | 1 | củ |
| 6 | Hồi | 5 | cái |
| 7 | Quế | 2 | thanh |
| 8 | Đinh hương | 5 | cái |
| 9 | Nước mắm | 3 | muỗng canh |
| 10 | Muối | 1 | muỗng cà phê |
| 11 | Đường phèn | 1 | viên |
| 12 | Hành lá | 3 | cây |
| 13 | Ngò rí | 1 | bó |
| 14 | Giá đỗ | 200 | g |
| 15 | Chanh | 1 | quả |

---

### Recipe Step List (for Phở Bò Hà Nội — Recipe #1)

**Purpose:** Tests the `RecipeStepList` component with realistic multi-step cooking instructions.

| # | Step |
|---|---|
| 1 | Rửa sạch xương bò, chần qua nước sôi 5 phút rồi rửa lại bằng nước lạnh để loại bỏ tạp chất. |
| 2 | Nướng hành tây và gừng trực tiếp trên lửa đến khi cháy xém vỏ ngoài, rửa sạch. |
| 3 | Rang khô hồi, quế, đinh hương trên chảo nóng đến khi dậy mùi thơm. |
| 4 | Cho xương bò vào nồi lớn, đổ ngập nước, hầm ở lửa nhỏ trong 3–4 giờ. Thường xuyên vớt bọt. |
| 5 | Cho hành tây, gừng và túi gia vị (hồi, quế, đinh hương) vào nồi nước dùng. |
| 6 | Nêm nước mắm, muối, đường phèn cho vừa khẩu vị. |
| 7 | Luộc thịt bò nạm trong nước dùng đến khi chín mềm, vớt ra để nguội rồi thái mỏng. |
| 8 | Trần bánh phở qua nước sôi, cho vào tô. |
| 9 | Xếp thịt bò lên trên, chan nước dùng nóng, rắc hành lá và ngò rí. |
| 10 | Ăn kèm giá đỗ, chanh, tương ớt theo khẩu vị. |

---

## 4. Sample Ingredients

**Purpose:** The master ingredient library powers the autocomplete in the `IngredientTagInput` component and stores nutritional values used by the AI nutrition parser. Seed ingredients cover common Vietnamese cooking staples so the suggestion feature works out of the box.

Nutritional values are approximate per 100g (or per unit where noted) and are for demonstration purposes only.

---

### Proteins

| # | Name | Unit | Calories | Protein (g) | Carbs (g) | Fat (g) | Fiber (g) |
|---|---|---|---|---|---|---|---|
| 1 | Thịt bò | g | 250 | 26 | 0 | 15 | 0 |
| 2 | Thịt heo | g | 242 | 27 | 0 | 14 | 0 |
| 3 | Ức gà | g | 165 | 31 | 0 | 4 | 0 |
| 4 | Cá lóc | g | 102 | 19 | 0 | 2 | 0 |
| 5 | Tôm | g | 99 | 20 | 0.9 | 1.1 | 0 |
| 6 | Đậu hũ | g | 76 | 8 | 2 | 4 | 0.3 |
| 7 | Trứng gà | cái | 68 | 6 | 0.6 | 4.8 | 0 |

---

### Carbohydrates

| # | Name | Unit | Calories | Protein (g) | Carbs (g) | Fat (g) | Fiber (g) |
|---|---|---|---|---|---|---|---|
| 8 | Bánh phở tươi | g | 109 | 2.5 | 24 | 0.2 | 0.5 |
| 9 | Cơm trắng (đã nấu) | g | 130 | 2.7 | 28 | 0.3 | 0.4 |
| 10 | Bún tươi | g | 109 | 2 | 25 | 0.2 | 0.5 |
| 11 | Khoai lang | g | 86 | 1.6 | 20 | 0.1 | 3 |

---

### Vegetables

| # | Name | Unit | Calories | Protein (g) | Carbs (g) | Fat (g) | Fiber (g) |
|---|---|---|---|---|---|---|---|
| 12 | Bắp cải | g | 25 | 1.3 | 5.8 | 0.1 | 2.5 |
| 13 | Cà chua | g | 18 | 0.9 | 3.9 | 0.2 | 1.2 |
| 14 | Cà rốt | g | 41 | 0.9 | 10 | 0.2 | 2.8 |
| 15 | Rau muống | g | 19 | 2.6 | 3.1 | 0.2 | 2.1 |
| 16 | Giá đỗ | g | 30 | 3 | 5.9 | 0.2 | 1.8 |
| 17 | Hành tây | g | 40 | 1.1 | 9.3 | 0.1 | 1.7 |
| 18 | Hành lá | g | 32 | 1.8 | 7.3 | 0.2 | 2.6 |
| 19 | Gừng | g | 80 | 1.8 | 17.8 | 0.8 | 2 |
| 20 | Tỏi | g | 149 | 6.4 | 33 | 0.5 | 2.1 |
| 21 | Ớt đỏ | g | 40 | 1.9 | 8.8 | 0.4 | 1.5 |

---

### Pantry & Condiments

| # | Name | Unit | Calories | Protein (g) | Carbs (g) | Fat (g) | Fiber (g) |
|---|---|---|---|---|---|---|---|
| 22 | Dầu ăn | ml | 884 | 0 | 0 | 100 | 0 |
| 23 | Nước mắm | muỗng canh | 6 | 0.9 | 0.6 | 0 | 0 |
| 24 | Nước tương | muỗng canh | 8 | 1.3 | 1 | 0.1 | 0.1 |
| 25 | Muối | muỗng cà phê | 0 | 0 | 0 | 0 | 0 |
| 26 | Đường | g | 387 | 0 | 100 | 0 | 0 |
| 27 | Dấm | muỗng canh | 3 | 0 | 0.1 | 0 | 0 |
| 28 | Mật ong | g | 304 | 0.3 | 82 | 0 | 0.2 |

---

## 5. Sample Banners

**Purpose:** Banners are displayed in the `BannerCarousel` on the home page. Seed banners verify that the carousel renders correctly, that inactive banners do not appear, and that date-range filtering works.

Three banners are seeded: two active, one inactive (to test the filtered display in the carousel and the status toggle in the admin panel).

---

### Banner 1 — Active, currently running

| Field | Value |
|---|---|
| **Title** | Khám phá món chay ngon mỗi ngày |
| **Slug / ID** | banner-mon-chay-2026 |
| **Link URL** | `/category/mon-chay` |
| **Image** | `production/banners/mon-chay-2026_hero` (Cloudinary) |
| **Display order** | 1 |
| **Active** | `true` |
| **Start date** | 2026-01-01 |
| **End date** | 2026-12-31 |
| **Purpose** | Promotes the vegetarian category. Tests that a category-linked banner routes correctly. |

---

### Banner 2 — Active, seasonal

| Field | Value |
|---|---|
| **Title** | Thực đơn ăn kiêng cho mùa hè |
| **Slug / ID** | banner-an-kieng-he-2026 |
| **Link URL** | `/category/mon-an-kieng` |
| **Image** | `production/banners/an-kieng-he-2026_hero` (Cloudinary) |
| **Display order** | 2 |
| **Active** | `true` |
| **Start date** | 2026-06-01 |
| **End date** | 2026-08-31 |
| **Purpose** | Seasonal banner promoting diet dishes. Tests date-range-bounded display. |

---

### Banner 3 — Inactive (admin panel test)

| Field | Value |
|---|---|
| **Title** | Tết 2026 — Thực đơn đón xuân |
| **Slug / ID** | banner-tet-2026 |
| **Link URL** | `/search?q=tet` |
| **Image** | `production/banners/tet-2026_hero` (Cloudinary) |
| **Display order** | 3 |
| **Active** | `false` |
| **Start date** | 2026-01-15 |
| **End date** | 2026-02-10 |
| **Purpose** | Inactive banner. Verifies it does not appear in the public carousel. Visible in admin banner list with "Inactive" status to test the toggle. |

---

## 6. Sample Admin Account

**Purpose:** A pre-seeded admin account is required for initial access to the admin panel. Without it, the admin panel is completely inaccessible and there is no way to create content through the UI. The seed script creates this account so any developer can log in immediately after running the seed.

**Security rule:** These credentials must never be used in production. The production admin account is created via the setup script with a strong password set by the team lead.

---

### Primary Admin Account

| Field | Value |
|---|---|
| **Name** | Admin Seed |
| **Email** | `admin@recipeai.local` |
| **Password** | `SeedAdmin@2026!` |
| **Role** | `admin` |
| **Active** | `true` |
| **Created by** | Seed script |

**Login URL:** `http://localhost:3000/admin/login`

---

### Second Admin Account (for multi-user testing)

A second account is seeded to test admin user management UI — verifying that the user list shows multiple rows and that the "cannot delete own account" rule works when logged in as the primary account.

| Field | Value |
|---|---|
| **Name** | Editor Seed |
| **Email** | `editor@recipeai.local` |
| **Password** | `SeedEditor@2026!` |
| **Role** | `admin` |
| **Active** | `true` |
| **Created by** | Seed script |

---

## 7. Sample Nutrition Data

**Purpose:** Nutrition data is normally generated by the Claude API (`/api/ai/nutrition`). In development, the seed script pre-populates nutrition for three dishes so the `NutritionPanel` component can be tested without making real API calls.

All values are per serving (approximate, for demonstration only).

---

### Phở Bò Hà Nội (1 serving)

| Nutrient | Value | Unit |
|---|---|---|
| Calories | 420 | kcal |
| Protein | 28 | g |
| Carbohydrates | 48 | g |
| Fat | 12 | g |
| Fiber | 2 | g |

---

### Gỏi Gà Bắp Cải (1 serving)

| Nutrient | Value | Unit |
|---|---|---|
| Calories | 210 | kcal |
| Protein | 24 | g |
| Carbohydrates | 14 | g |
| Fat | 6 | g |
| Fiber | 4 | g |

---

### Đậu Hũ Sốt Cà Chua (1 serving)

| Nutrient | Value | Unit |
|---|---|---|
| Calories | 185 | kcal |
| Protein | 12 | g |
| Carbohydrates | 16 | g |
| Fat | 8 | g |
| Fiber | 3 | g |

---

## 8. Seed Data Summary

| Collection | Documents seeded | Purpose |
|---|---|---|
| `categories` | 10 | Taxonomy for all dishes; powers category filter and grid |
| `dishes` | 13 (12 published + 1 draft) | Primary content; covers all 3 diet types + 1 draft state |
| `recipes` | 8 | Multi-source display; tests RecipeCard and RecipeSourceBadge |
| `ingredients` | 28 | Autocomplete for IngredientTagInput; nutrition parsing base data |
| `recipeIngredients` | 15 (for Phở Bò recipe) | Tests RecipeIngredientList component |
| `banners` | 3 (2 active + 1 inactive) | Tests BannerCarousel visibility and admin status toggle |
| `users` | 2 | Admin panel access; multi-user management testing |
| `nutrition` (embedded) | 3 dishes | NutritionPanel display without real Claude API calls |

---

## 9. Seed Execution Order

Dependencies between collections mean the seed script must insert in this exact order:

```
1. categories          (no dependencies)
2. ingredients         (no dependencies)
3. users               (no dependencies)
4. dishes              (depends on: categories)
5. recipes             (depends on: dishes)
6. recipeIngredients   (depends on: recipes, ingredients)
7. banners             (no dependencies)
8. nutrition           (embedded on dishes — updated after dishes insert)
```

If the script is interrupted and re-run, the idempotency check (slug / email lookup before insert) ensures no duplicates are created.
