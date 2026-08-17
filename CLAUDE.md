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
  full-width image (`public/images/hero-banner-full.png`, 1536×1024) with the
  headline baked into the graphic instead of separate eyebrow/h1/subtitle DOM
  text. This is an AI-generated example banner the user supplied directly,
  used as-is at their explicit call — it includes its own baked-in "R FRUITS"
  cartoon logo mark, which sits alongside the real header wordmark logo rather
  than replacing it; this is a known, deliberate inconsistency the user chose
  to keep, not an oversight. Swap for real photography/graphic design later.
  Because the headline text lives inside the image, a real
  `<h1 className="sr-only">` with the same copy stays in the DOM for
  accessibility/SEO, and the `<Image>` gets full descriptive `alt` text —
  don't drop either when touching this component.
- **CTA glass panel**: the button row + trust checklist sit inside a
  `bg-cream/55 backdrop-blur-md rounded-3xl` panel rather than plain page
  background — CSS glassmorphism, not another embedded image, so it doesn't
  duplicate the `cta-frame.png` texture already filling the section behind it.
  Button styling itself (pill shape, green-700/outline fills) is unchanged.
  Don't generalize this glass-panel treatment to other buttons site-wide —
  it's a hero-specific flourish, not a new default button treatment.

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
