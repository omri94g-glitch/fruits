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
- Serif (`--font-serif`, Frank Ruhl Libre): logo wordmark, all headings (h1–h3).
  Weight 400–500. Tight leading (`leading-tight`).
- Sans (`--font-sans`, Assistant): everything else — nav, body copy, buttons,
  labels, prices, form inputs.
- **Eyebrow label** pattern (e.g. "PREMIUM FRUIT PLATTERS", "Best Sellers"):
  uppercase Latin, `text-xs`, `tracking-[0.25em]`, `text-gold`. Always sits
  directly above a serif heading.
- Scale: eyebrow `12px` · body/nav `14–15px` · section heading (h2) `28–32px`
  serif · hero h1 `36–48px` serif · price/meta `13–14px` regular ink (not muted).

## Spacing & layout
- Container: `max-w-7xl` (7xl for storefront width, `max-w-6xl` for admin,
  `max-w-2xl`–`max-w-4xl` for single-column forms like checkout/login).
- Section vertical rhythm: `py-16` between major homepage sections; `py-10` for
  tighter bands (feature strip); consistent — don't mix arbitrary values.
- Card/grid gap: `gap-6` for product grids, `gap-4` for tight lists.

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
- **Product card**: image wrapped in a single `Link` (`rounded-2xl overflow-hidden`),
  CTA pill absolutely positioned over the image bottom edge. Below `lg`, CTA is
  always visible (no hover on touch). At `lg`+, CTA starts `opacity-0
  translate-y-2` and reveals on `group-hover`, image gets a subtle
  `group-hover:scale-105`. Name + price sit below the image, always visible,
  both `text-ink` (price is not muted — see Color tokens).
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
- **Product cards reveal their CTA on hover** (desktop) instead of an
  always-visible button under every image. This is also a meaningful
  interaction-model difference from the reference, not just a color change.

## RTL specifics
- Root `<html dir="rtl" lang="he">`. Mixed Latin/number strings (phone, email,
  order numbers, `@handle`) must be wrapped in `dir="ltr"` — otherwise the bidi
  algorithm visually reverses them (e.g. `@rfruits` → `rfruits@`). This bit us
  once already; check any new Latin/numeric fragment embedded in Hebrew flow.
