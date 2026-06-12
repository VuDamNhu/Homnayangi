# HomNayAnGi — Component Inventory

> Source of truth: Stitch design files in `stitch_homnayangi_recipe_hub/`
> Design system: Zen Shonen (primary), Shonen Kitchen (variant)
> Screens referenced: Home (`S1`), AI Suggestions (`S2`), Search Results (`S3`), Archive (`S4`), Recipe Detail (`S5`), Lucky Wheel (`S6`)

---

## 1. Layout Components

Components that define page structure, scaffolding, and major spatial regions. They hold other components but carry no recipe-specific data.

---

### TopNavBar

**Purpose**
Persistent sticky header across every screen. Contains the brand logo, primary navigation links, search affordance, and user action icons. The active route is indicated by a gold bottom border on the matching link.

**Reusability**
All 6 screens. Slight prop variance per screen (Screen 1 shows a `favorite` icon; Screens 2 and 6 show a full inline text input instead of a search icon only).

**Main props**
| Prop | Description |
|---|---|
| `activeLink` | `"missions" \| "cookbook" \| "quests"` — highlights the current section |
| `showFavoriteIcon` | boolean — renders the heart icon (Screen 1 only) |
| `searchVariant` | `"icon" \| "inline"` — icon-only vs. expanded text input in the bar |
| `showNotifications` | boolean |
| `showAvatar` | boolean — renders person icon or avatar image |

---

### PageContainer

**Purpose**
Constrains page content to a maximum width and applies consistent horizontal padding. Acts as the direct parent of all in-page sections.

**Reusability**
All screens. Two max-width variants are used: `max-w-7xl` (1280px) on Screens 1–3, 5–6 and `max-w-[1440px]` on Screen 4.

**Main props**
| Prop | Description |
|---|---|
| `maxWidth` | `"7xl" \| "1440"` |
| `paddingX` | `"desktop" \| "mobile"` — maps to the design token (`48px` / `16px` Zen Shonen; `40px` / `20px` Shonen Kitchen) |

---

### SectionContainer

**Purpose**
Wraps individual page sections with consistent vertical padding and an optional top border. Provides the repeating vertical rhythm between content blocks on a page.

**Reusability**
All screens. Used to separate Hero, card grid, and supplementary sections.

**Main props**
| Prop | Description |
|---|---|
| `paddingY` | vertical spacing value (e.g. `py-20`, `py-32`) |
| `background` | token-based background (`surface`, `surface-container-low`, `white`, etc.) |
| `borderTop` | boolean — renders the subtle gold or on-surface top border |

---

### TwoColumnHero

**Purpose**
Asymmetric 12-column hero grid that splits a page's primary hero into a wide text/input area (left) and a narrower image or mascot panel (right). Used for the most important first impression of a page.

**Reusability**
Screens 1 (8-col / 4-col), 2 (7-col / 5-col), 5 (7-col / 5-col).

**Main props**
| Prop | Description |
|---|---|
| `leftColSpan` | integer 1–11 (number of grid columns for the left pane) |
| `rightColSpan` | integer 1–11 (right pane; should sum with left to 12) |
| `leftContent` | slot — text block, input zone, or meta panel |
| `rightContent` | slot — image panel, mascot, or stat panel |
| `verticalAlignment` | `"center" \| "start"` |

---

### ContentGrid

**Purpose**
Responsive grid container for recipe/quest cards. Switches from 1 column on mobile to 2 or 3 columns on tablet/desktop.

**Reusability**
Screens 1, 2, 4, 5 (Related Quests), 6 (Recent Discoveries).

**Main props**
| Prop | Description |
|---|---|
| `cols` | `1 \| 2 \| 3` — maximum column count at desktop |
| `gap` | spacing value between cells |
| `items` | array of card data to render |

---

### BentoGrid

**Purpose**
Asymmetric card grid used exclusively on the Search Results page. One featured card spans two columns at the top, with standard cards filling the remaining slots. Creates a "manga panel" visual hierarchy.

**Reusability**
Screen 3 only. Low reusability in its current form; could be generalized with a `featuredIndex` prop.

**Main props**
| Prop | Description |
|---|---|
| `items` | array of recipe objects |
| `featuredIndex` | integer — which item renders as the wide featured card (default `0`) |
| `cols` | maximum columns (3 at desktop, collapses to 1 on mobile) |

