# HomNayAnGi — Stitch Design Documentation

> Source of truth: `stitch_homnayangi_recipe_hub/stitch_homnayangi_recipe_hub/`
> Design system: **Zen Shonen** (primary), **Shonen Kitchen** (secondary/variant)

---

## 1. Screen Inventory

| # | Screen Directory | Page Title | Route (proposed) | Primary Purpose |
|---|---|---|---|---|
| 1 | `legendary_quests_system_suggestions` | HomNayAnGi — Zen Fridge Quest | `/` | Home — ingredient-based recipe search |
| 2 | `ai_suggestions_zen_shonen_style` | HomNayAnGi — Zen Kitchen Quests | `/suggestions` | AI-powered recipe suggestions from pantry scan |
| 3 | `search_results_zen_shonen_style` | HomNayAnGi — Search Quest | `/search` | Keyword/ingredient search results |
| 4 | `legendary_quests_archive_zen_shonen_style` | Legendary Quests Archive | `/quests` | Browse all recipes (archive/catalog) |
| 5 | `recipe_detail_zen_shonen_style` | HomNayAnGi — Legendary Grilled Salmon | `/recipe/:id` | Full recipe detail with ingredients and steps |
| 6 | `lucky_wheel_zen_shonen_synchronized` | HomNayAnGi — Zen Minimalist Kitchen | `/wheel` | Lucky Wheel — random recipe picker |

### Screen Descriptions

**Screen 1 — Home (Fridge Quest)**
The primary landing page. Features a hero with a large ingredient input zone, diet-mode tabs (Thường ngày / Ăn chay / Ăn kiêng), ingredient chip display, and a featured 3-column recipe card grid ("Legendary Quests"). A mascot image panel sits beside the input area.

**Screen 2 — AI Suggestions**
Displays AI-generated recipe recommendations based on pantry contents. Split hero (text + full-bleed image panel). Below the hero, a "Cook Right Now" section shows 3 recipe cards filtered by diet tab. Includes a Mascot Chief reaction badge and a fixed halftone dot overlay on the background.

**Screen 3 — Search Results**
Two-column layout: left sidebar with filter controls (difficulty, cuisine realm, time range) and right main area with a bento-style asymmetric card grid. Results header shows query term and count. Supports tab-based diet filtering. Pagination at bottom.

**Screen 4 — Legendary Quests Archive**
Full-page recipe catalog. Header with large display-sized title, chapter label, and description. Toolbar with diet tabs, keyword search, and sort selector. Uniform 3-column quest card grid. Pagination footer. Vertical accent text decoration on desktop.

**Screen 5 — Recipe Detail**
Split 12-column hero: large image panel (7 cols) + title/meta panel (5 cols). Below: ingredients list ("The Loot") in a 4-col panel and numbered cooking steps ("The Cooking Path") in an 8-col panel. Full-width video/cinematic section. Related Quests horizontal card row at bottom.

**Screen 6 — Lucky Wheel**
Centered interactive wheel built on HTML5 Canvas. Category tabs above the wheel. Left mascot sprite (desktop only). Right-side "Current Quests" panel with scrollable list and custom dish input. Result modal overlay appears after spin completes.

---

## 2. Navigation Flow

```
Home (/)
├─→ AI Suggestions (/suggestions)         [via "Begin Search" CTA after ingredient entry]
├─→ Search Results (/search)              [via search icon in nav or inline input]
├─→ Quests Archive (/quests)              [via "Quests" nav link]
├─→ Lucky Wheel (/wheel)                  [not explicitly linked in nav — discovery TBD]
└─→ Recipe Detail (/recipe/:id)           [via "View Quest" / "View Scroll" on any card]

Search Results (/search)
└─→ Recipe Detail (/recipe/:id)           [via card click]

Quests Archive (/quests)
└─→ Recipe Detail (/recipe/:id)           [via card click]

AI Suggestions (/suggestions)
└─→ Recipe Detail (/recipe/:id)           [via play_arrow button on card]

Recipe Detail (/recipe/:id)
└─→ Recipe Detail (/recipe/:id)           [via "Related Quests" cards]

Lucky Wheel (/wheel)
└─→ Recipe Detail (/recipe/:id)           [via "View Recipe" in result modal]
```

### Global Navigation Links (present on all screens)

