# SEO Architecture — Recipe AI

---

## 1. URL Structure

Clean, human-readable, keyword-rich URLs. No query strings for indexable content. No trailing slashes.

| Page | URL Pattern | Example |
|---|---|---|
| Home | `/` | `https://recipeai.vn/` |
| Category | `/categories/[slug]` | `/categories/mon-canh` |
| Dish detail | `/dishes/[slug]` | `/dishes/pho-bo-ha-noi` |
| Search | `/search?q=[query]` | `/search?q=canh+chua` |
| Random dish | `/random` | `/random` |
| Favorites | `/favorites` | `/favorites` |

### URL Design Rules

- All slugs are lowercase, hyphen-separated, ASCII-safe (Vietnamese diacritics removed and transliterated)
- Slugs are derived from the Vietnamese name: `Phở Bò Hà Nội` → `pho-bo-ha-noi`
- No numeric IDs in public URLs — slugs are the only public identifier
- `/search` is indexed but individual query strings (`?q=...`) are not — `<meta name="robots" content="noindex">` on search result pages
- `/random` is `noindex` — it redirects and has no stable content
- `/favorites` is `noindex` — client-rendered from localStorage, no server content

---

## 2. Slug Strategy

Slugs are the canonical identifier for dishes and categories on the public site.

### Generation Rules

| Step | Rule |
|---|---|
| 1. Transliterate | Convert Vietnamese characters to ASCII equivalents (`ở` → `o`, `ắ` → `a`) |
| 2. Lowercase | Convert entire string to lowercase |
| 3. Hyphenate | Replace spaces and special characters with `-` |
| 4. Deduplicate hyphens | Collapse `--` into `-` |
| 5. Trim | Strip leading and trailing hyphens |
| 6. Uniqueness check | If slug already exists, append `-2`, `-3`, etc. |

### Slug Examples

| Original name | Generated slug |
|---|---|
| Phở Bò Hà Nội | `pho-bo-ha-noi` |
| Bún Bò Huế | `bun-bo-hue` |
| Cơm Tấm Sườn Bì Chả | `com-tam-suon-bi-cha` |
| Canh Chua Cá Lóc | `canh-chua-ca-loc` |
| Món Canh | `mon-canh` |

### Slug Stability

- A slug is set at creation time and is **immutable** once published.
- If a dish is renamed, the slug does not change. Only an admin can manually update the slug, which triggers a 301 redirect from the old slug.
- Old slugs are stored in a `previousSlugs[]` field on the Dish document. The route handler checks this array and issues a permanent redirect if the current slug is not found.

---

## 3. Metadata

All metadata is generated server-side via the Next.js 15 `generateMetadata()` function. No client-side meta injection.

### 3.1 Home Page

| Tag | Value |
|---|---|
| `<title>` | `Recipe AI — Hôm nay ăn gì?` |
| `<meta name="description">` | `Khám phá hàng nghìn món ăn ngon mỗi ngày. Gợi ý ngẫu nhiên, công thức từ nhiều nguồn, dành cho mọi khẩu vị.` |
| `<meta name="robots">` | `index, follow` |
| Canonical | `https://recipeai.vn/` |

### 3.2 Category Page

| Tag | Value |
|---|---|
| `<title>` | `[Category Name] — Công thức & Món ăn | Recipe AI` |
| `<meta name="description">` | `Khám phá [N] món ăn trong danh mục [Category Name]. Tìm công thức nấu ăn ngon, dễ làm từ nhiều nguồn.` |
| `<meta name="robots">` | `index, follow` |
| Canonical | `https://recipeai.vn/categories/[slug]` |

### 3.3 Dish Detail Page

The highest-priority page for SEO. Each dish is a standalone indexable document.

| Tag | Value |
|---|---|
| `<title>` | `[Dish Name] — Cách nấu & Công thức | Recipe AI` |
| `<meta name="description">` | `Học cách nấu [Dish Name] với [N] công thức từ [sources]. [First sentence of dish description].` |
| `<meta name="robots">` | `index, follow` |
| Canonical | `https://recipeai.vn/dishes/[slug]` |
| `<meta name="keywords">` | Dish name + category name + `công thức`, `cách nấu`, `nguyên liệu` |