---

### FilterSidebar

**Purpose**
Left-side sticky filter panel on the Search Results screen. Holds all filter controls (difficulty, cuisine, time), a reset button, and remains visible as the user scrolls through results.

**Reusability**
Screen 3. Structurally reusable on Screen 4 (Archive) if filter controls are added there.

**Main props**
| Prop | Description |
|---|---|
| `children` | slot — accepts filter section components |
| `sticky` | boolean — enables `sticky top-28` positioning |
| `onReset` | callback — resets all active filters |

---

### GlobalFooter

**Purpose**
Site-wide footer rendered at the bottom of every page. Contains the brand logo, secondary navigation links, legal text, and optional social icons.

**Reusability**
All 6 screens. Two minor variants: Screens 1 and 4 include a different link set; Screens 3 and 2 add `share` and `rss_feed` icons.

**Main props**
| Prop | Description |
|---|---|
| `links` | array of `{ label, href }` — secondary nav and legal links |
| `showSocialIcons` | boolean |
| `variant` | `"standard" \| "light"` — adjusts background token |
| `copyrightLine` | string |

---

### VerticalAccentText

**Purpose**
Decorative vertical writing-mode text displayed on the far left edge of the Archive page at desktop widths. References editorial season/chapter info for a Japanese manga publication feel. Purely decorative; does not communicate navigation.

**Reusability**
Screen 4 only. Desktop (`lg:block`) only.

**Main props**
| Prop | Description |
|---|---|
| `text` | string (e.g. `"CULINARY DISCIPLINE • SEASON 04"`) |
| `opacity` | number 0–1 (default `0.30`) |

---

## 2. Shared Components

Atomic and molecular components with no domain-specific data dependency. Used across multiple screens and multiple component types.

---

### PrimaryButton

**Purpose**
The main call-to-action button. Filled with Gold Leaf (`primary`). Used for the highest-priority action on a given screen (Begin Search, Start Cooking, Summon Recipe, Enroll Dish).

**Reusability**
All screens.

**Main props**
| Prop | Description |
|---|---|
| `label` | string |
| `icon` | Material Symbol name (optional, renders leading icon) |
| `fullWidth` | boolean |
| `size` | `"sm" \| "md" \| "lg"` |
| `onClick` | callback |

---

### SecondaryButton

**Purpose**
Secondary action button. Uses an outline or ghost style (`border border-primary` or `bg-surface zen-border`). Paired with PrimaryButton to offer an alternative action (Scan Pantry, Spin Again, View Scroll).

**Reusability**
Screens 1, 2, 3, 5, 6.

**Main props**
| Prop | Description |
|---|---|
| `label` | string |
| `icon` | Material Symbol name (optional) |
| `variant` | `"outline" \| "ghost"` |
| `fullWidth` | boolean |
| `onClick` | callback |

---

### IconButton

**Purpose**
A single Material Symbols icon rendered as a tappable button. Used in TopNavBar for search, favorite, notifications, and person actions.

**Reusability**
All screens (inside TopNavBar and scattered in card footers).

**Main props**
| Prop | Description |
|---|---|
| `icon` | Material Symbol name |
| `size` | `"sm" \| "md" \| "lg"` |
| `color` | token (`on-surface-variant`, `primary`) |
| `label` | accessibility label (aria) |
| `onClick` | callback |

---

### DietTabs

**Purpose**
Three-tab selector for filtering content by diet category: `Thường ngày` (everyday), `Ăn chay` (vegetarian), `Ăn kiêng` (diet). The active tab has a gold underline. Tab change updates the content below it without navigating away.

**Reusability**
Screens 1, 2, 3, 4, 6. Two visual variants appear: `"underline"` (most screens) and `"boxed"` (Screen 4 Archive toolbar).

**Main props**
| Prop | Description |
|---|---|
| `activeTab` | `"normal" \| "vegetarian" \| "diet"` |
| `onTabChange` | callback receiving new tab value |
| `variant` | `"underline" \| "boxed"` |

---

### SectionHeader

**Purpose**
Consistent two-line section title block. Renders an uppercase eyebrow label in gold, a display-font h2, and an optional gold horizontal rule below. Centers on Screens 1 and 6; left-aligns on others.

**Reusability**
All screens.

