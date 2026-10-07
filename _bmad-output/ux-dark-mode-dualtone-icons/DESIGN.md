---
name: TiendaFlow
description: Dark-mode visual identity for the TiendaFlow mobile operating system — a dualtone icon system on a monochromatic blue palette (#BDDDFC · #88BDF2 · #384959).
status: draft
updated: '2026-10-06'

colors:
  # Monochromatic blue system. Anchor trio: #BDDDFC (light) · #88BDF2 (mid) · #384959 (deep).
  # Success/danger are the ONLY non-blue hues — badges and toasts, nothing else.
  surface-base: '#FCFDFF'
  surface-soft: '#F0F6FE'
  surface-line: '#BDDDFC'
  ink: '#384959'
  ink-soft: '#5A6B7E'
  ink-faint: '#8A97A6'
  primary: '#88BDF2'
  primary-deep: '#5E9BD9'
  primary-soft: '#CFE6FD'
  success: '#3F8E63'
  danger: '#C0574F'
  surface-base-dark: '#1E2730'
  surface-soft-dark: '#273340'
  surface-line-dark: '#46586C'
  ink-dark: '#EAF3FE'
  ink-soft-dark: '#9FC7F6'
  ink-faint-dark: '#6E87A6'
  success-dark: '#6BC495'
  danger-dark: '#E98A83'

typography:
  display:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: '2rem'
    fontWeight: '700'
    lineHeight: '1.1'
  heading:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: '1.125rem'
    fontWeight: '600'
    lineHeight: '1.25'
  body:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: '0.9375rem'
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: '0.75rem'
    fontWeight: '500'
    lineHeight: '1.33'
  mono:
    fontFamily: 'JetBrains Mono, ui-monospace, monospace'
    fontSize: '0.8rem'
    fontWeight: '500'
    lineHeight: '1.4'

rounded:
  DEFAULT: '0.5rem'
  sm: '0.375rem'
  md: '0.5rem'
  lg: '0.75rem'
  xl: '1rem'
  '2xl': '1.5rem'
  '3xl': '2rem'
  full: '9999px'

spacing:
  '0': '0'
  '1': '0.25rem'
  '2': '0.5rem'
  '3': '0.75rem'
  '4': '1rem'
  '5': '1.25rem'
  '6': '1.5rem'
  '8': '2rem'
  '10': '2.5rem'
  '12': '3rem'
  gutter: '1rem'
  section: '2rem'

components:
  icon-button:
    size: '2.5rem'
    rounded: '{rounded.full}'
    color: '{colors.ink-soft}'
    color-hover: '{colors.ink}'
    color-active: '{colors.primary}'
  icon-button-dark:
    size: '2.5rem'
    rounded: '{rounded.full}'
    color: '{colors.ink-soft-dark}'
    color-hover: '{colors.ink-dark}'
    color-active: '{colors.primary}'
  toggle-track:
    light: '{colors.surface-soft}'
    dark: '{colors.surface-soft-dark}'
  toggle-thumb:
    light: '{colors.primary}'
    dark: '{colors.primary}'
  # Dualtone = exactly two inks per icon: a dark structural stroke (#384959)
  # and a light-blue filled body (#BDDDFC). #88BDF2 carries the accent detail
  # (badges, notification dots, active highlights). Never a third hue.
  dualtone-icon:
    stroke: '{colors.ink}'
    stroke-dark: '{colors.ink-dark}'
    fill: '{colors.surface-line}'
    fill-dark: '{colors.surface-line-dark}'
    accent-stroke: '{colors.primary}'
    accent-stroke-dark: '{colors.primary}'
    stroke-width: '1.75'
    stroke-linecap: 'round'
    stroke-linejoin: 'round'
  card:
    light: '{colors.surface-base}'
    light-ring: '{colors.surface-line}'
    dark: '{colors.surface-base-dark}'
    dark-ring: '{colors.surface-line-dark}'
  stat-card:
    icon-bg-light: '{colors.primary-soft}'
    icon-bg-dark: '{colors.surface-soft-dark}'
  primary-button:
    light: '{colors.primary}'
    light-hover: '{colors.primary-deep}'
    light-label: '{colors.ink}'
    dark: '{colors.primary}'
    dark-hover: '{colors.primary-deep}'
    dark-label: '{colors.ink}'
  gradient-hero:
    light: 'linear-gradient(135deg, {colors.primary} 0%, {colors.primary-soft} 100%)'
    dark: 'linear-gradient(135deg, {colors.primary-deep} 0%, {colors.primary} 100%)'

# Dark mode is a single-token surface swap, not a separate design system.
# Every component above carries a `-dark` twin; the toggle flips the whole
# tree via a class on <html>, so no component is authored twice.
# Status hues (success #3F8E63 / danger #C0574F, lighter twins in dark mode)
# are quarantined to toasts and badges — they never touch chrome, icons, or nav.
---

## Brand & Style

TiendaFlow is a calm, monochromatic operating system for small Mexican retailers. One hue — a sky blue running from `#BDDDFC` to `#88BDF2` against deep slate `#384959` — carries the entire interface. The feeling: a well-organized ledger under clear daylight. Restrained, trustworthy, unfussy; nothing on screen competes for attention except the data itself.

## Colors

Every surface, stroke, and label derives from three anchors. No fourth hue enters the chrome.

| Role | Light | Dark | Use |
| --- | --- | --- | --- |
| Anchor light | `#BDDDFC` | `#EAF3FE` (ink) | Borders, dividers, dualtone icon bodies |
| Anchor mid | `#88BDF2` | `#88BDF2` | Primary actions, active nav, icon accents |
| Anchor deep | `#384959` | `#1E2730` | Body ink, deep surfaces |
| surface-base | `#FCFDFF` | `#1E2730` | Page / card background |
| surface-soft | `#F0F6FE` | `#273340` | Recessed areas, inputs, icon chips |
| surface-line | `#BDDDFC` | `#46586C` | 1px borders, card rings, icon fills |
| ink / ink-soft / ink-faint | `#384959` / `#5A6B7E` / `#8A97A6` | `#EAF3FE` / `#9FC7F6` / `#6E87A6` | Text hierarchy |
| primary / primary-deep / primary-soft | `#88BDF2` / `#5E9BD9` / `#CFE6FD` | same | Buttons, links, chart series, active states |
| success · danger (quarantined) | `#3F8E63` · `#C0574F` | `#6BC495` · `#E98A83` | Toasts and status badges ONLY |

**Combination rules**

- Stacked monochromatic steps build depth: a `surface-base` card on a `surface-soft` section, ringed by `surface-line`.
- Primary buttons use `primary` fill with `ink` (`#384959`) label — dark-on-mid contrast, never white.
- Charts use only the blue ramp: `primary` for the focus series, `primary-soft` for context series, `surface-line` for gridlines, `ink-faint` for axis labels.
- `success` / `danger` are semantic exceptions, banned from navigation, icons, cards, and decoration.

## Typography

Unchanged from tokens: Inter for display/heading/body/label, JetBrains Mono for SKUs and tabular figures. Type stays neutral so the monochrome palette reads as intentional system, not decoration.

## Layout & Spacing

The scale in tokens (`gutter: 1rem`, `section: 2rem`). Single-column mobile-first flow; 8px rhythm.

## Elevation & Depth

Depth comes from the lightness ladder, not shadows: `surface-soft` wells inside `surface-base` cards with `surface-line` rings. Shadows, where unavoidable (dropdowns, modal), are the deep anchor at low alpha — never neutral black: `0 8px 24px rgba(56, 73, 89, 0.12)` light, `rgba(0,0,0,0.45)` dark.

## Shapes

Rounded scale from tokens (default `0.5rem`, cards `0.75rem`, pills `full`).

## Components

- **Dualtone icons** — every icon renders in exactly two inks: a `#384959` (dark: `#EAF3FE`) structural stroke at `1.75px` round-cap, and a `#BDDDFC` (dark: `#46586C`) filled body. `#88BDF2` marks the single accent detail (badge dots, active indicators). Never a third hue inside an icon. Lucide geometry supplies the stroke; the filled body is a two-layer composition, not a recolor.
- **Icon chips** — stat-card icons sit on `primary-soft` (light) / `surface-soft-dark` (dark) rounded squares, framing the dualtone treatment.
- **Primary button** — `primary` fill, `ink` label, `primary-deep` hover; dark twin identical.
- **Toggle** — `surface-soft`/`surface-soft-dark` track, `primary` thumb when on.
- **Cards** — `surface-base` with `surface-line` ring (dark: `surface-line-dark`).
- **gradient-hero** — `primary` → `primary-soft` light; `primary-deep` → `primary` dark.

## Do's and Don'ts

- **Do** build hierarchy from the three blue anchors and their steps.
- **Do** keep dualtone icons at exactly two inks plus one `#88BDF2` accent detail.
- **Do** use `success`/`danger` only in toasts and status badges.
- **Don't** introduce any fourth hue — no amber accents, no indigo, no warm neutrals.
- **Don't** use white text on `primary`; use `ink` (`#384959`).
- **Don't** use pure black or neutral gray shadows, borders, or icon fills.
- **Don't** render icons single-tone — chrome icons are always the dualtone pair.