# Product Requirements Document (PRD)

## 1. Overview

**Product Name:** Recipe AI (working title)

**One-liner:** A dish-first recipe discovery platform that helps users answer "What should I eat today?"

**Version:** 1.0

**Date:** 2026-06-12

---

## 2. Problem Statement

Existing recipe platforms are recipe-first: users must already know what they want to cook. This fails the most common use case — the user who does not know what to eat and wants inspiration.

Current pain points:

- Recipe sites overwhelm users with too many options and no decision support.
- Searching for "What to eat" yields generic blog posts, not actionable suggestions.
- Nutrition information is inconsistent or missing across recipe sources.
- Users cannot easily compare multiple versions of the same dish.
- There is no single place that combines dish discovery, multi-source recipes, nutrition data, and restaurant alternatives.

---

## 3. Product Vision

Help users decide what to eat by surfacing dishes — not recipes — as the primary unit of discovery.

A user who wants Bun Bo Hue should find:

- What it is (image, description, nutrition)
- How to cook it (multiple recipe versions from different sources)
- Where to eat it nearby (restaurant recommendations)

Recipes exist to support the dish, not the other way around.

---

## 4. Goals

### Business Goals

- Reach 10,000 monthly visitors within the first year.
- Achieve average session duration > 3 minutes.
- Maintain a Lighthouse performance score ≥ 90 on mobile.
- Build a content library of 500+ dishes and 1,500+ recipes by launch.

### User Goals

- Quickly decide what to eat with minimal friction.
- Discover new dishes outside their comfort zone.
- Access reliable, standardized nutrition information.
- Save and revisit dishes and recipes they like (locally, no account required).

### Admin Goals

- Easily manage content (dishes, recipes, ingredients) without technical knowledge.
- Monitor platform health via a real-time dashboard.
- Automate nutrition estimation using AI.

---

## 5. User Personas

### Persona 1 — The Undecided Eater (Primary)

**Name:** Minh, 28, office worker

**Context:** Comes home after work, opens the app, has no idea what to cook.

**Goals:**
- Get a dish suggestion fast.
- See if it is easy enough to cook on a weeknight.
- Find the recipe with the simplest ingredient list.

**Frustrations:**
- Scrolling through endless recipe blogs.
- Recipes with missing nutrition info.
- Inconsistent ingredient measurements.

---

### Persona 2 — The Health-Conscious Cook

**Name:** Linh, 32, fitness enthusiast

**Context:** Tracks macros, eats primarily vegetarian or diet dishes.

**Goals:**
- Filter dishes by dietary type (vegetarian, diet).
- See exact protein, fat, and carb values.
- Compare nutrition across recipe versions.

**Frustrations:**
- Recipe sites that ignore nutrition.
- Diet-labeled dishes that are actually high-calorie.

---

### Persona 3 — The Restaurant Finder

**Name:** Nam, 25, food explorer

**Context:** Wants to try a dish but does not want to cook.

**Goals:**
- Discover a dish, then immediately find nearby restaurants that serve it.
- See ratings, distance, and opening hours at a glance.

**Frustrations:**
- Having to switch between apps to find restaurants after discovering a dish.

---

### Persona 4 — The Content Admin

**Name:** Admin user managing the platform.

**Goals:**
- Add and edit dishes and recipes quickly.
- Use AI to fill in nutrition data automatically.
- Monitor what dishes are trending.

---

## 6. Features — User-Facing

### Priority: Must Have (v1.0)

| # | Feature | Description |
|---|---|---|
| U1 | Browse dishes | View dishes organized by category |
| U2 | Dish detail | See image, nutrition, cooking time, description, and multiple recipes |
| U3 | Random dish | Get a random dish suggestion with one click |
| U4 | Search | Search dishes by name |
| U5 | Recipe detail | View ingredients, step-by-step instructions, and YouTube video |
| U6 | Category filter | Filter by Normal, Vegetarian, or Diet |
| U7 | Nutrition display | Calories, protein, fat, carbs per serving |
| U8 | Favorites | Save dishes and recipes locally (localStorage, no account required) |
| U9 | Nearby restaurants | See restaurants serving the current dish (Google Maps) |

### Priority: Should Have (v1.1)

| # | Feature | Description |
|---|---|---|
| U11 | View history | See recently viewed dishes |
| U12 | Search history | See and clear recent searches |
| U13 | Recipe comparison | Side-by-side nutrition comparison across recipes |
| U14 | Social sharing | Share dish page to social media |

