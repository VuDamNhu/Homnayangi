# UI Guideline

## Design Philosophy

- **Dish-first visual hierarchy.** The dish image and name are always the hero. Nutrition and recipes are supporting.
- **Fast decisions.** Reduce cognitive load. The user should be able to pick a dish in under 10 seconds.
- **Warm and appetizing.** Colors and imagery should make food feel inviting, not clinical.
- **Mobile-first.** Design for phone first, scale up to desktop.
- **Accessible by default.** Contrast ratios, keyboard navigation, and screen reader support are requirements, not afterthoughts.

---

## Color Palette

Built on Tailwind CSS color tokens. The brand uses warm amber as the primary accent.

### Brand Colors

| Role | Tailwind Token | Hex | Usage |
|---|---|---|---|
| Primary | `amber-500` | `#F59E0B` | Primary buttons, active states, highlights |
| Primary dark | `amber-600` | `#D97706` | Button hover, pressed states |
| Primary light | `amber-100` | `#FEF3C7` | Tinted backgrounds, selected tags |
| Accent | `orange-500` | `#F97316` | Secondary CTAs, badges |

### Neutral Colors

| Role | Tailwind Token | Hex | Usage |
|---|---|---|---|
| Background | `white` / `zinc-50` | `#FAFAFA` | Page background |
| Surface | `white` | `#FFFFFF` | Cards, modals, panels |
| Border | `zinc-200` | `#E4E4E7` | Dividers, card borders |
| Text primary | `zinc-900` | `#18181B` | Headings, body text |
| Text secondary | `zinc-500` | `#71717A` | Subtitles, labels, meta |
| Text disabled | `zinc-400` | `#A1A1AA` | Placeholder, disabled |

### Semantic Colors

| Role | Tailwind Token | Hex | Usage |
|---|---|---|---|
| Success | `green-500` | `#22C55E` | "Open now", positive feedback |
| Warning | `yellow-500` | `#EAB308` | Medium confidence, caution |
| Error | `red-500` | `#EF4444` | Form errors, destructive actions |
| Info | `blue-500` | `#3B82F6` | Informational badges |

### Dark Mode (Future)

Tailwind dark mode class strategy (`class` strategy). Use `dark:` variants. Not required for v1.0 but palette is designed to support it.

---

## Typography

Font stack using Next.js `next/font` with Google Fonts.

### Fonts

| Role | Font | Tailwind Class | Usage |
|---|---|---|---|
| Heading | `Playfair Display` | custom via CSS var | Page titles, dish names |
| Body | `Inter` | `font-sans` | All body text, UI labels |
| Monospace | `JetBrains Mono` | `font-mono` | Code, nutrition numbers |

### Type Scale

| Level | Class | Size | Weight | Usage |
|---|---|---|---|---|
| Display | `text-5xl font-bold` | 48px | 700 | Hero headlines |
| H1 | `text-4xl font-bold` | 36px | 700 | Page titles |
| H2 | `text-2xl font-semibold` | 24px | 600 | Section headings |
| H3 | `text-xl font-semibold` | 20px | 600 | Card titles |
| H4 | `text-lg font-medium` | 18px | 500 | Sub-sections |
| Body large | `text-base` | 16px | 400 | Primary body text |
| Body | `text-sm` | 14px | 400 | Secondary text, labels |
| Caption | `text-xs` | 12px | 400 | Metadata, timestamps |

### Line Heights

Default Tailwind line heights. Body text uses `leading-relaxed` (1.625) for readability.

---

## Spacing

Use Tailwind's default spacing scale (4px base unit). Avoid arbitrary values — prefer nearest scale token.

| Token | px | Common Usage |
|---|---|---|
| `p-2` / `gap-2` | 8px | Tight inner padding |
| `p-4` / `gap-4` | 16px | Standard card padding |
| `p-6` / `gap-6` | 24px | Section padding |
| `p-8` / `gap-8` | 32px | Large section padding |
| `p-12` | 48px | Hero padding |
| `p-16` | 64px | Page-level vertical padding |

---

## Breakpoints

Using Tailwind's default responsive breakpoints (mobile-first):

| Breakpoint | Min Width | Target Device |
|---|---|---|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large monitors |

### Grid Columns by Breakpoint

| Context | Mobile | sm | md | lg | xl |
|---|---|---|---|---|---|
| Dish grid | 1 col | 2 cols | 2 cols | 3 cols | 4 cols |
| Category grid | 2 cols | 2 cols | 3 cols | 4 cols | 5 cols |
| Recipe list | 1 col | 1 col | 2 cols | 2 cols | 3 cols |
| Admin tables | full width | — | — | — | — |

---

## Component Guidelines

### Button

Use shadcn/ui `Button` with these variants:

| Variant | Usage |
|---|---|
| `default` (amber filled) | Primary CTA — "Random Dish", "Save" |
| `outline` | Secondary actions — "View All", "Filter" |
| `ghost` | Tertiary — icon buttons, nav links |
| `destructive` | Dangerous actions — "Delete" |

Sizes: `sm` for inline actions, `default` for standard buttons, `lg` for hero CTAs.

---

### Card

All content cards share:
- `rounded-xl` border radius
- `shadow-sm` elevation
- `hover:shadow-md transition-shadow` on interactive cards
- `border border-zinc-200` border
- `overflow-hidden` to clip image corners

**DishCard anatomy:**

```
┌─────────────────────────┐
│     [Dish Image]        │  ← aspect-ratio: 4/3, object-cover
├─────────────────────────┤
│ [Category badge]        │  ← amber-100 bg, amber-700 text
│ Dish Name               │  ← text-lg font-semibold, 2-line clamp
│ ○ 25 min  🔥 450 kcal   │  ← text-sm text-zinc-500
│            [♡ Save]     │  ← ghost button, right-aligned
└─────────────────────────┘
```