**Main props**
| Prop | Description |
|---|---|
| `eyebrow` | string — small uppercase gold label above title |
| `title` | string — main section heading |
| `showDivider` | boolean — renders 64px gold line below title |
| `alignment` | `"center" \| "left"` |

---

### RankBadge

**Purpose**
Displays the prestige tier of a recipe (S-Class, Elite Tier, Master Rank, Normal, Legendary Rank, PERFECT MATCH). Appears either as an image overlay (top-left corner) or as an inline text label within a card body.

**Reusability**
All card-containing screens (1, 2, 3, 4, 5).

**Main props**
| Prop | Description |
|---|---|
| `tier` | `"s-class" \| "legendary" \| "elite" \| "master" \| "normal" \| "perfect-match"` |
| `position` | `"overlay-top-left" \| "inline"` |
| `variant` | `"dark"` (black bg) \| `"gold"` (primary bg) — Screen 2 uses gold |

---

### XPLabel

**Purpose**
Shows the XP reward earned for completing a recipe quest (e.g. `+450 XP`, `XP +120`). Reinforces the gamification loop.

**Reusability**
Screens 3, 4, 6. Inline within card footers.

**Main props**
| Prop | Description |
|---|---|
| `value` | number |
| `prefix` | `"+" \| "XP +"` |
| `size` | `"sm" \| "md"` |

---

### MetaChip

**Purpose**
Displays a single piece of recipe metadata: cook time, calorie count, or difficulty level. Combines a Material Symbol icon with a value string.

**Reusability**
All card and detail screens. Appears in card footers, detail stat panels, and inline within archive cards.

**Main props**
| Prop | Description |
|---|---|
| `icon` | Material Symbol name (`schedule`, `local_fire_department`, `equalizer`) |
| `value` | string (e.g. `"25m"`, `"450 Kcal"`, `"Hard"`) |
| `label` | optional accessible label |

---

### SearchInput

**Purpose**
Text input for keyword or ingredient-based recipe search. Appears in three contexts: as an icon-only trigger in the nav, as an inline compact field in the nav bar, and as a full-width search field in the Archive toolbar.

**Reusability**
TopNavBar on all screens; standalone in Screen 4 toolbar; header area of Screen 3.

**Main props**
| Prop | Description |
|---|---|
| `placeholder` | string |
| `variant` | `"nav-inline"` (underline only, in nav) \| `"sidebar"` (bordered box) \| `"toolbar"` (full-width underline) |
| `onSearch` | callback receiving query string |
| `value` | controlled value |

---

### Pagination

**Purpose**
Navigates between pages of recipe results. Renders prev/next chevron buttons and numbered page buttons. The active page is filled with the inverse surface color.

**Reusability**
Screens 3 and 4.

**Main props**
| Prop | Description |
|---|---|
| `currentPage` | number |
| `totalPages` | number |
| `onPageChange` | callback |
| `showPageLabel` | boolean — renders `"Page 01 / 12"` text label (Screen 4 only) |
| `showGoToEnd` | boolean — renders the "Go To End" button (Screen 4 only) |

---

### ResultModal

**Purpose**
Full-viewport overlay that reveals the outcome of a Lucky Wheel spin. Contains gold corner accents, a dynamically set title and image, an XP description, and two action buttons.

**Reusability**
Screen 6 (primary use). The overlay pattern (backdrop-blur modal with bordered panel) is reusable for any confirmation or result display.

**Main props**
| Prop | Description |
|---|---|
| `isOpen` | boolean |
| `title` | string — dynamically set to winning recipe name |
| `imageSrc` | string |
| `description` | string |
| `xpValue` | number |
| `onViewRecipe` | callback |
| `onDismiss` | callback — "Spin Again" action |

---

### HalftoneOverlay

**Purpose**
A radial-gradient dot pattern that references manga printing halftone textures. Applied either as a fixed full-screen background layer (Screen 2), as a footer texture on card panels (Screen 3), or as a subtle background on the Archive page.

**Reusability**
Screens 2, 3, 4. Can be used on any surface that needs visual depth without color or shadow.

**Main props**
| Prop | Description |
|---|---|
| `dotColor` | hex or token |
| `dotSize` | percentage of cell (default `5%`) |
| `cellSize` | background-size value (default `10px 10px`) |
| `opacity` | number 0–1 |
| `fixed` | boolean — `position: fixed` vs. `position: absolute` |