### Priority: Nice to Have (v2.0)

| # | Feature | Description |
|---|---|---|
| U15 | Meal planning | Plan dishes for the week |
| U16 | Shopping list | Auto-generate shopping list from selected recipes |
| U17 | User reviews | Rate and review recipes |
| U18 | Cook mode | Step-by-step display optimized for hands-free cooking |

---

## 7. Features — Admin

### Priority: Must Have (v1.0)

| # | Feature | Description |
|---|---|---|
| A1 | Dashboard | Overview stats and trending content |
| A2 | Dish CRUD | Create, read, update, soft-delete dishes |
| A3 | Recipe CRUD | Create, read, update, soft-delete recipes |
| A4 | Category CRUD | Manage dish categories |
| A5 | Ingredient CRUD | Manage ingredient library with nutrition per 100g |
| A6 | AI nutrition | Auto-estimate nutrition from ingredient list |
| A7 | Banner management | Manage homepage promotional banners |

### Priority: Should Have (v1.1)

| # | Feature | Description |
|---|---|---|
| A9 | Analytics | Views, searches, trending dishes over time |
| A10 | SEO management | Edit meta title, description, slug per dish/category |

### Priority: Nice to Have (v2.0)

| # | Feature | Description |
|---|---|---|
| A11 | Recipe crawler | Automated recipe import from external sources |
| A12 | Bulk import | Import dishes/recipes via CSV |

---

## 8. Non-Functional Requirements

### Performance

- Time to First Byte (TTFB): < 200ms on cached pages.
- Largest Contentful Paint (LCP): < 2.5s on mobile (3G).
- Lighthouse score: ≥ 90 on Performance, Accessibility, Best Practices, SEO.
- API response time: < 300ms (p95) for all read endpoints.

### Availability

- Target uptime: 99.9% (Vercel SLA).
- MongoDB Atlas: automatic failover with replica set.

### Scalability

- Support 10,000 monthly visitors (no user accounts on public site).
- Support 100 concurrent visitors at peak without degradation.
- Content library: up to 10,000 dishes, 50,000 recipes.

### Security

- Admin passwords hashed with bcrypt (cost factor 12).
- HttpOnly, Secure, SameSite=Strict session cookies for admin session.
- All admin API routes require `role === 'ADMIN'` check.
- Public API routes are read-only — no write operations exposed to the public.
- Input sanitized on all write endpoints.
- Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options.
- Google Maps API key: server-side only.
- Claude API key: server-side only.

### SEO

- All public pages have unique `<title>` and `<meta description>`.
- Dynamic sitemap.xml generated from database content.
- JSON-LD structured data on dish detail pages.
- Canonical URLs on all pages.
- Core Web Vitals in "Good" range.

### Accessibility

- WCAG 2.1 AA compliance target.
- Keyboard navigable.
- Screen reader friendly (semantic HTML, ARIA labels).
- Minimum contrast ratio 4.5:1 for body text.

---

## 9. Out of Scope (v1.0)

- Native mobile app (iOS / Android).
- User registration and login (public site is fully anonymous).
- User-submitted recipes (UGC moderation pipeline).
- Live video cooking tutorials.
- E-commerce / ingredient purchasing.
- Multi-language support (Vietnamese and English only).
- Social features (following other users, comments).
- Real-time notifications.
- Offline support (PWA).

---

## 10. Success Metrics

| Metric | Target (3 months post-launch) |
|---|---|
| Monthly visitors | 5,000 |
| Average session duration | > 3 min |
| Dishes in library | 500+ |
| Recipes in library | 1,500+ |
| Bounce rate | < 40% |
| Lighthouse score (mobile) | ≥ 90 |
| API error rate | < 0.5% |

---

## 11. Assumptions and Risks

| Item | Description |
|---|---|
| Assumption | Users are comfortable browsing in English; Vietnamese names used for dishes. |
| Assumption | Google Maps Places API quota is sufficient for free tier during early growth. |
| Risk | Claude API costs may become significant if nutrition estimation is heavily used. Mitigated by admin-only rate limiting. |
| Risk | Recipe crawler may break if source sites change their HTML structure. Mitigated by manual fallback. |
| Risk | Google Maps API key abuse. Mitigated by server-side proxy — key never exposed to client. |
