---
name: TiendaFlow
status: draft
updated: '2026-10-06'
---

# TiendaFlow — Experience Spine

Paired with `DESIGN.md` (monochromatic blue visual identity + dualtone icon system). This spine owns behavior; `DESIGN.md` owns look. Both win on conflict with any mock.

## Foundation

Mobile-first single-surface web app for Mexican small retailers, in Spanish. Next.js App Router; `(app)` layout wraps authenticated pages in a centered column (`max-w-md`, `lg:max-w-4xl`) with a fixed bottom `MobileNav`; the public `/catalogo` renders its own sticky header. `DESIGN.md` is the visual identity reference. Dark mode is a single-token surface swap: the toggle flips a `dark` class on `<html>`, every component reads its `-dark` twin — no component is authored twice.

## Information Architecture

| Surface | Reached from | Purpose |
|---|---|---|
| Inicio | `MobileNav` / `/` | Dashboard: ventas de hoy, alertas |
| Productos | `MobileNav` / `/productos` | Stock list, CRUD |
| Venta | `MobileNav` / `/venta` | Nueva venta (quick-sale) |
| Ventas | `MobileNav` / `/ventas` | Order history |
| Clientes | `MobileNav` / `/clientes` | Customers + WhatsApp channels |
| Gastos | `MobileNav` / `/gastos` | Expenses |
| Categorías | Productos → link | Category CRUD |
| Catálogo | Public `/catalogo` | Shareable storefront (no `MobileNav`) |

`MobileNav` carries 6 destinations plus a 7th slot: the **theme toggle** (moon/sun), right-aligned, never navigating.

## Voice and Tone

Microcopy. Brand voice lives in `DESIGN.md` Brand & Style.

| Do | Don't |
|---|---|
| "Sin ventas hoy" | "¡Aún no hay ventas! 🚀" |
| "Modo oscuro" (toggle `aria-label` when light) | "Cambiar tema" |
| "Guardado" | "Se han guardado los cambios exitosamente" |
| Toast errors in `danger`, plain words | Red screens of blame |

## Component Patterns

- **Theme toggle (behavioral spec)** — 7th `MobileNav` slot; renders Moon icon in light mode, Sun icon in dark, both `{components.dualtone-icon}` geometry. One tap flips the class on `<html>` immediately (no navigation, no reload). It is an icon-button, not a link: `role="switch"`, `aria-checked` mirrors dark state.
- **Dualtone icons** — visual spec in `DESIGN.md` Components; behaviorally, icons are decorative (`aria-hidden`) when beside a text label, carry `aria-label` when alone (the toggle is the one standalone exception).
- **Forms** — client `useTransition` around server actions; button shows `Check` icon on success and reverts after 1.5s.
- **Toast / status** — success and danger hues from `DESIGN.md` colors; only place non-blue appears.

## State Patterns

- **Theme: three states — `light` | `dark` | `system`.**
  - First visit: `system` — resolve `prefers-color-scheme` at boot.
  - The toggle switches between light and dark and **persists the explicit choice** to `localStorage["tiendaflow-theme"]`; it never writes `system` back (that requires long-press → menu, deferred as a non-blocker).
  - While stored value is `system`, a live change to the OS preference re-applies within the same session (`matchMedia` listener).
  - **No-flash rule:** an inline blocking script in the root layout reads `localStorage` and applies the `dark` class before first paint. Hydration must never render the wrong theme, even for one frame.
  - `color-scheme` CSS property follows the class so native form controls, scrollbars, and autofill match.
- **Nav active state** — derived from `pathname`; exact-match only.
- **Pending/optimistic** — `useTransition.isPending` disables submit buttons; no spinners under 300ms.

## Interaction Primitives

- Theme toggle: `click`/`tap` → instant class flip + persist. No animation delay; optional `prefers-reduced-motion`-respecting 150ms color transition on the icon only.
- Bottom nav: tap navigates; active item fills its icon (`fill-current`).
- All touch targets ≥ 44×44px (toggle included — pad the 2.5rem icon-button).

## Accessibility Floor

- Toggle: `role="switch"`, `aria-checked`, `aria-label="Modo oscuro"` (announce state, not action); reachable by keyboard in DOM order inside `MobileNav`; visible focus ring using `{colors.primary}`.
- Theme applied pre-paint (no-flash) — a photosensitive-flash and FOUC guard, not just polish.
- Contrast floors live in `DESIGN.md` Colors; dark mode must meet the same AA thresholds — re-check `{colors.ink-soft-dark}` on `{colors.surface-base-dark}` before ship.
- `prefers-reduced-motion` honored; `prefers-color-scheme` honored until the user overrides it.
- Standalone icons announce via `aria-label`; decorative ones are `aria-hidden="true"`.

## Key Flows

**Rocío closes the till at night (climax beat: theme persists).**
1. Rocío finishes her last sale at dusk; the phone is blinding in the dim shop.
2. She taps the moon icon — the 7th slot in the bottom bar, under her thumb — and the whole app swaps to dark in the same frame. *(climax)*
3. She navigates Ventas → Gastos; dark holds across every screen — she never sees a white flash.
4. She locks the phone. Tomorrow in daylight, opening the app: still dark — her explicit choice persisted in `localStorage`.
5. Only when she long-presses nothing, chooses nothing more: `system` returns only via storage clear — documented, intentional.

## Open Questions

- `[NOTE FOR UX]` Long-press menu for the `system` option (3-state) — deferred, non-blocking; shipped behavior is 2-state with `system` as the untouched default.
- `[ASSUMPTION]` `/catalogo` (public storefront) inherits the visitor's `system` preference with no toggle — it is a customer surface, not an operator console.
