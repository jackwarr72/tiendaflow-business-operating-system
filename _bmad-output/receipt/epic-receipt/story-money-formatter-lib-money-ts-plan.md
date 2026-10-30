---
title: 'Money formatter (lib/money.ts)'
type: 'feature'
ticket: '1'
created: '2026-10-07'
status: 'built'
baseline_revision: '68078761d5a8e8718932a01696571a5e1ec54ae7'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** No centralized money formatting exists. Receipt exports (PDF, CSV) and UI need consistent MXN formatting with 2 decimals using es-MX locale to prevent currency drift.

**Approach:** Create `src/lib/money.ts` with a `formatMXN(n: number | string)` function that returns MXN-formatted string (e.g., `$ 1,234.50`). Used by all receipt exports and UI.

## Boundaries & Constraints

**Always:**
- Single export: `formatMXN` function
- Uses `es-MX` locale, 2 decimal places, MXN currency
- Accepts `number | string` input (Drizzle returns numeric as string)
- Returns formatted string like `$ 1,234.50`

**Never:**
- No inline `toLocaleString` in receipt code (AD-4)
- No other currency support (es-MX only per Deferred)
- No locale configuration

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy path number | `1234.5` | `$ 1,234.50` | No error |
| Happy path string | `'99.9'` | `$ 99.90` | No error |
| Zero | `0` | `$ 0.00` | No error |
| Integer string | `'100'` | `$ 100.00` | No error |
| Large number | `1234567.89` | `$ 1,234,567.89` | No error |
| Invalid string | `'abc'` | Throws / returns `$ NaN` | Let JS handle (invalid input not expected) |

</frozen-after-approval>

## Tasks & Acceptance

**Execution:**
- [ ] `src/lib/money.ts` -- Create file with `formatMXN` function -- Centralized MXN formatter per AD-4

**Acceptance Criteria:**
- Given `formatMXN(1234.5)`, when called, then returns `$ 1,234.50`
- Given `formatMXN('99.9')`, when called, then returns `$ 99.90`
- Given `formatMXN(0)`, when called, then returns `$ 0.00`
- File exports only `formatMXN`
- TypeScript compiles without errors
- `npm run typecheck` passes

## Implementation Notes

Simple utility module. One function. No dependencies. Used by receipt HTML page, CSV route, PDF route, and any UI components displaying currency.

## Verification

**Commands:**
- `npm run typecheck` -- expected: passes (no TypeScript errors)
- `npm run lint` -- expected: passes (no ESLint errors)

**Manual checks (if no CLI):**
- Inspect `src/lib/money.ts` — exports single `formatMXN` function
- Test in console: `formatMXN(1234.5) === '$ 1,234.50'`

## Review Triage Log

- **quick** — No findings. All acceptance criteria met. Implementation matches intent exactly. TypeScript and lint (for new file) pass. Pre-existing lint errors in unrelated files unchanged.