| Label | Destination |
|---|---|
| HomNayAnGi (logo) | `/` (Home) |
| Missions | `/suggestions` (AI Suggestions) |
| Cookbook | active on Recipe Detail and AI Suggestions screens |
| Quests | `/quests` (Archive) |
| Search icon / input | `/search` |
| Notifications | — (not yet routed) |
| Person / Account | — (not yet routed) |
| Favorite / Heart | — (not yet routed; localStorage favorites) |

---

## 3. Layout Hierarchy

### 3.1 Home — Fridge Quest

```
<body>
└─ <nav>                            sticky top bar
└─ <main>
   ├─ <section> Hero
   │  └─ .max-w-7xl
   │     ├─ .w-8/12  Input Zone
   │     │  ├─ Badge chip (Mission label)
   │     │  ├─ <h1> Display headline
   │     │  ├─ <p> Subtext
   │     │  ├─ Diet Tabs (3 buttons)
   │     │  └─ Ingredient Input Panel
   │     │     ├─ "MASTER RANK" corner badge
   │     │     ├─ Label + text input + add button
   │     │     ├─ Ingredient chips (removable)
   │     │     └─ "Begin Search" CTA button (full width)
   │     └─ .w-4/12  Mascot Panel
   │        ├─ Bordered image container (aspect-[4/5])
   │        └─ Floating caption badge (-bottom-6 -left-6)
   └─ <section> Popular Quests
      ├─ <header> Section label + h2 + gold divider
      └─ .grid 3-cols  Recipe Cards (×3)
└─ <footer>
```

### 3.2 AI Suggestions

```
<body>
└─ <header>                         sticky top bar
└─ <main>
   ├─ .halftone-zen                  fixed full-screen dot overlay (z-0)
   ├─ <section> Hero (12-col grid)
   │  ├─ .col-span-7  Text block
   │  │  ├─ AI Sensei badge
   │  │  ├─ <h2> Display headline
   │  │  ├─ <p> Subtext (gold left-border accent)
   │  │  └─ 2 CTA buttons (Summon Recipe / Scan Pantry)
   │  └─ .col-span-5  Image Panel
   │     ├─ Offset shadow box (translate-x-4 translate-y-4)
   │     ├─ Image with diagonal stripe overlay
   │     └─ Mascot Chief badge (-bottom-4 -right-4)
   └─ <section> Cook Right Now
      ├─ Section header (number + title + carousel arrows)
      ├─ Diet Tabs (3 buttons)
      └─ .grid 3-cols  Recipe Cards (×3)
└─ <footer>
```

### 3.3 Search Results

```
<body>
└─ <header>                         sticky top bar
└─ <main>  flex-row gap
   ├─ <aside>  w-72 shrink-0         sticky filter sidebar
   │  └─ Bordered panel
   │     ├─ "Refine Results" heading
   │     ├─ Quest Level checkboxes
   │     ├─ Cuisine Realm 2×2 button grid
   │     ├─ Time Pressure range slider
   │     └─ Reset All button
   └─ <div> flex-grow                main content area
      ├─ Results header (query + count)
      ├─ Diet Tabs (3 buttons)
      └─ Bento Grid (3 cols)
         ├─ Featured card (col-span-2, tall image + overlay text)
         └─ Standard cards (×4, portrait image + text footer)
      └─ Pagination (prev / 1 2 3 / next)
└─ <footer>
```

### 3.4 Legendary Quests Archive

```
<body>
└─ <nav>                            sticky top bar
└─ <main>
   ├─ Vertical accent text (lg:block absolute left-4)
   ├─ <header>  Title block + chapter label
   ├─ <section> Filter Toolbar
   │  ├─ Diet Tabs (inline-flex group)
   │  ├─ Search input (flex-grow)
   │  └─ Sort select
   └─ .grid 3-cols  Quest Cards (×6+)
   └─ Pagination footer (page indicator + buttons + "Go To End")
└─ <footer>
```

### 3.5 Recipe Detail

