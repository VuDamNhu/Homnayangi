# Sitemap

## Overview

```
/
├── Public (user-facing — fully anonymous, no login required)
├── Admin (protected — admin login only)
└── API (headless)
```

---

## Public Routes

| Path | Page | Notes |
|---|---|---|
| `/` | Home | Featured dishes, category filter, random dish, banners |
| `/search` | Search Results | Query: `?q=pho` |
| `/random` | Random Dish | Redirects to random dish detail, or shows inline |
| `/categories` | All Categories | Grid of all active categories |
| `/categories/[slug]` | Category Detail | Dish grid filtered by category |
| `/dishes` | All Dishes | Browsable dish listing with filters |
| `/dishes/[slug]` | Dish Detail | Full dish page with recipes and restaurants |
| `/favorites` | My Favorites | localStorage-based — no login required |

---

## Admin Auth Routes

The public site has no login or registration pages. Only admins log in, via a dedicated path.

| Path | Page | Notes |
|---|---|---|
| `/admin/login` | Admin Login | Only entry point requiring authentication |
| `/admin/logout` | — | Server action / redirect, no UI page |

---

## Admin Routes

All routes under `/admin` require `role === 'ADMIN'`. Non-admins are redirected to `/admin/login`.

| Path | Page | Notes |
|---|---|---|
| `/admin` | — | Redirect to `/admin/dashboard` |
| `/admin/dashboard` | Dashboard | Stats, trending, recent activity |
| `/admin/dishes` | Dish List | Table with search, filter, sort, paginate |
| `/admin/dishes/new` | New Dish Form | Create a dish |
| `/admin/dishes/[id]` | Dish Detail (admin) | View + edit inline |
| `/admin/dishes/[id]/edit` | Edit Dish Form | Full edit form |
| `/admin/recipes` | Recipe List | Table filterable by dish |
| `/admin/recipes/new` | New Recipe Form | Create a recipe, select parent dish |
| `/admin/recipes/[id]/edit` | Edit Recipe Form | Edit recipe + ingredients + steps |
| `/admin/categories` | Category List | Drag-to-reorder list |
| `/admin/categories/new` | New Category Form | |
| `/admin/categories/[id]/edit` | Edit Category Form | |
| `/admin/ingredients` | Ingredient List | Searchable table |
| `/admin/ingredients/new` | New Ingredient Form | |
| `/admin/ingredients/[id]/edit` | Edit Ingredient Form | |
| `/admin/users` | Admin User List | Manage admin accounts |
| `/admin/users/[id]` | Admin User Detail | View and manage an admin account |
| `/admin/banners` | Banner List | Ordered list with toggle |
| `/admin/banners/new` | New Banner Form | |
| `/admin/banners/[id]/edit` | Edit Banner Form | |
| `/admin/analytics` | Analytics | Charts and tables |
| `/admin/seo` | SEO Overview | Pages with missing SEO fields |
| `/admin/settings` | Settings | Global site configuration |

---

## API Routes

All API routes are under `/api`. See [05-API_DESIGN.md](05-API_DESIGN.md) for full specification.

| Path | Methods | Auth |
|---|---|---|
| `/api/health` | GET | Public |
| `/api/dishes` | GET, POST | GET: public, POST: admin |
| `/api/dishes/random` | GET | Public |
| `/api/dishes/[slug]` | GET | Public |
| `/api/dishes/[id]` | PUT, DELETE | Admin |
| `/api/dishes/[id]/view` | POST | Public |
| `/api/recipes` | GET, POST | GET: public, POST: admin |
| `/api/recipes/[id]` | GET, PUT, DELETE | GET: public, others: admin |
| `/api/categories` | GET, POST | GET: public, POST: admin |
| `/api/categories/[slug]` | GET | Public |
| `/api/categories/[id]` | PUT, DELETE | Admin |
| `/api/ingredients` | GET, POST | GET: public, POST: admin |
| `/api/ingredients/[id]` | PUT, DELETE | Admin |
| `/api/search` | GET | Public |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth (admin only) |
| `/api/restaurants/nearby` | GET | Public |
| `/api/ai/nutrition` | POST | Admin |
| `/api/analytics/pageview` | POST | Public |
| `/api/analytics/summary` | GET | Admin |
| `/api/users` | GET | Admin |
| `/api/users/[id]` | GET, PUT | Admin |
| `/api/banners` | GET, POST | GET: public, POST: admin |
| `/api/banners/[id]` | PUT, DELETE | Admin |

---

## System Routes (Next.js)

| Path | Type | Description |
|---|---|---|
| `/sitemap.xml` | Generated | Dynamic sitemap of all public dishes and categories |
| `/robots.txt` | Generated | Allow public pages, disallow `/admin`, `/api` |

---

## Sitemap Priority Reference

For `sitemap.xml` generation:

| Route | Priority | Change Frequency |
|---|---|---|
| `/` | 1.0 | daily |
| `/categories` | 0.8 | weekly |
| `/categories/[slug]` | 0.8 | weekly |
| `/dishes` | 0.9 | daily |
| `/dishes/[slug]` | 0.9 | weekly |
| `/search` | 0.5 | monthly |

---

## URL Conventions

- All public paths use slugs, not database IDs: `/dishes/bun-bo-hue`
- All admin paths use database IDs: `/admin/dishes/66f3a...`
- Slugs are lowercase, hyphen-separated, URL-safe
- No trailing slashes
- Canonical URL always set (no `/dishes/bun-bo-hue/` variant)
