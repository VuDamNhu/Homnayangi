# Image Management Architecture — Recipe AI

All images are stored and served through **Cloudinary**. No images are stored in the project repository or on the application server.

---

## 1. Cloudinary Account Structure

| Setting | Value |
|---|---|
| Cloud name | `recipeai` |
| Environment | One cloud, two upload presets (`production`, `staging`) |
| Delivery base URL | `https://res.cloudinary.com/recipeai/image/upload/` |
| Upload method | Signed upload via server-side API route — never direct browser upload to Cloudinary |

The admin uploads an image through the CMS. The Next.js API route signs the upload request and sends it to Cloudinary. The public ID returned is stored in MongoDB. No raw binary is ever stored in the database.

---

## 2. Folder Organization

All assets are organized under a top-level environment prefix to keep production and staging assets completely separate.

```
recipeai/
├── production/
│   ├── dishes/
│   ├── recipes/
│   ├── banners/
│   └── avatars/
└── staging/
    ├── dishes/
    ├── recipes/
    ├── banners/
    └── avatars/
```

### Per-folder Purpose

| Folder | Contents |
|---|---|
| `dishes/` | Cover images for each dish — one primary image per dish |
| `recipes/` | Step or finished-dish photos attached to a specific recipe |
| `banners/` | Promotional banners shown on the home page |
| `avatars/` | Admin user profile photos |

---

## 3. Naming Strategy

Every public ID follows a deterministic, human-readable pattern. This makes it possible to reconstruct the Cloudinary URL from the database record without a separate lookup.

### Pattern

```
{env}/{type}/{identifier}_{purpose}
```

### Rules

| Segment | Rule |
|---|---|
| `env` | `production` or `staging` — always first |
| `type` | One of `dishes`, `recipes`, `banners`, `avatars` |
| `identifier` | The slug of the dish or category, or the MongoDB `_id` for records without a slug |
| `purpose` | Describes the image role within the record (see per-type rules below) |
| Characters | Lowercase, hyphens only — no spaces, no uppercase, no special characters |

### Per-type Examples

**Dish images**

```
production/dishes/pho-bo-ha-noi_cover
production/dishes/bun-bo-hue_cover
```

One cover image per dish. If a dish has multiple photos in the future, they use a numbered suffix:

```
production/dishes/pho-bo-ha-noi_gallery-1
production/dishes/pho-bo-ha-noi_gallery-2
```

**Recipe images**

Recipes do not have slugs; they use a short MongoDB ObjectId fragment paired with the dish slug:

```
production/recipes/pho-bo-ha-noi_6642f3a1_step-1
production/recipes/pho-bo-ha-noi_6642f3a1_step-2
production/recipes/pho-bo-ha-noi_6642f3a1_finished
```

**Banner images**

Banners use a sequential identifier managed by the admin:

```
production/banners/summer-sale_2026-06
production/banners/new-dishes_2026-07
```

**Avatar images**

Avatars use the admin user's slug (derived from their name):

```
production/avatars/nguyen-van-a
production/avatars/tran-thi-b
```

When an avatar is replaced, Cloudinary overwrites the same public ID (using the `overwrite: true` upload option). No old version accumulates.

---

## 4. Compression

All uploads are processed by Cloudinary at ingest time. No raw originals are served to end users.

### Upload Transformation Applied at Ingest

| Parameter | Value | Reason |
|---|---|---|
| `quality: auto` | Cloudinary-managed perceptual quality | Balances visual fidelity vs. file size automatically |
| `fetch_format: auto` | Serve WebP to supporting browsers, JPEG elsewhere | No manual format branching needed |
| `strip_metadata: true` | Remove EXIF, GPS, colour profile data | Reduces file size; removes privacy-sensitive data |
| `colorspace: srgb` | Normalise to sRGB | Consistent colour rendering across devices |

### Target File Sizes After Compression

| Image type | Dimensions | Target size |
|---|---|---|
| Dish cover | 1200 × 800 | < 150 KB |
| Dish OG variant | 1200 × 630 | < 120 KB |
| Recipe step photo | 800 × 600 | < 100 KB |
| Banner | 1440 × 480 | < 200 KB |
| Avatar | 200 × 200 | < 30 KB |

These are targets, not hard limits. Cloudinary's `quality: auto` will vary per image. The targets guide upload preset configuration.

---

## 5. Optimization

### 5.1 Named Transformations

Frequently used transformation combinations are saved as **named transformations** in Cloudinary. This keeps URLs short and allows global changes without touching the codebase.

| Named transformation | Applied size | Use case |
|---|---|---|
| `t_dish_card` | 600 × 400, crop: fill, gravity: auto | Dish cards in grids and listings |
| `t_dish_hero` | 1200 × 800, crop: fill, gravity: auto | Dish detail page hero |
| `t_dish_og` | 1200 × 630, crop: fill, gravity: center | Open Graph / social share image |
| `t_dish_thumb` | 120 × 80, crop: fill | Tiny thumbnails, admin lists |
| `t_recipe_step` | 800 × 600, crop: limit | Recipe step photos |
| `t_banner_full` | 1440 × 480, crop: fill, gravity: auto | Full-width home banner |
| `t_banner_mobile` | 768 × 400, crop: fill, gravity: auto | Mobile banner crop |
| `t_avatar` | 200 × 200, crop: fill, radius: max | Circular admin avatar |