Admins can override the auto-generated title and description per dish from the SEO management panel.

### 3.4 Search Page

| Tag | Value |
|---|---|
| `<title>` | `Tìm kiếm: "[query]" | Recipe AI` |
| `<meta name="description">` | `[N] kết quả cho "[query]". Khám phá công thức và món ăn phù hợp.` |
| `<meta name="robots">` | `noindex, follow` |
| Canonical | — (not set; page is noindex) |

Search pages are excluded from the index to prevent thin or duplicate content from query variations.

### 3.5 Random Dish Page

| Tag | Value |
|---|---|
| `<meta name="robots">` | `noindex, nofollow` |
| Canonical | — (not set) |

`/random` performs a server-side redirect to a dish page. It has no stable content and must not be indexed.

### 3.6 Favorites Page

| Tag | Value |
|---|---|
| `<title>` | `Món ăn yêu thích | Recipe AI` |
| `<meta name="robots">` | `noindex, nofollow` |
| Canonical | — (not set) |

Content is entirely client-rendered from `localStorage`. No server content means no indexable content.

### 3.7 Ingredient Suggestion (AI)

Ingredient suggestion is a UI interaction on the dish detail page, not a standalone URL. It does not have its own metadata. The parent dish page's metadata covers it.

---

## 4. Canonical URLs

Every indexable page declares a self-referencing canonical URL to prevent duplicate indexing from query parameters, session tokens, or UTM parameters.

### Rules

| Condition | Canonical behavior |
|---|---|
| Normal page load | Self-referencing canonical: the clean URL without query params |
| Old slug (dish renamed) | Redirect 301 to new slug; new slug page has its own canonical |
| Category page with pagination | Each page (`?page=2`) gets a canonical pointing to itself, not to page 1 |
| Search results | No canonical — page is `noindex` |
| `/random` | No canonical — page is `noindex, nofollow` |
| `/favorites` | No canonical — page is `noindex, nofollow` |

### Implementation

Next.js `generateMetadata()` returns the `alternates.canonical` field set to the absolute URL. The framework injects `<link rel="canonical" href="...">` automatically.

---

## 5. Sitemap

A machine-generated XML sitemap is served at `/sitemap.xml`. It is split into multiple sitemaps for manageability.

### Sitemap Index (`/sitemap.xml`)

The root sitemap is an index file pointing to sub-sitemaps:

| Sub-sitemap | Path | Contents |
|---|---|---|
| Static pages | `/sitemap-static.xml` | Home, category index |
| Categories | `/sitemap-categories.xml` | All published category pages |
| Dishes | `/sitemap-dishes.xml` | All published dish pages |

### Per-page Priority & Change Frequency

| Page type | `<priority>` | `<changefreq>` |
|---|---|---|
| Home | `1.0` | `daily` |
| Category pages | `0.8` | `weekly` |
| Dish detail pages | `0.9` | `weekly` |
| Static pages (about, etc.) | `0.5` | `monthly` |

### Exclusions

The following paths are explicitly excluded from the sitemap:

| Excluded path | Reason |
|---|---|
| `/search*` | `noindex` — thin/variable content |
| `/random` | `noindex` — redirect only |
| `/favorites` | `noindex` — client-rendered, no server content |
| `/admin/*` | Private — must never appear in the sitemap |
| Unpublished dishes | Draft content — not public |

### Generation

- Dishes sitemap is generated dynamically via a Next.js Route Handler (`app/sitemap.ts` or `app/sitemap-dishes.xml/route.ts`)
- The sitemap reads only published dishes from MongoDB — draft dishes are excluded
- `<lastmod>` is set from the `updatedAt` field on each document
- Sitemap URL is submitted to Google Search Console and declared in `robots.txt`

---

## 6. Open Graph

