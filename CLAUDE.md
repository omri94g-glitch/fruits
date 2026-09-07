@AGENTS.md

# Rfruits Design System

Extracted from `design-reference/homepage-reference.jpg` by sampling actual pixel
values (not guessed) — a warm, elegant, editorial fruit-platter brand. RTL Hebrew
throughout. Treat this file as the source of truth for styling: don't invent new
colors, radii, or type sizes outside this scale.

## Brand feel
Elegant, handmade, premium — not a generic SaaS/e-commerce look. Warm off-white
paper tones, near-black ink (never pure gray), a single confident dark-olive
accent for action, muted antique gold used sparingly for eyebrow labels and
dividers. Generous whitespace. Soft, thin-stroke icons, never filled/bulky.

## Color tokens
Defined as CSS variables in `src/app/globals.css` under `--color-*`, exposed to
Tailwind via `@theme inline`. Always use the token (`bg-cream`, `text-ink`, etc.),
never a raw hex in a component.

Tailwind utility names match the variable name minus `--color-` (e.g.
`--color-cream-alt` → `bg-cream-alt`).

| Token | Hex | Usage |
|---|---|---|
| `--color-cream` | `#FBF9F6` | Page background (near-white, warm) |
| `--color-cream-alt` | `#F5F0EA` | Card/alt-section background (feature strip, footer top band, placeholders) |
| `--color-hero` | `#EEE6DC` | Hero-only warm backdrop tint |
| `--color-ink` | `#1B1D14` | Headings, product titles, prices, body — the one dark text color |
| `--color-ink-muted` | `#6E6F5E` | Secondary/tertiary text only (subtitles, captions, helper text) — never for prices or titles |
| `--color-green-900` | `#1F2117` | Darkest surface: utility bar, footer background |
| `--color-green-700` | `#333C1E` | Primary action fill: buttons, active nav underline, filled badges |
| `--color-green-600` | `#465021` | Hover state for green-700 (lighter, not darker) |
| `--color-gold` | `#B0873F` | Eyebrow labels, star ratings, dividers, small accents only — never large fills |
| `--color-gold-soft` | `#E4C989` | Rare tint use (badge bg), not text |
| `--color-line` | `#E5DFD2` | Hairline borders: inputs, tables, dividers — product cards use shadow, not border |

Hierarchy comes from **size and weight**, not from graying out text. A price is
the same ink color as a heading, just smaller/regular-weight.

## Typography
- Serif (`--font-serif`, David Libre): logo wordmark, all headings (h1–h3).
  Weight 400–500, occasional 700 for standout emphasis. Tight leading
  (`leading-tight`) plus a touch of letter-spacing (`.font-serif { letter-spacing:
  0.012em }` in `globals.css`) — David Libre's warmer, rounder ductus reads more
  boutique/heritage than a literary book-serif, and the added tracking gives
  headings a more delicate, editorial quality at display sizes. Replaced Frank
  Ruhl Libre in a deliberate typography refresh — don't revert.
- Sans (`--font-sans`, Rubik): everything else — nav, body copy, buttons,
  labels, prices, form inputs. Rubik's soft, rounded terminals feel warmer and
  more "designed" than a neutral grotesque, matching the handmade/premium brand
  feel while staying highly legible for Hebrew UI text. Replaced Assistant in
  the same refresh.
- **Eyebrow label** pattern (e.g. "PREMIUM FRUIT PLATTERS", "Best Sellers"):
  uppercase Latin, `text-xs`, `tracking-[0.25em]`, `text-gold`. Always sits
  directly above a serif heading.
- Scale: eyebrow `12px` · body/nav `14–15px` · section heading (h2) `28–32px`
  serif · hero h1 `36–48px` serif · price/meta `13–14px` regular ink (not muted).

## Spacing & layout
- Container: `max-w-7xl` (7xl for storefront width, `max-w-6xl` for admin,
  `max-w-2xl`–`max-w-4xl` for single-column forms like checkout/login).
