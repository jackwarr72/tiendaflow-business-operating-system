---
title: 'Receipt data contract (app/recibo/types.ts)'
type: 'feature'
ticket: '2'
created: '2026-10-07'
status: 'built'
baseline_revision: '7bfb6f6bc3de6d33eabdf0a7e04714016611b6a5'
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

**Problem:** No shared type contract exists for receipt data. The HTML page, CSV export, and PDF export all need the same Receipt shape to prevent inconsistent columns, date formats, and currency formatting across exports (AD-5).

**Approach:** Create `src/app/recibo/types.ts` defining `Receipt`, `ReceiptItem`, `StoreRef`, `CustomerRef`, `PaymentRef` types. Receipt includes folio (ORD-<id>), store, customer, items[], totals (subtotal, total, paid), payment status, generatedAt.

## Boundaries & Constraints

**Always:**
- Single source of truth for receipt data shape
- Types only — no runtime logic
- Folio format: `ORD-${orderId}` (string)
- Money fields as `number` (raw, not formatted) — formatting via `lib/money.ts` at consumption
- Dates as ISO-8601 strings (`generatedAt`)
- Exports: `Receipt`, `ReceiptItem`, `StoreRef`, `CustomerRef`, `PaymentRef`

**Never:**
- No formatted currency strings in types (raw numbers only)
- No locale-dependent formats in types
- No business logic in types file

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Type usage | Import types in actions.ts, page.tsx, CSV route, PDF route | All consumers share identical shape | TypeScript enforces |
| Receipt with customer | Customer exists | `customer` populated with name, phone, email | — |
| Receipt without customer | Customer null (walk-in) | `customer` is `null` | — |
| Empty items | Order has no items | `items: []` | Valid per schema (FK set null) |

</frozen-after-approval>

## Tasks & Acceptance

**Execution:**
- [ ] `src/app/recibo/types.ts` -- Create file with Receipt, ReceiptItem, StoreRef, CustomerRef, PaymentRef types -- Centralized receipt data contract per AD-5

**Acceptance Criteria:**
- File exports `Receipt`, `ReceiptItem`, `StoreRef`, `CustomerRef`, `PaymentRef` types
- `Receipt` includes: `folio` (string), `store` (StoreRef), `customer` (CustomerRef | null), `items` (ReceiptItem[]), `totals` (subtotal, total, paid as numbers), `paymentStatus` (string), `generatedAt` (ISO string)
- `ReceiptItem` includes: `productName` (string), `quantity` (number), `unitPrice` (number), `subtotal` (number)
- `StoreRef` includes: `name` (string)
- `CustomerRef` includes: `name` (string), `phone` (string | null), `email` (string | null)
- `PaymentRef` includes: `status` (string), `paidAmount` (number)
- TypeScript compiles without errors (`npm run typecheck` passes)
- No runtime code — types only

## Implementation Notes

Types-only module. Used by `getReceipt` (actions.ts), receipt page, CSV route, PDF route. Raw numbers for money; formatting happens at consumption via `formatMXN`.

## Verification

**Commands:**
- `npm run typecheck` -- expected: passes (no TypeScript errors)
- `npm run lint` -- expected: passes (no ESLint errors)

**Manual checks (if no CLI):**
- Inspect `src/app/recibo/types.ts` — exports all 5 types
- Verify `Receipt` shape matches architecture AD-5 description

## Review Triage Log

- **quick** — All acceptance criteria met. Types match plan exactly: Receipt with folio, store, customer, items, totals, paymentStatus, generatedAt; ReceiptItem, StoreRef, CustomerRef, PaymentRef exported. JSDoc documents folio pattern and ISO-8601. TypeScript and lint pass for new file.