---

### SkewChip

**Purpose**
A slightly skewed (`-5deg`) inline label used to highlight a page-level mission context or category (e.g. "Mission: Fridge Raid"). Uses a thin border and gold-tinted background.

**Reusability**
Screen 1 hero area. Moderate reusability as a decorative label elsewhere.

**Main props**
| Prop | Description |
|---|---|
| `icon` | Material Symbol name |
| `label` | string |
| `skewDeg` | number (default `-5`) |

---

### MascotSpeechBubble

**Purpose**
A small floating speech-bubble element that renders a mascot icon alongside a short character quote. Used to add personality to the interface at key moments.

**Reusability**
Screens 5 (video section overlay), 6 (wheel mascot sprite).

**Main props**
| Prop | Description |
|---|---|
| `text` | string |
| `avatarIcon` | Material Symbol name or image src |
| `position` | `"bottom-right" \| "inline"` |

---

### SortSelector

**Purpose**
A dropdown `<select>` control for sorting a recipe list by a chosen criterion. Styled with an underline-only border and JetBrains Mono label font.

**Reusability**
Screen 4 (Archive filter toolbar). Could be reused on any listing screen.

**Main props**
| Prop | Description |
|---|---|
| `options` | array of `{ value, label }` |
| `value` | currently selected value |
| `onChange` | callback |

---

## 3. Dish Components

Recipe cards as they appear in listing, browsing, and discovery contexts. Each variant is adapted to the layout density of its host screen.

---

### QuestCard

**Purpose**
The standard recipe card used in the Home hero grid and the Recipe Detail related-quests row. Displays a landscape image, tier label, recipe title, cook time, and a "View Quest" text link.

**Reusability**
Screens 1, 5 (Related Quests). High reusability — the core atomic card across the product.

**Main props**
| Prop | Description |
|---|---|
| `image` | `{ src, alt }` |
| `rankLabel` | string (e.g. `"Elite Tier"`) |
| `title` | string |
| `cookTime` | string (e.g. `"15 MIN"`) |
| `href` | string — route to recipe detail |
| `onClick` | callback |

---

### FeaturedQuestCard

**Purpose**
A wide 2-column card that sits at the top of the Search Results bento grid. Has a tall full-height image with a gradient text overlay, an animated "NEW!" starburst badge, rank chip, recipe title, cook time, and calorie count. The "VIEW SCROLL" CTA sits in a halftone-textured footer strip.

**Reusability**
Screen 3 only (first card position in the bento grid).

**Main props**
| Prop | Description |
|---|---|
| `image` | `{ src, alt }` |
| `isNew` | boolean — shows the starburst "NEW!" badge |
| `rankLabel` | string |
| `title` | string |
| `cookTime` | string |
| `calories` | string |
| `onClick` | callback |

---

### SearchResultCard

**Purpose**
Standard portrait card used for non-featured results in the Search Results bento grid. Contains an image with a favorite heart button, category label, recipe title, 2-line description, XP reward, and an arrow CTA.

**Reusability**
Screen 3 (positions 2–5+ in the bento grid).

**Main props**
| Prop | Description |
|---|---|
| `image` | `{ src, alt }` |
| `category` | string (e.g. `"Seafood Realm"`, `"Power Salad"`) |
| `title` | string |
| `description` | string (2-line clamp) |
| `xp` | number |
| `isFavorited` | boolean |
| `isHot` | boolean — renders "HOT!" starburst badge |
| `onClick` | callback |

---

### AIMatchCard

**Purpose**
Recipe card specific to the AI Suggestions "Cook Right Now" section. Highlights the AI's match confidence with a "PERFECT MATCH" overlay badge and shows a time badge. Includes the recipe tier, an attribute (spice level, comfort, energy emoji), match percentage, and a play-button CTA.

**Reusability**
Screen 2 only. Medium reusability — the match-percentage and attribute props are AI-specific.

**Main props**
| Prop | Description |
|---|---|
| `image` | `{ src, alt }` |
| `rankLabel` | string (e.g. `"LEGENDARY"`, `"QUICK BUFF"`) |
| `title` | string |
| `cookTime` | string |
| `matchPercent` | number (0–100) |
| `attribute` | string (e.g. `"Spicy Level: 🔥🔥"`) |
| `onPlay` | callback |