```
<body>
└─ <header>                         sticky top bar
└─ <main>
   ├─ <section> Hero (12-col grid)
   │  ├─ .col-span-7  Image Panel
   │  │  ├─ manga-impact-border image (h-500)
   │  │  ├─ Sparkle particles (3×)
   │  │  └─ Floating rank badge (top-6 left-6)
   │  └─ .col-span-5  Meta Panel
   │     ├─ Mastery level label
   │     ├─ <h2> Recipe title
   │     ├─ Italic quote (left gold border)
   │     ├─ 2×2 meta grid (time + calories)
   │     └─ "Start Cooking!" CTA
   ├─ <section> Details (12-col grid)
   │  ├─ .col-span-4  "The Loot" ingredients list
   │  └─ .col-span-8  "The Cooking Path" numbered steps
   ├─ <section> Video / Cinematic
   │  └─ Full-width h-500 dark overlay panel
   │     ├─ Play button (center)
   │     ├─ Episode title + subtitle
   │     └─ Mascot speech bubble (bottom-right)
   └─ <section> Related Quests
      └─ .grid 3-cols  Recipe Cards (×3)
└─ <footer>
```

### 3.6 Lucky Wheel

```
<body>
└─ <div> Result Modal           fixed overlay (hidden by default)
   └─ Bordered panel
      ├─ Gold corner accents
      ├─ "Destiny Manifested" label
      ├─ Quest title (dynamically set)
      ├─ 16:9 image
      ├─ XP description
      └─ "View Recipe" + "Spin Again" buttons
└─ <nav>                        sticky top bar (with inline search input)
└─ <main>
   ├─ <section> Hero
   │  ├─ <h1> Display headline (centered)
   │  └─ Diet Tabs (centered, 3 buttons)
   │  └─ .max-w-6xl  Wheel Area (flex-row)
   │     ├─ Mascot sprite (xl:block absolute -left-16)
   │     ├─ Wheel Visual (.w-[340px] / .w-[500px])
   │     │  ├─ Pointer arrow (absolute -top-6)
   │     │  ├─ Canvas (wheel-canvas)
   │     │  └─ SPIN button (absolute center z-40)
   │     └─ Right Info Panel
   │        ├─ "Current Quests" scrollable list
   │        └─ Add Custom Quest input + "Enroll Dish" button
   └─ <section> Recent Discoveries
      ├─ Section header + divider
      └─ .grid 3-cols  Discovery Cards (JS-rendered)
└─ <footer>
```

---

## 4. Shared Sections

### 4.1 Global Navigation Bar

Appears on all 6 screens as `<nav>` or `<header>` with `sticky top-0 z-50`.

| Element | Desktop | Mobile |
|---|---|---|
| Logo "HomNayAnGi" | Visible, italic, uppercase, Gold primary | Visible |
| Nav links (Missions / Cookbook / Quests) | `hidden md:flex` | Hidden |
| Search input / icon | Visible (inline or icon only) | Icon only or hidden |
| Notifications icon | Visible | Visible |
| Person / Avatar icon | Visible | Visible |
| Favorite icon | Screen 1 only | Screen 1 only |

Active nav link is indicated by a bottom border in Gold (`border-b border-primary` or `border-b-2 border-primary`).

Background: `bg-surface/80` or `bg-white/80` with `backdrop-blur-md`. Bottom border: `border-b border-outline-variant/30` or `border-b border-primary/10`.

### 4.2 Diet Mode Tabs

Present on Screens 1, 2, 3, 4, and 6. Always three options in Vietnamese:

| Tab | Value |
|---|---|
| Thường ngày | Everyday / Regular |
| Ăn chay | Vegetarian |
| Ăn kiêng | Diet / Low-cal |

Active tab: Gold text + bottom border. Inactive tab: muted text, hover to Gold. State is local to each screen; on Screen 6 it dynamically changes wheel options and discovery cards.

### 4.3 Recipe Card (Quest Card)

The atomic unit across all listing screens. Two variants:

**Standard Card** (Screens 1, 4, Detail related-quests)
```
┌──────────────────────────────┐
│  Image (aspect-video or h-64)│
│  [Rank badge top-left]       │
├──────────────────────────────┤
│  Rank label (tiny, gold)     │
│  Recipe title (display, 2xl) │
│  ─────────────────────────── │
│  ⏱ Time    [View Quest →]    │
└──────────────────────────────┘
```

**Bento Search Card** (Screen 3 — featured variant spans 2 cols)
```
┌──────────────────────────────┐
│  Image (tall, gradient overlay)
│  [NEW! badge]                │
│  [Rank chip + title overlay] │
├──────────────────────────────┤
│  Meta icons + "VIEW SCROLL"  │
└──────────────────────────────┘
```