- Section vertical rhythm: `py-12` between major homepage sections; `py-10` for
  tighter bands (feature strip, occasion nav, final CTA); consistent — don't mix
  arbitrary values. Tightened from an earlier `py-16`/`py-14` pass — the
  original rhythm read as too much dead air between sections on both mobile
  and desktop.
- Card/grid gap: `gap-6` for product grids, `gap-4` for tight lists.
- **Horizontal-row pattern, shared by OccasionNav and BestSellers**: both
  sections use the same structure — below `sm`, a horizontally swipeable flex
  strip (`flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4
  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`, each item `shrink-0
  w-32` for occasions / `w-44` for product cards); from `sm` up, **every item
  stays on one row, no wrapping**. This is a deliberate, explicit user
  requirement — items must stay in a single row on desktop and be swipeable
  on mobile, regardless of resulting card size. An earlier attempt capped
  both at 3 columns to match card *scale* between sections and the user
  rejected it hard; a later attempt used a fixed `lg:grid-cols-N` (5 for
  occasions, 6 for products) sized to the *expected* item count, which
  worked for OccasionNav (exactly 5 hardcoded occasions, always matches) but
  broke centering for BestSellers, whose item count is a live DB query
  (`isBestSeller` products, currently 5 but could become 1–6) — with fewer
  items than grid columns, `grid-cols-N`'s unfilled 1fr track sits empty on
  one side rather than shrinking, so the row reads as shoved toward the
  RTL start (right) instead of centered. **OccasionNav** (fixed 5-item array)
  keeps the simple grid: `sm:grid-cols-3 lg:grid-cols-5`. **BestSellers**
  (dynamic count) instead uses `sm:flex-wrap sm:justify-center sm:gap-6` on
  the container with each item sized `sm:w-[calc(33.333%-1rem)]
  lg:w-[calc(16.666%-1.25rem)]` — flex-basis-style percentage widths center
  correctly no matter how many products actually render, so this doesn't
  need revisiting if the best-seller count changes. When adding a new
  single-row section with a *fixed*, hardcoded item list, the simple grid is
  fine; when the count comes from a query, use this flex + justify-center +
  percentage-width pattern instead, not `grid-cols-N`. `BestSellers.tsx`
  wraps each `<ProductCard>` in a sized `<div>` for this — don't move that
  sizing into `ProductCard` itself, since it's also used full-width
  elsewhere (e.g. `/products` listing grid).