---

### DiscoveryCard

**Purpose**
A compact square-image card used in the Lucky Wheel "Recent Discoveries" section. Displays community-discovered recipes with title, XP, badge label, and star rating. Rendered dynamically by JavaScript based on the active diet category.

**Reusability**
Screen 6 (Recent Discoveries grid). Could be reused in a community feed or homepage module.

**Main props**
| Prop | Description |
|---|---|
| `image` | `{ src, alt }` |
| `title` | string |
| `xp` | number |
| `badge` | string (e.g. `"Masterpiece"`, `"Artisan"`) |
| `stars` | number 1–5 |

---

### ArchiveQuestCard

**Purpose**
The primary card for the Legendary Quests Archive catalog page. Uses a manga-panel style (1px ink border with a subtle offset shadow). Displays rank badge, title (in display font), XP reward, cook time, difficulty level, and a "View Quest" footer row with an animated arrow.

**Reusability**
Screen 4 only. High within-archive reusability — every item in the catalog uses this card.

**Main props**
| Prop | Description |
|---|---|
| `image` | `{ src, alt }` |
| `rankLabel` | string |
| `title` | string |
| `xp` | number |
| `cookTime` | string |
| `difficulty` | `"Easy" \| "Normal" \| "Hard" \| "Expert"` |
| `href` | string |

---

## 4. Recipe Components

Components used exclusively on the Recipe Detail screen (Screen 5) to display the full recipe experience.

---

### RecipeHeroImage

**Purpose**
The large primary image on the Recipe Detail hero. Rendered with a 2px gold manga-impact border and a hard 4px offset shadow. Includes animated sparkle particles, a rank badge in the top-left corner, and a scale-on-hover zoom effect.

**Reusability**
Screen 5 only.

**Main props**
| Prop | Description |
|---|---|
| `src` | string |
| `alt` | string |
| `rankLabel` | string (e.g. `"Rank: S-Class Meal"`) |
| `sparkleCount` | number (default `3`) |

---

### RecipeMetaPanel

**Purpose**
The right-side panel in the Recipe Detail hero. Displays mastery level, recipe title, a descriptive italic quote with a gold left-border accent, a 2×2 stat grid, and the primary "Start Cooking!" CTA button.

**Reusability**
Screen 5 only.

**Main props**
| Prop | Description |
|---|---|
| `masteryLevel` | string (e.g. `"Level 42 Mastery"`) |
| `title` | string |
| `quote` | string |
| `cookTime` | string |
| `calories` | string |
| `onStartCooking` | callback |

---

### RecipeStatGrid

**Purpose**
A 2-column grid of stat boxes inside the RecipeMetaPanel. Each box contains a gold Material Symbol icon and a label. Currently displays cook time and calories; extendable to servings, difficulty, or other metrics.

**Reusability**
Screen 5 (within RecipeMetaPanel). Moderate reusability as a standalone metadata block.

**Main props**
| Prop | Description |
|---|---|
| `stats` | array of `{ icon, value, label }` |
| `cols` | number (default `2`) |

---

### IngredientsPanel

**Purpose**
"The Loot" panel — displays all recipe ingredients as a vertical list of name and quantity pairs. Each row highlights gold on hover. An abstract decorative circle sits behind the title. Contained in a white box with a `gold-underline` heading.

**Reusability**
Screen 5 only. The list pattern (name + quantity) is highly reusable in future cooking/meal-plan views.

**Main props**
| Prop | Description |
|---|---|
| `ingredients` | array of `{ name, quantity }` |
| `heading` | string (default `"The Loot"`) |

---

### CookingStepsPanel

**Purpose**
"The Cooking Path" — renders an ordered list of numbered recipe steps. Each step has a gold circular step-number indicator, a bold uppercase step title, and a body paragraph. The number circle fills gold on hover to indicate progress.

**Reusability**
Screen 5 only.

**Main props**
| Prop | Description |
|---|---|
| `steps` | array of `{ number, title, description }` |
| `heading` | string (default `"The Cooking Path"`) |

---

### CookingStep

**Purpose**
A single step item within the CookingStepsPanel. Comprises a circular number badge (left) and a text block (right: title + description).

**Reusability**
Within CookingStepsPanel only. Atomic sub-component.