---

### Badge / Tag

```
<Badge variant="secondary">Spicy</Badge>
```

Use for: categories, dietary type, difficulty, dish tags.

Color mapping:
- `normal` → zinc badge
- `vegetarian` → green badge
- `diet` → blue badge
- `easy` → green badge
- `medium` → amber badge
- `hard` → red badge

---

### Nutrition Card

Display all four macros in a horizontal strip:

```
┌──────────┬──────────┬──────────┬──────────┐
│ 450 kcal │  28g     │  12g     │  58g     │
│ Calories │ Protein  │  Fat     │  Carbs   │
└──────────┴──────────┴──────────┴──────────┘
```

Background: `amber-50`. Border: `amber-200`. Numbers use `font-mono font-bold text-zinc-900`.

---

### Search Bar

- Full-width on mobile, fixed width (480px) on desktop in header.
- `rounded-full` for pill shape.
- Magnifying glass icon on left (`text-zinc-400`).
- Dropdown below for recent searches and quick results.
- `ring-2 ring-amber-400` on focus.

---

### Forms

- All form fields use shadcn/ui `Input`, `Textarea`, `Select`, `Switch`.
- Labels above inputs, always.
- Error messages below inputs in `text-red-500 text-xs`.
- Required fields marked with `*` in label.
- Submit button is `w-full` on mobile, `w-auto` on desktop.
- Disabled state during submission: button shows spinner.

---

### Navigation

**Desktop Header:**

```
[Logo]  [Dishes] [Categories] [Random ▼]    [Search Bar]    [♡ Favorites]
```

**Mobile Header:**

```
[Logo]                                       [Search] [♡] [☰]
```

Mobile nav is a full-screen slide-in drawer from the right. No login or register buttons — the site is fully public.

**Admin Sidebar:**

```
[Logo / Brand]
──────────────
Dashboard
Dishes
Recipes
Categories
Ingredients
Users
Banners
Analytics
SEO
Settings
──────────────
[User avatar + name]
[Logout]
```

Fixed left sidebar on desktop (240px wide). Collapses to icon-only on `lg` breakpoint.

---

## Imagery Guidelines

- **Dish images:** minimum 800×600px. Ratio 4:3. High-contrast food photography on clean backgrounds.
- **Category images:** minimum 600×400px. Can use broader lifestyle photography.
- **Banner images:** 1440×400px (desktop), 768×300px (mobile). Full-bleed.
- **Always provide `alt` text** describing the dish/food, not "image of food."
- Use `next/image` component for all images — automatic WebP, lazy loading, and size optimization.
- Fallback placeholder: a warm amber gradient with the dish name initial.

---

## Icons

Use [Lucide React](https://lucide.dev/) — ships with shadcn/ui.

| Icon | Usage |
|---|---|
| `Heart`, `HeartFilled` | Favorites |
| `Search` | Search bar |
| `Clock` | Cooking time |
| `Flame` | Calories |
| `ChefHat` | Difficulty |
| `MapPin` | Location / restaurants |
| `Star` | Rating |
| `ChevronRight` | Navigation arrows |
| `Plus`, `Minus` | Add/remove in forms |
| `Trash2` | Delete |
| `Pencil` | Edit |
| `Eye`, `EyeOff` | Show/hide password |
| `LayoutDashboard` | Dashboard |
| `Menu` | Mobile hamburger |

Icon size: `16px` (inline with text), `20px` (standalone actions), `24px` (feature icons).

---

## Animation and Transitions

Use Tailwind transition utilities. Avoid heavy animation libraries for v1.

| Element | Animation |
|---|---|
| Card hover | `transition-shadow duration-200` |
| Button hover | `transition-colors duration-150` |
| Mobile drawer | `transition-transform duration-300` |
| Skeleton loading | `animate-pulse` |
| Toast notifications | shadcn/ui Sonner — slide in from bottom |
| Random dish result | `animate-fade-in` (custom, 200ms) |
| Page transitions | Next.js default (no custom transitions needed) |

**Do not** use `animate-bounce` or `animate-spin` except on explicit loading indicators.

---

## Loading States

Every async data section must have a skeleton placeholder:

- `SkeletonCard` — matches `DishCard` dimensions.
- `SkeletonText` — gray rounded bar, `animate-pulse`.
- Full page skeletons use `loading.tsx` files per route segment.

---

## Empty States

Every list that can be empty must show a helpful empty state:

```
┌──────────────────────────────┐
│    [Icon - e.g. Search]      │
│   No dishes found            │
│   Try a different keyword    │
│   [Browse all dishes →]      │
└──────────────────────────────┘
```

Icon: 48px, `text-zinc-300`. Title: `text-lg font-medium text-zinc-600`. Description: `text-sm text-zinc-400`. CTA: `Button variant="outline"`.

---

## Accessibility Checklist

- [ ] All interactive elements are reachable by keyboard (`Tab` order logical).
- [ ] Focus rings visible on all focusable elements (`focus-visible:ring-2`).
- [ ] Color is never the only indicator of state (add text or icon).
- [ ] Minimum contrast 4.5:1 for body text, 3:1 for large text.
- [ ] All images have descriptive `alt` text.
- [ ] Form inputs have associated `<label>` elements.
- [ ] Modals trap focus and close on `Escape`.
- [ ] `aria-live` regions used for toast notifications and async updates.
- [ ] `<main>`, `<nav>`, `<header>`, `<footer>` landmarks present on all pages.