Open Graph tags enable rich previews when a URL is shared on social platforms (Facebook, Zalo, Telegram, iMessage).

### 6.1 Home Page

| Property | Value |
|---|---|
| `og:title` | `Recipe AI — Hôm nay ăn gì?` |
| `og:description` | `Khám phá hàng nghìn món ăn ngon. Gợi ý ngẫu nhiên, công thức từ nhiều nguồn.` |
| `og:image` | `https://recipeai.vn/og/default.jpg` (1200×630) |
| `og:url` | `https://recipeai.vn/` |
| `og:type` | `website` |
| `og:locale` | `vi_VN` |
| `og:site_name` | `Recipe AI` |

### 6.2 Category Page

| Property | Value |
|---|---|
| `og:title` | `[Category Name] — Recipe AI` |
| `og:description` | `Khám phá [N] món ăn trong danh mục [Category Name].` |
| `og:image` | Category cover image (1200×630), fallback to default OG image |
| `og:url` | `https://recipeai.vn/categories/[slug]` |
| `og:type` | `website` |

### 6.3 Dish Detail Page

| Property | Value |
|---|---|
| `og:title` | `[Dish Name] — Cách nấu & Công thức` |
| `og:description` | First 160 characters of the dish description |
| `og:image` | Dish cover image (1200×630), fallback to default OG image |
| `og:url` | `https://recipeai.vn/dishes/[slug]` |
| `og:type` | `article` |
| `article:section` | Category name |
| `article:modified_time` | ISO 8601 timestamp from `updatedAt` |

### 6.4 Twitter / X Card

All pages also include Twitter Card meta as a fallback for platforms that prefer it over Open Graph.

| Property | Value |
|---|---|
| `twitter:card` | `summary_large_image` |
| `twitter:title` | Same as `og:title` |
| `twitter:description` | Same as `og:description` |
| `twitter:image` | Same as `og:image` |

### OG Image Specifications

| Requirement | Spec |
|---|---|
| Dimensions | 1200 × 630 px |
| Format | JPEG or WebP |
| Max file size | 300 KB |
| Safe zone | Keep key content within the centre 1000 × 500 px |
| Default fallback | `/public/og/default.jpg` — used when a dish or category has no cover image |

Dish and category cover images are stored with a 16:9 crop. At upload time, a 1200×630 variant is generated and stored for OG use.

---

## 7. `robots.txt`

```
User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /random
Disallow: /favorites
Disallow: /search

Sitemap: https://recipeai.vn/sitemap.xml
```

---

## 8. Structured Data (JSON-LD)

Rich result markup injected as `<script type="application/ld+json">` on key pages.

| Page | Schema type | Benefit |
|---|---|---|
| Home | `WebSite` + `SearchAction` | Enables Google Sitelinks Search Box |
| Category | `ItemList` | Enables rich category listing in results |
| Dish detail | `Recipe` | Enables recipe rich result (image, cook time, nutrition, rating) |

### Dish Detail `Recipe` Schema Fields

| Field | Source |
|---|---|
| `name` | `dish.name` |
| `description` | `dish.description` |
| `image` | `dish.coverImage` |
| `recipeCategory` | `dish.category.name` |
| `nutrition` | `dish.nutrition` (from AI parsing) |
| `recipeIngredient` | Ingredient list from the primary recipe |
| `recipeInstructions` | Steps from the primary recipe |
| `datePublished` | `dish.createdAt` |
| `dateModified` | `dish.updatedAt` |

---

## 9. Page-by-Page SEO Summary

| Page | Indexed | Canonical | OG Image | Sitemap | Structured Data |
|---|---|---|---|---|---|
| Home | Yes | Self | Default OG | Yes | `WebSite` + `SearchAction` |
| Category | Yes | Self | Category cover | Yes | `ItemList` |
| Dish detail | Yes | Self (or redirect from old slug) | Dish cover | Yes | `Recipe` |
| Search | No | — | — | No | — |
| Random | No | — | — | No | — |
| Favorites | No | — | — | No | — |