**Main props**
| Prop | Description |
|---|---|
| `number` | string (e.g. `"01"`, `"02"`) |
| `title` | string |
| `description` | string |

---

### RecipeVideoSection

**Purpose**
A full-width cinematic video area. Dark background with a low-opacity thumbnail image, a centered play button, episode title, and a subtitle line. A mascot speech-bubble appears in the bottom-right corner.

**Reusability**
Screen 5 only.

**Main props**
| Prop | Description |
|---|---|
| `thumbnailSrc` | string |
| `episodeTitle` | string (e.g. `"Episode 14: The Salmon Saga"`) |
| `episodeSubtitle` | string (e.g. `"Previously on HomNayAnGi..."`) |
| `mascotText` | string |
| `onPlay` | callback |

---

### RelatedQuestsSection

**Purpose**
A 3-column grid of related recipe thumbnails below the recipe detail body. Each card links to another Recipe Detail. Includes a "View All Missions" text link.

**Reusability**
Screen 5 (detail footer). Could be reused as a "You Might Also Like" module on other content pages.

**Main props**
| Prop | Description |
|---|---|
| `recipes` | array of `{ image, category, title, cookTime, href }` |
| `viewAllHref` | string |

---

## 5. Random Components

Components specific to the Lucky Wheel feature (Screen 6). All relate to the random recipe selection mechanic.

---

### LuckyWheelCanvas

**Purpose**
An HTML5 Canvas-based fortune wheel divided into equal segments, one per recipe option. Each segment is filled with a warm paper-tone color and labeled with the recipe name in Space Grotesk. The wheel rotates with a 5-second ease-in-out animation on spin.

**Reusability**
Screen 6 only.

**Main props**
| Prop | Description |
|---|---|
| `options` | string[] — recipe names populating the wheel segments |
| `colors` | string[] — segment fill colors (cycles through array) |
| `accentColor` | string — divider line and center ring color (default gold) |
| `onSpinComplete` | callback receiving the winning option string |

---

### WheelPointer

**Purpose**
A downward-pointing arrow indicator (`keyboard_arrow_down` Material Symbol) fixed above the wheel center. Visually marks the winning segment after the wheel stops.

**Reusability**
Screen 6 only (within LuckyWheelCanvas container).

**Main props**
| Prop | Description |
|---|---|
| `color` | token (default `primary`) |
| `size` | string (default `text-5xl`) |

---

### SpinButton

**Purpose**
A circular button overlaid at the center of the wheel. Displays "SPIN" in italic display font. Disabled (no-op) while the wheel is already spinning. Active state compresses the button (`active:scale-95`).

**Reusability**
Screen 6 only.

**Main props**
| Prop | Description |
|---|---|
| `isSpinning` | boolean — disables click while wheel is in motion |
| `onClick` | callback |
| `label` | string (default `"SPIN"`) |

---

### CurrentQuestsList

**Purpose**
A scrollable panel listing the current wheel options. Each item shows the recipe name with a small gold dot prefix and a remove button that appears on row hover. Minimum 2 items enforced.

**Reusability**
Screen 6 only.

**Main props**
| Prop | Description |
|---|---|
| `options` | string[] |
| `onRemove` | callback receiving the index to remove |
| `maxHeight` | string (default `180px`) |

---

### AddQuestInput

**Purpose**
A text input and "ENROLL DISH" button pair for adding a custom recipe to the wheel. Uses an underline-only border that transitions to gold on focus.

**Reusability**
Screen 6 only. The input+submit pattern is reusable at a generic level.

**Main props**
| Prop | Description |
|---|---|
| `placeholder` | string (default `"Add Custom Quest..."`) |
| `onAdd` | callback receiving the new item string |
| `buttonLabel` | string (default `"ENROLL DISH"`) |

---

### WheelMascotSprite

**Purpose**
A floating ambient mascot element anchored to the left side of the wheel area. Contains a circular icon box and a short italic tagline. Animates with a gentle float (`translateY` keyframe). Visible only at the `xl:` breakpoint.

**Reusability**
Screen 6 only (desktop xl: only).

**Main props**
| Prop | Description |
|---|---|
| `icon` | Material Symbol name (default `restaurant`) |
| `message` | string (e.g. `"Peace in Every Bite"`) |
| `opacity` | number (default `0.40`) |