**Archive Quest Card** (Screen 4)
```
┌──────────────────────────────┐
│  Image (h-64) + [Rank badge] │
├──────────────────────────────┤
│  Title              +XP      │
│  ⏱ Time  📊 Difficulty       │
│  ─────────────────────────── │
│  View Quest         →        │
└──────────────────────────────┘
```

Common card behaviors:
- `group-hover:scale-105` on image (zoom on hover)
- `grayscale-[0.2] group-hover:grayscale-0` (desaturate → full color on hover)
- `hover:-translate-y-1` lift on card container
- Manga-style offset shadow on Screen 3 variants (`manga-shadow`)

### 4.4 XP / Gamification System

All recipe cards display an XP reward. Labels used for difficulty tiers:

| Label | Screens |
|---|---|
| S-Class / Legendary Rank | 3, 4 |
| Elite Tier | 1, 4 |
| Master Rank / Master Chef | 1, 2, 4 |
| Normal / Novice Cook | 4 |

This system is cosmetic in the current Stitch; no user XP tracking UI is shown.

### 4.5 Global Footer

Present on all 6 screens. Two-row layout on mobile, single-row flex on desktop.

| Column | Content |
|---|---|
| Left | "HomNayAnGi" logo + copyright line |
| Center | Footer links: Secret Recipes / Mascot Gallery / Privacy Scrolls (and: Archive, Gallery, Terms, Social on Screen 1; Honor Code, Terms of Service, Privacy on Screen 4) |
| Right | Social icons (`share`, `rss_feed`, `terminal`) — Screen 3 and others |

Background: `bg-surface-container-lowest` or `bg-white`. Top border in Gold or on-surface.

### 4.6 Pagination

Present on Screens 3 and 4. Shared pattern:
- Left `chevron_left` button
- Numbered page buttons (active = filled Gold or `bg-on-background`)
- Right `chevron_right` button
- Screen 4 adds page counter label ("Page 01 / 12") and "Go To End" button

---

## 5. Responsive Behavior

### Breakpoints in use

| Tailwind prefix | Width |
|---|---|
| (default) | < 768px — mobile |
| `md:` | ≥ 768px — tablet / wide mobile |
| `lg:` | ≥ 1024px — desktop |
| `xl:` / `2xl:` | ≥ 1280px / ≥ 1536px — wide desktop |

### Per-screen responsive changes

**Screen 1 — Home**
- Hero: `flex-col` → `lg:flex-row` (input zone stacks above mascot on mobile)
- Input zone: `w-full` → `lg:w-8/12`
- Mascot panel: `w-full` → `lg:w-4/12`
- Quest cards: `grid-cols-1` → `md:grid-cols-3`
- Horizontal padding: `px-margin-mobile (16px)` → `md:px-margin-desktop (48px)`

**Screen 2 — AI Suggestions**
- Hero: `grid-cols-1` → `lg:grid-cols-12`
- Cook Right Now cards: `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3`
- Mascot sprite panel hidden on mobile (`.relative h-[500px]` collapses)

**Screen 3 — Search Results**
- Main layout: `flex-col` → `md:flex-row` (sidebar above results on mobile)
- Sidebar: `w-full` → `md:w-72 shrink-0`
- Bento grid: `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3`
- Featured card span: `md:col-span-2 lg:col-span-2` (collapses to 1-col on mobile)
- Nav inline search: `hidden sm:block`

**Screen 4 — Archive**
- Title: `text-display-lg` (64px) scales down visually on narrow screens (no explicit mobile override in config — relies on container width)
- Filter toolbar: `flex-col` → `lg:flex-row`
- Quest grid: `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3`
- Vertical accent text: `hidden lg:block`
- Footer pagination: full row on desktop; "Go To End" button `hidden md:block`

**Screen 5 — Recipe Detail**
- Hero: `grid-cols-1` → `lg:grid-cols-12` (image stacks above meta on mobile)
- Details section: `grid-cols-1` → `lg:grid-cols-12`
- Related Quests: `grid-cols-1` → `md:grid-cols-3`
- Nav links: `hidden md:flex`

**Screen 6 — Lucky Wheel**
- Wheel size: `w-[340px] h-[340px]` → `md:w-[500px] md:h-[500px]`
- Wheel + info panel: `flex-col` → `lg:flex-row`
- Mascot sprite: `hidden xl:block absolute`
- Nav inline search: `hidden sm:block`
- Spin button: `w-24 h-24` → `md:w-28 md:h-28`
- Recent Discoveries: `grid-cols-1` → `md:grid-cols-3`