- **Hero section background**: `Hero.tsx` has a full-bleed `fixed inset-0
  -z-10` background layer — a marble/fruit-corner photo
  (`public/images/cta-frame.png` on `sm:` and up, `public/images/hero-bg-
  mobile.png`, a portrait crop, below `sm`), both user-supplied AI graphics
  used uncropped per their standing preference. It's truly viewport-`fixed`
  (static, doesn't scroll with the page) at the user's explicit request —
  not `absolute`/section-scoped. This is the one deliberate departure from
  the otherwise fully neutral cream/ink/green/gold palette, added because the
  site read as too monochrome without it. **Because it's `fixed`, every
  section that can scroll past it needs its own opaque background** or the
  image bleeds through — `(storefront)/page.tsx` wraps everything after
  `<Hero />` in a single `<div className="relative bg-cream">`, and
  `Header`/`Footer` already carry their own opaque backgrounds (`bg-cream`
  sticky header, `bg-green-900` footer) so they mask it too. If you add a new
  top-level section to the homepage, make sure it's covered by that wrapper.
  Keep photographic color accents contained to this backdrop, never as a fill
  on text, buttons, or UI chrome elsewhere — those stay on the disciplined
  token palette above.
- **Hero banner image**: inside that section, `Hero.tsx` renders one
  full-width image (`public/images/hero-banner-v2.png`, 1930×815, true alpha
  transparency, headline "מגשי פירות מעוצבים לכל אירוע") with the headline
  baked into the graphic instead of separate eyebrow/h1/subtitle DOM text —
  only the logo/fruit-corner/text artwork is opaque, so the fixed
  `cta-frame.png`/`hero-bg-mobile.png` background behind it shows through and
  the two read as one continuous backdrop instead of a card sitting on a
  card. Superseded an earlier version (`hero-banner-transparent.png`, deleted,
  headline "מגש פירות שהופך כל רגע לחגיגה") the same way: the user's source
  export had a plain flat-white (this round) or checkerboard (first round)
  background baked into ordinary RGB pixels with no real alpha channel
  (confirmed via PIL — `sips`/most viewers render white or a checkerboard for
  missing alpha, so don't assume a "transparent" export actually has one); we
  regenerate true transparency by color-keying out the near-neutral,
  high-brightness background pixels (`spread<=4 & min>=225`) and leave
  everything else — including whites inside the artwork like watermelon rind
  — opaque. Expect this banner to keep changing as the user iterates on
  copy/art — repeat this same verify-then-color-key routine each time, don't
  assume a later export finally has real alpha. If a "transparent" export ever
  looks wrong once wired in, check for an alpha channel before trusting it.
  The image includes its own baked-in "R.FRUITS" cartoon logo mark, which sits
  alongside the real header wordmark logo rather than replacing it; this is a
  known, deliberate inconsistency the user chose to keep, not an oversight.
  Swap for real photography/graphic design later. Because the headline text lives
  inside the image, a real `<h1 className="sr-only">` with the same copy
  stays in the DOM for accessibility/SEO, and the `<Image>` gets full
  descriptive `alt` text — don't drop either when touching this component.
- **CTA buttons sit directly on the fixed background** — no card/panel behind
  them (an earlier `bg-cream/55 backdrop-blur-md` glass panel was removed at
  the user's request to strip opaque white backgrounds from the hero).
  Button styling itself (pill shape, green-700/outline fills) is unchanged
  and stays legible directly against the light marble backdrop.
- **Image-as-heading pattern**: `OccasionNav.tsx`'s "לאיזה רגע אתם מזמינים?"
  heading is `public/images/occasion-heading-v2.png` (transparent PNG, same
  script-serif calligraphy style as the hero banner text, now with a small
  green leaf-and-line divider baked in below the text) instead of DOM text —
  the user is standardizing section headings on this hand-lettered style
  rather than `font-serif` CSS text. Same accessibility pattern as the hero:
  a real `<h2 className="sr-only">` with the same copy stays in the DOM,
  image gets `alt=""` since it's redundant with the sr-only heading. If more
  section headings get this treatment, keep this pattern (sr-only heading +
  decorative image) rather than dropping the semantic heading. This is v2 of
  the asset (aspect ratio changed from ~8:1 to ~3.17:1 once the divider was
  added — `width`/`height` props on the `<Image>` were updated to match, and
  the rendered height at the same `max-w-*` is proportionally taller now,
  which is expected, not a regression). `BestSellers.tsx` got the same
  treatment for its "Best Sellers" eyebrow label —
  `public/images/best-sellers-heading-v2.png`, same leaf-divider style,
  `alt="Best Sellers"`. The real `<h2>` below it ("המגשים שהלקוחות שלנו הכי
  אוהבים") was originally visible DOM text but the user asked to remove it
  for a cleaner look — it's now `sr-only` rather than deleted outright
  (same accessibility pattern as the hero/occasion headings: keep a real
  heading in the DOM for a11y/SEO even when nothing about it is visible).
  Don't delete this `sr-only` heading entirely if asked to "clean up" this
  section further — hide it further only by adding to `sr-only`'s existing
  clip/absolute-position technique, never by removing the element. **All
  these hand-lettered heading images
  should read as the same visual weight** — the user explicitly rejected an
  earlier attempt to size this one much smaller (`max-w-[140px..190px]`) on
  the theory that an eyebrow label should stay visually subordinate to a real
  heading; every section's image should look equally prominent regardless of
  whether DOM text sits below it. The subtlety: matching **width** isn't the
  same as matching **visual size** when two exported assets have different
  aspect ratios (occasion-heading-v2 is ~3.17:1, best-sellers-heading-v2 is
  ~2.80:1) — same `max-w-md` width left best-sellers rendering visibly taller
  (159.7px vs 141.3px), which read as "bigger" even though the widths were
  identical. What actually needs to match is rendered **height**: occasion
  nav's image stays the reference (`max-w-xs sm:max-w-sm md:max-w-md`
  = 320/384/448px), and `best-sellers-heading-v2.png` is scaled down to
  `max-w-[280px] sm:max-w-[335px] md:max-w-[395px]` (~88% width) to land at
  the same ~141px rendered height. When adding a new heading image to this
  pattern, don't just copy the `max-w-xs/sm/md` classes — measure its
  rendered height at that width against the occasion-nav reference and scale
  its own `max-w-[...]` proportionally if the aspect ratio differs. Expect
  more labels site-wide to get swapped to this same image treatment over
  time.
- **`HowItArrives.tsx` ("SEE THE REAL THING")**: this one image
  (`public/images/see-real-thing-heading.png`) replaces **two** DOM text
  elements at once — the eyebrow (`span`, "See The Real Thing") and the
  paragraph below the heading ("תמונות אמיתיות מהזמנות שיצאו מאיתנו - בדיוק
  מה שתקבלו.") — because the user's source graphic bakes both pieces of text
  together into one image. The middle `<h2>` ("ככה זה מגיע אליכם") sits
  between those two in the DOM/copy but is **not** part of the graphic at
  all; it stays `sr-only` (not deleted) per the established pattern, and the
  `<Image>` gets a descriptive `alt` combining both replaced text pieces
  since there's no separate sr-only element for them. If a future image
  bakes together multiple adjacent text elements like this, look for which
  DOM elements it actually replaces content-wise (by reading the image, not
  by assuming 1 image = 1 element) rather than guessing from position alone.
- **`Reviews.tsx` ("לקוחות מספרים" / "מה אומרים עלינו")**:
  `public/images/reviews-heading.png` replaces both the eyebrow (`span`,
  "לקוחות מספרים") and the real `<h2>` ("מה אומרים עלינו") — unlike
  `HowItArrives`, here the image bakes in the *heading itself*, not a
  paragraph, so the `<h2>` becomes `sr-only` (not deleted) rather than
  staying visible between two image pieces. The honest empty-state paragraph
  ("אנחנו אוספים ביקורות מלקוחות...") is unrelated dynamic content (not part
  of the graphic) and stays untouched as real, visible DOM text — never
  fold real/conditional copy like that into a decorative image, only
  static labels/headings.
- **"Transparent" AI exports need verification, not trust — but don't assume
  they're always fake either**: most transparent-background images the user
  has supplied so far (both hero banners, the first occasion heading)
  actually shipped as flat RGB with a checkerboard or flat-white background
  baked into the pixels, not a real alpha channel. But `occasion-heading-v2`
  came through with genuine `RGBA` and a real alpha spread (checked via PIL:
  `img.mode`, and the fraction of pixels at alpha 0 vs 255 vs partial) — so
  the fix isn't "always rebuild it," it's "always check first." `sips -g
  hasAlpha` or PIL (`img.mode` / `'transparency' in img.info`, then actually
  inspect the alpha channel's value distribution, not just its presence) will
  show the truth in two seconds. Before wiring in any "transparent"
  user-supplied PNG, check for real alpha first; only if it's fake, rebuild it
  by color-keying out the near-neutral, high-brightness checkerboard pixels
  (this repo's working
  threshold: `spread(max-min per pixel) <= 4` and `min-channel >= 225`), then
  verify by compositing onto a solid color and visually checking for holes in
  the real artwork before shipping.

## Radius & elevation
- **Pill** (`rounded-full`): every button, category filter chip, status badge,
  icon-circle badge. This is the single most distinctive shape in the brand —
  never use a smaller radius on an interactive control.
- **Card** (`rounded-2xl`, ~16px): product cards, info panels, form containers.
- Cards use a soft shadow (`shadow-sm`) or no border at all on white — reserve
  `border border-line` for inputs/tables, not product cards.

## Components
- **Primary button**: `rounded-full bg-green-700 text-cream` → hover
  `bg-green-600`. Generous horizontal padding (`px-8`), pill height `py-3`.
- **Secondary/outline button**: `rounded-full border border-green-700
  text-green-700` → hover fills solid (`hover:bg-green-700 hover:text-cream`).
- **Icon badge** (hero trust badges): icon inside a `rounded-full bg-cream-alt`
  circle, ~44px, icon in `text-ink` (icons follow the ink rule too — green is
  reserved for interactive elements, not decorative iconography).
- **Plain icon row** (feature strip lower on page): icon + label, no circle
  background — this contrast with the hero badges is intentional, keep it.
- **Product card** (CRO pass, supersedes the earlier hover-reveal version):
  image, gold badge (top-right corner, e.g. "הנמכר ביותר") when present, name,
  1-line description, serves label, price (always visible, `text-ink`, never
  hidden), then a **bold always-visible** `bg-green-700` pill CTA
  ("בחרו גודל והזמינו") below the card — opens `QuickOrderModal`, does not
  navigate. Conversion clarity wins over the earlier hover-only affordance.
- **Quick-order modal / cart drawer**: cart is a slide-out drawer
  (`CartDrawer`, left-anchored) opened from the header cart button, not a page
  navigation — `/cart` still exists as a fallback route reusing the same
  `CartItemsList`. Adding a product opens `QuickOrderModal` first (size+serves,
  qty, delivery date/city, greeting, add-ons, live total) which writes into
  cart-level shared delivery fields, then opens the drawer.
- **Nav active state**: `text-green-700 font-medium` plus a `2px` green-700
  underline — not a background pill.
- **Category/status filter chip**: pill, active = solid `bg-green-700
  text-cream`; inactive = `border border-line text-ink-muted`.
- Icons: `lucide-react`, thin stroke (default strokeWidth), 14–22px depending
  on context. No filled icon styles. Brand icons (Instagram/Facebook) come from
  `components/ui/brand-icons.tsx`, not lucide (lucide dropped brand marks).

## Accessibility
- Body text and buttons meet WCAG AA (ink `#1B1D14` on cream `#FBF9F6` is
  ~15:1; cream text on green-700 is ~8:1).
- Every icon-only control has `aria-label`.
- Focus states: `focus:ring-1 focus:ring-green-700` on all inputs — never
  remove outline without a replacement.
- Interactive targets stay ≥40px tall on mobile (buttons, filter chips).

## Original vs. reference — don't re-copy these back
The reference screenshot is a **principles source**, not a layout to mirror.
Two deliberate departures exist specifically so the site doesn't read as a
clone — don't "fix" these back toward the reference:
- **Header is a single row**, not split-nav-around-a-centered-logo. Logo
  anchors the start (right), all nav links sit together beside it, cart +
  mobile-menu toggle sit at the end (left). The reference's center-logo split
  layout is a distinctive, recognizable pattern — avoid reintroducing it.
- **Product cards use a bold always-visible CTA** ("בחרו גודל והזמינו") that
  opens a quick-order modal — chosen deliberately for conversion clarity in
  the CRO pass (an earlier hover-reveal version was tried first and reverted).

## Never fabricate business content
Reviews, customer/order counts, delivery zones, kashrut/allergen certification,
and stock/urgency counters must reflect **real** data only — never invented.
The `Review` model ships with zero seed rows on purpose; `Reviews.tsx` renders
an honest "אוספים ביקורות" empty state until real approved reviews exist.
Product `allergensInfo`/`kosherInfo` use an explicit "יעודכן בקרוב" placeholder,
never an implied certification. If asked for urgency messaging, use a generic
honest line ("מומלץ להזמין מראש...") — no fake countdowns/stock unless backed
by a real inventory system.

## RTL specifics
- Root `<html dir="rtl" lang="he">`. Mixed Latin/number strings (phone, email,
  order numbers, `@handle`) must be wrapped in `dir="ltr"` — otherwise the bidi
  algorithm visually reverses them (e.g. `@rfruits` → `rfruits@`). This bit us
  once already; check any new Latin/numeric fragment embedded in Hebrew flow.