---

## 6. Ingredient Components

Components that support ingredient entry on the Home screen and pantry analysis on the AI Suggestions screen.

---

### IngredientInputPanel

**Purpose**
The complete ingredient entry container on the Home hero. Groups the label, text input, ingredient chips, and the "Begin Search" CTA into one bordered panel. Includes a corner "MASTER RANK" badge and is the primary user interaction point for the fridge-search flow.

**Reusability**
Screen 1 (Home hero, right-pane of TwoColumnHero).

**Main props**
| Prop | Description |
|---|---|
| `ingredients` | string[] — currently added ingredients |
| `onAdd` | callback receiving new ingredient string |
| `onRemove` | callback receiving removed ingredient index |
| `onSearch` | callback to trigger recipe search |
| `cornerBadgeLabel` | string (default `"MASTER RANK"`) |

---

### IngredientTextInput

**Purpose**
A single underline-style text input with an inline gold `add` icon button. Accepts one ingredient name at a time. Pressing the button (or submitting) fires `onAdd` and clears the field.

**Reusability**
Screen 1 (within IngredientInputPanel). The underline input pattern is shared with other inputs across the app (AddQuestInput, SearchInput toolbar variant).

**Main props**
| Prop | Description |
|---|---|
| `placeholder` | string (e.g. `"e.g. Fresh Basil..."`) |
| `value` | string |
| `onChange` | callback |
| `onAdd` | callback |

---

### IngredientChip

**Purpose**
A removable tag representing one ingredient that has been added to the search. Displays the ingredient name in JetBrains Mono uppercase and a close icon that appears on hover.

**Reusability**
Screen 1 (within IngredientInputPanel chips list). The chip pattern could be reused in a tag-filter or meal-planner context.

**Main props**
| Prop | Description |
|---|---|
| `label` | string |
| `onRemove` | callback |

---

### PantryScanCTA

**Purpose**
A secondary action button on the AI Suggestions hero that triggers an AI scan of the user's detected pantry inventory. Distinct from the primary "Summon Recipe" button — this represents a data-input action rather than a recipe-generation action.

**Reusability**
Screen 2 (AI Suggestions hero). Low reusability in its current form; the button component itself reuses SecondaryButton.

**Main props**
| Prop | Description |
|---|---|
| `onClick` | callback |
| `label` | string (default `"Scan Pantry"`) |
| `icon` | string (default `filter_center_focus`) |

---

### MascotImagePanel

**Purpose**
The right-column mascot artwork panel on the Home hero. Displays an anime character image in a bordered container (aspect-[4/5]), with a floating caption badge that overlaps the lower-left corner of the image.

**Reusability**
Screen 1 only (Home hero right column).

**Main props**
| Prop | Description |
|---|---|
| `src` | string |
| `alt` | string |
| `captionText` | string (e.g. `"THE FRIDGE IS OPEN"`) |

---

## 7. Restaurant Components

Components related to culinary classification, editorial curation identity, and the chef/kitchen persona of the product.

---

### FilterPanel

**Purpose**
The outermost container that groups all filter control sections (CuisineRealmFilter, DifficultyFilter, TimePressureSlider) into one cohesive panel. Renders a section title, wraps the controls, and exposes a reset action.

**Reusability**
Screen 3 (Search Results sidebar). Structurally reusable on any future listing page that needs faceted filtering.

**Main props**
| Prop | Description |
|---|---|
| `heading` | string (default `"Refine Results"`) |
| `onReset` | callback |
| `children` | slot — accepts filter section components |

---

### CuisineRealmFilter

**Purpose**
A 2×2 grid of cuisine category buttons allowing the user to narrow results by culinary tradition (Japanese, Vietnamese, Italian, Korean). Active selection is highlighted with a gold-tinted background.

**Reusability**
Screen 3 (within FilterPanel / FilterSidebar). Moderate reusability — extendable with more cuisine options.

**Main props**
| Prop | Description |
|---|---|
| `options` | string[] (cuisine labels) |
| `activeOption` | string \| null |
| `onChange` | callback receiving selected cuisine string |

---

### DifficultyFilter

**Purpose**
A vertical list of checkboxes for filtering recipes by skill level. Three tiers are shown: Novice Cook, Kitchen Warrior, Master Chef. Maps to the gamification rank vocabulary used throughout the product.