---

## 6. Desktop and Mobile Considerations

### Desktop (≥ 1024px)

- **Max content width**: `max-w-7xl mx-auto` (1280px) on most screens; `max-w-[1440px]` on Archive.
- **Side margins**: `px-margin-desktop` — 48px (Zen Shonen) or 40px (Shonen Kitchen/Archive).
- **Typography scales up**: headline `text-6xl` / `text-7xl` on Home hero; `text-display-lg` (64px) on Archive.
- **Multi-column layouts activate**: 2-col and 3-col grids, 12-col asymmetric splits for hero sections.
- **Sidebar visible**: Filter sidebar on Search Results is rendered inline (not hidden behind a drawer).
- **Mascot elements visible**: Lucky Wheel mascot sprite and floating decorations only render at `xl:`.
- **Vertical text accent**: Archive screen shows `writing-mode: vertical-rl` decorative label at `lg:`.
- **Navigation**: Full link labels visible (`hidden md:flex`).
- **Sticky elements**: Nav bar and filter sidebar (`sticky top-28`) stay fixed while scrolling.

### Mobile (< 768px)

- **Side margins**: `px-margin-mobile` — 16px (Zen Shonen) or 20px (Shonen Kitchen).
- **Typography**: `headline-lg-mobile` used (24px–28px instead of 32px). Hero headline remains large but wraps naturally.
- **Single-column layouts**: All grids collapse to 1-col. Hero sections stack vertically.
- **Mascot panels**: Stack below input/text content rather than floating beside.
- **Navigation**: Links hidden; logo + icon row only. No inline search input (Screen 3 uses `hidden sm:block`).
- **Filter sidebar** (Screen 3): Rendered as a full-width block above the results list (no sticky).
- **Lucky Wheel**: Smaller canvas (340×340); info panel stacks below wheel; mascot sprite hidden.
- **Featured card** (Screen 3): Loses its 2-column span; renders as standard single-column card.
- **Footer**: Stacks into `flex-col` with centered items.
- **Result Modal** (Screen 6): `max-w-lg w-full mx-4` — full-width with 16px margin; action buttons stack vertically on narrow viewports via `flex-col sm:flex-row`.

### Interaction States

| State | Pattern |
|---|---|
| Button hover (Zen) | `translateY(-2px)` + gold glow shadow |
| Button hover (Manga) | `translate(3px, 3px)` + shadow collapse ("press in") |
| Card hover | Image zoom + desaturate-off + card lift |
| Nav link hover | Color transition to primary Gold |
| Input focus | Bottom-border turns Gold; no ring |
| Active/pressed | `scale(0.98)` or `active:scale-95` |
| Wheel spin | 5s `cubic-bezier(0.15, 0, 0.15, 1)` CSS transform rotation |

---

## Design System Summary

### Theme: Zen Shonen (primary — used on 5 of 6 screens)

| Token | Value |
|---|---|
| Background / Paper White | `#FAF9F9` / `#FAFAF9` |
| Primary / Gold Leaf | `#735C00` (dark) / `#D4AF37` (container) |
| On-Surface / Ink | `#1B1C1C` |
| On-Surface Variant | `#4D4635` |
| Outline | `#7F7663` |
| Font: Display / Headline | Anybody (200–300 weight) |
| Font: Body | Hanken Grotesk |
| Font: Label / Mono | JetBrains Mono |
| Border radius | 0px (sharp / orthogonal) |
| Shadow style | Subtle `rgba(0,0,0,0.05)` — no hard shadows |
| Desktop margin | 48px |
| Mobile margin | 16px |

### Theme: Shonen Kitchen / Manga-Brutalist (variant — Screen 3 strongest influence)

| Token | Value |
|---|---|
| Border | `manga-border`: 1.5px solid `#1b1b1e` |
| Shadow | `manga-shadow`: `4px 4px 0px 0px #1b1b1e` (hard offset) |
| Press effect | `manga-shadow-hover`: shadow collapses + translate(3px, 3px) |
| Explosive badge | `clip-path: polygon(starburst)` |
| Halftone | `radial-gradient` dot pattern at 5% opacity |
| Font: Label | Space Grotesk (bold, tracked) |
