# Roles & Permissions — Recipe AI

## Role Definitions

| Role | Auth Required | How Obtained |
|---|---|---|
| `GUEST` | No | Implicit — every visitor without a session |
| `ADMIN` | Yes | Account created via setup script; login at `/admin/login` |

There is no public registration. There is no user account system for visitors. The only login form in the entire app is `/admin/login`.

---

## GUEST

Any person who opens the site in a browser. No session, no cookie, no account.

### Accessible Pages

| Page | Path |
|---|---|
| Home | `/` |
| Dish detail | `/dishes/[slug]` |
| Category listing | `/categories/[slug]` |
| Search results | `/search` |
| Random dish redirect | `/random` |
| Favorites list | `/favorites` |

### Allowed Actions

| Action | Mechanism |
|---|---|
| View any published dish | Public read — no auth check |
| View any published category | Public read — no auth check |
| View all recipes for a dish | Public read — no auth check |
| View nutritional data | Public read — no auth check |
| Search dishes by keyword | Public read — no auth check |
| Get a random dish | Public read — weighted random, respects diet mode |
| Select diet mode (Normal / Vegetarian / Diet) | Client-side state — no server call |
| Save a dish to favorites | Written to `localStorage` — no server call |
| Remove a dish from favorites | Removed from `localStorage` — no server call |
| View nearby restaurants | Reads geolocation (browser prompt) + Google Maps — no auth |

### Restricted Actions

| Action | Reason |
|---|---|
| Access any `/admin/*` page | Requires `ADMIN` session — redirected to `/admin/login` |
| Create, edit, or delete any dish | Write operations — admin only |
| Create, edit, or delete any recipe | Write operations — admin only |
| Create, edit, or delete any category | Write operations — admin only |
| Create, edit, or delete any ingredient | Write operations — admin only |
| Manage banners | Admin only |
| View analytics data | Admin only |
| View or manage admin user accounts | Admin only |
| Trigger AI nutrition parsing | Server-side AI call — admin only |
| Trigger recipe crawler | Admin only |
| Change site settings | Admin only |

---

## ADMIN

An authenticated user with a verified session. Created by a setup script — not self-registered.

### Accessible Pages

All `GUEST` pages, plus:

| Page | Path |
|---|---|
| Admin login | `/admin/login` |
| Admin dashboard | `/admin/dashboard` |
| Dish list | `/admin/dishes` |
| New dish | `/admin/dishes/new` |
| Edit dish | `/admin/dishes/[id]` |
| Recipe list | `/admin/recipes` |
| New recipe | `/admin/recipes/new` |
| Edit recipe | `/admin/recipes/[id]` |
| Category list | `/admin/categories` |
| Edit category | `/admin/categories/[id]` |
| Ingredient list | `/admin/ingredients` |
| Edit ingredient | `/admin/ingredients/[id]` |
| Banner list | `/admin/banners` |
| User list | `/admin/users` |
| Analytics | `/admin/analytics` |
| SEO settings | `/admin/seo` |
| Site settings | `/admin/settings` |

### Allowed Actions

**Content management**

| Action | Scope |
|---|---|
| Create a dish | All fields including slug, diet type, category, cover image |
| Edit a dish | All fields |
| Publish / unpublish a dish | Toggle published status |
| Delete a dish | Soft delete preferred |
| Create a recipe | Link to a dish, set source, add ingredients |
| Edit a recipe | All fields |
| Delete a recipe | Permanent |
| Create a category | Name, slug, cover image, display order |
| Edit a category | All fields |
| Delete a category | Blocked if dishes are assigned |
| Create an ingredient | Name, unit, nutritional values |
| Edit an ingredient | All fields |
| Merge duplicate ingredients | Reassigns references then deletes duplicate |
| Delete an ingredient | Blocked if in use by any recipe |
| Create a banner | Image, link, date range, display order |
| Edit a banner | All fields |
| Activate / deactivate a banner | Toggle status |
| Delete a banner | Permanent |

**AI features**

| Action | Scope |
|---|---|
| Trigger nutrition parsing | Sends ingredient text to Claude API; saves result to recipe |
| Generate dish description | Sends dish metadata to Claude API; result editable before saving |
| Review and approve crawler imports | Queued items only; cannot publish without review |

**User management**

| Action | Scope |
|---|---|
| Create an admin user | Name, email, password, role |
| Edit an admin user | All fields except own role |
| Deactivate an admin user | Blocks login without deleting |
| Delete an admin user | Cannot delete own account |
| Change any admin password | Including own |

**Analytics & SEO**

| Action | Scope |
|---|---|
| View all analytics data | Page views, search terms, popular dishes |
| Edit global SEO meta | Title template, default description, OG image |
| Override per-dish or per-category meta | Title, description, OG image |

**Settings**

| Action | Scope |
|---|---|
| Toggle maintenance mode | Site-wide |
| Adjust random dish weights | Normal / Vegetarian / Diet percentages |
| Set featured categories | Shown on home page |

### Restricted Actions

| Action | Reason |
|---|---|
| Register a new admin via public form | No public registration exists — setup script only |
| Delete own admin account | Prevented to avoid accidental lockout |
| Publish crawler imports without review | All imports go through a review queue first |
| Modify another admin's role to super-admin | Single-role system — all admins are equal |

---

## Enforcement Points

Permissions are enforced at three layers. All three must hold.

| Layer | Mechanism | Protects |
|---|---|---|
| Route level | Next.js Middleware checks `getServerSession()` on every `/admin/*` request and redirects unauthenticated users to `/admin/login` | Admin pages |
| API level | Every `/api/` route handler that performs a write or returns sensitive data calls `getServerSession()` and returns `401` if no valid session | API endpoints |
| UI level | Admin-only UI elements (edit buttons, delete dialogs) are never rendered in the public site — they exist only inside `(admin)` route group components | Presentation |

UI enforcement is convenience only. The route and API layers are the real security boundary.

---

## Summary Matrix

| Action | GUEST | ADMIN |
|---|---|---|
| Browse published dishes | Yes | Yes |
| Browse categories | Yes | Yes |
| Search dishes | Yes | Yes |
| Get random dish | Yes | Yes |
| View nutrition data | Yes | Yes |
| View nearby restaurants | Yes | Yes |
| Save favorites (localStorage) | Yes | Yes |
| Access `/admin/*` pages | No | Yes |
| Create / edit / delete dishes | No | Yes |
| Create / edit / delete recipes | No | Yes |
| Create / edit / delete categories | No | Yes |
| Create / edit / delete ingredients | No | Yes |
| Manage banners | No | Yes |
| Manage admin users | No | Yes |
| View analytics | No | Yes |
| Manage SEO settings | No | Yes |
| Trigger AI features | No | Yes |
| Change site settings | No | Yes |