`gravity: auto` uses Cloudinary's AI-based focal point detection, which avoids cropping the subject out of the frame.

### 5.2 Lazy Loading

All images on the public site use the `loading="lazy"` attribute via Next.js `<Image>`. The hero image on the dish detail page uses `loading="eager"` + `fetchpriority="high"` as it is the Largest Contentful Paint element.

### 5.3 CDN Caching

Cloudinary serves all images through its global CDN. Cache headers are set by Cloudinary:

| Asset type | `Cache-Control` |
|---|---|
| All image variants | `public, max-age=31536000, immutable` |

Because the public ID encodes the content intent and version changes result in a new public ID or overwrite, long-lived caching is safe.

### 5.4 Blur Placeholder

Dish cover images display a low-quality placeholder while the full image loads. A 20px-wide blurred variant is generated at upload time:

```
production/dishes/pho-bo-ha-noi_cover → w_20,e_blur:400
```

The base64 data URI of this tiny image is stored in MongoDB alongside the public ID and used as the `blurDataURL` prop in Next.js `<Image>`.

---

## 6. Responsive Images

Next.js `<Image>` generates a `srcset` automatically. The Cloudinary URL is set as the `src`. A custom Cloudinary loader is configured in `next.config.ts` so that Next.js passes width values directly to Cloudinary's `w_` parameter.

### Cloudinary Loader Behaviour

When Next.js requests a 600 px variant, the loader builds:

```
https://res.cloudinary.com/recipeai/image/upload/w_600,f_auto,q_auto/production/dishes/pho-bo-ha-noi_cover
```

When it requests an 1200 px variant:

```
https://res.cloudinary.com/recipeai/image/upload/w_1200,f_auto,q_auto/production/dishes/pho-bo-ha-noi_cover
```

Cloudinary generates and caches each width variant on first request. Subsequent requests are served from the CDN.

### `sizes` Values Per Component

| Component | `sizes` attribute |
|---|---|
| Dish card (3-column grid) | `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw` |
| Dish card (2-column grid) | `(max-width: 640px) 100vw, 50vw` |
| Dish detail hero | `100vw` |
| Category card | `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw` |
| Banner (full-width) | `100vw` |
| Recipe step photo | `(max-width: 640px) 100vw, 50vw` |
| Admin thumbnail | `120px` |
| Avatar | `40px` |

### Breakpoint Widths Generated

Based on the `sizes` values above, Next.js requests these widths from Cloudinary: `120, 256, 384, 640, 750, 828, 1080, 1200, 1920`.

Cloudinary generates and caches each on first request. No pre-warming needed.

---

## 7. Upload Flow

```
Admin (browser)
  │
  ▼
POST /api/upload (Next.js route handler)
  │  Validates session (admin only)
  │  Validates file type (JPEG, PNG, WebP only)
  │  Validates file size (max 10 MB raw)
  │  Signs the upload with Cloudinary SDK
  │
  ▼
Cloudinary API (direct upload from server)
  │  Applies ingest transformations
  │  Generates blur placeholder variant
  │  Returns public_id + secure_url + metadata
  │
  ▼
POST /api/upload returns { publicId, url, blurDataUrl }
  │
  ▼
Admin CMS form stores publicId + blurDataUrl in MongoDB document
```

The raw file is not held in memory longer than the upload request. Cloudinary is the system of record for all image binaries.

### Accepted Upload Types

| Format | Accepted | Notes |
|---|---|---|
| JPEG | Yes | Most common from camera uploads |
| PNG | Yes | Accepted; converted to WebP for delivery |
| WebP | Yes | Passed through |
| GIF | No | Not needed; no animated content |
| SVG | No | Inline SVG used for icons instead |
| HEIC | No | Admin must convert before uploading |

---

## 8. Deletion

When an image is replaced or a dish is deleted in the CMS:

1. The admin triggers deletion from the CMS
2. The Next.js API route calls the Cloudinary Admin API (`destroy` method) with the stored `publicId`
3. Cloudinary purges the asset and all its cached variants from the CDN
4. The `publicId` field is cleared from the MongoDB document

Orphaned images (publicId in Cloudinary with no matching MongoDB document) are detected by a monthly reconciliation script in `scripts/` that compares MongoDB records against the Cloudinary folder listing.

---

## 9. Environment Variables

| Variable | Used by |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Server — Cloudinary SDK config |
| `CLOUDINARY_API_KEY` | Server — signed upload + Admin API |
| `CLOUDINARY_API_SECRET` | Server — signed upload + Admin API |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Client — Cloudinary loader URL construction |

`CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are server-only. They must never appear in client bundles.

---

## 10. Summary

| Concern | Decision |
|---|---|
| Storage | Cloudinary — no local or S3 storage |
| Upload | Signed server-side — never direct browser-to-Cloudinary |
| Format | Auto (`f_auto`) — WebP where supported, JPEG fallback |
| Quality | Auto (`q_auto`) — perceptual, not fixed percentage |
| Cropping | Named transformations with `gravity: auto` |
| Responsive | Next.js `<Image>` + custom Cloudinary loader + `sizes` per component |
| Placeholder | Tiny blur variant stored as `blurDataUrl` in MongoDB |
| Caching | Cloudinary CDN — 1-year immutable cache |
| Deletion | Via Admin API on CMS delete action |
| Naming | `{env}/{type}/{slug}_{purpose}` |