**Reusability**
Screen 3 (within FilterPanel). Reusable wherever recipe difficulty filtering is needed.

**Main props**
| Prop | Description |
|---|---|
| `options` | array of `{ value, label }` |
| `selected` | string[] — currently checked values |
| `onChange` | callback receiving updated selected array |

---

### TimePressureSlider

**Purpose**
A range `<input>` for filtering recipes by maximum cook time. Displays endpoint labels ("15 MIN" and "60+ MIN"). Styled with an accent color of primary gold and a manga-border track.

**Reusability**
Screen 3 (within FilterPanel). Could be reused in a meal-planning or weekly-prep context.

**Main props**
| Prop | Description |
|---|---|
| `min` | number (default `15`) |
| `max` | number (default `60`) |
| `value` | number |
| `onChange` | callback |
| `minLabel` | string (default `"15 MIN"`) |
| `maxLabel` | string (default `"60+ MIN"`) |

---

### MascotChiefBadge

**Purpose**
A branded identity badge representing the AI chef persona ("Mascot Chief"). Appears as a small floating card overlapping the hero image panel on the AI Suggestions screen. Contains a primary-colored icon box, a role label, and a tagline.

**Reusability**
Screen 2 (AI Suggestions, hero image panel bottom-right corner). Could be repurposed as a "Powered by AI" or "Chef's Pick" indicator on other screens.

**Main props**
| Prop | Description |
|---|---|
| `icon` | Material Symbol name (default `restaurant`) |
| `roleLabel` | string (e.g. `"Mascot Chief"`) |
| `tagline` | string (e.g. `"Zen Guidance"`) |
| `position` | `"absolute" \| "inline"` |

---

### ChapterLabel

**Purpose**
An editorial chapter/season marker used in the Archive header. Renders a small gold uppercase chapter number (e.g. "CHAPTER 08") with a horizontal gold rule below it. Reinforces the manga-publication metaphor of the design system.

**Reusability**
Screen 4 (Archive header). Low reusability in its exact form; the visual pattern could be adapted as a "Collection Vol. X" label on any curated content page.

**Main props**
| Prop | Description |
|---|---|
| `chapterNumber` | string (e.g. `"CHAPTER 08"`) |
| `ruleWidth` | string (default `"128px"`) |

---

### AISenseiLabel

**Purpose**
A small bordered badge that introduces the AI persona at the top of the AI Suggestions hero: "AI SENSEI SAYS: READY TO COOK?". Uses a secondary-color text and a thin border, rendered in JetBrains Mono uppercase at high letter-spacing.

**Reusability**
Screen 2 only (AI Suggestions hero).

**Main props**
| Prop | Description |
|---|---|
| `message` | string |
| `borderColor` | token (default `secondary`) |

---

## Component Reusability Summary

| Component | Screens | Reusability |
|---|---|---|
| TopNavBar | 1 2 3 4 5 6 | High |
| GlobalFooter | 1 2 3 4 5 6 | High |
| DietTabs | 1 2 3 4 6 | High |
| SectionHeader | 1 2 3 4 5 6 | High |
| PrimaryButton | 1 2 3 4 5 6 | High |
| MetaChip | 1 2 3 4 5 | High |
| RankBadge | 1 2 3 4 5 | High |
| ContentGrid | 1 2 4 5 6 | High |
| QuestCard | 1 5 | High |
| SearchInput | All (nav) 3 4 | High |
| Pagination | 3 4 | Medium |
| HalftoneOverlay | 2 3 4 | Medium |
| ArchiveQuestCard | 4 | Medium |
| SearchResultCard | 3 | Medium |
| AIMatchCard | 2 | Medium |
| FilterPanel | 3 | Medium |
| CuisineRealmFilter | 3 | Medium |
| DifficultyFilter | 3 | Medium |
| IngredientsPanel | 5 | Low |
| CookingStepsPanel | 5 | Low |
| RecipeVideoSection | 5 | Low |
| LuckyWheelCanvas | 6 | Low |
| FeaturedQuestCard | 3 | Low |
| IngredientInputPanel | 1 | Low |
| MascotImagePanel | 1 | Low |
| WheelMascotSprite | 6 | Low |
| ChapterLabel | 4 | Low |
| VerticalAccentText | 4 | Low |
