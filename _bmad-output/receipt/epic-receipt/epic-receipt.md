---
id: 1
slug: epic-receipt
title: Receipt generation & export
type: epic
covers: ["receipt", "export-csv", "export-pdf"]
parent: "initiative-tiendaflow"
after: []
---

# Epic: Receipt Generation & Export

## Intent

Enable merchants to generate and download receipts for completed orders in PDF and CSV formats. The receipt shows the store name, customer info, line items, totals, and payment status — matching what the merchant and customer see on screen.

## Outcome

A merchant can:
- Click a "Recibo" button on any paid order in the **Ventas** list and get a printable receipt
- Click "Recibo" on the **Quick Sale success screen** immediately after completing a sale
- Share a direct link `/recibo/<id>` that renders the same receipt
- Download the receipt as CSV (for accounting) or print-to-PDF (for customer)

## Done when

- [ ] `src/lib/money.ts` formats MXN consistently across UI, CSV, and PDF
- [ ] `getReceipt(orderId)` returns a typed `Receipt` object or `null` (store-scoped, paid-only)
- [ ] `/recibo/<id>` renders a standalone HTML receipt (inline CSS, no external deps) with correct data
- [ ] `/api/recibo/<id>/csv` returns `text/csv` with `Content-Disposition: attachment; filename="recibo-<id>.csv"`
- [ ] `/api/recibo/<id>/pdf` returns standalone HTML with `Content-Disposition: attachment` for browser print-to-PDF
- [ ] "Recibo" button appears on each paid order card in `/ventas` and links to `/recibo/<id>`
- [ ] "Recibo" button appears on quick-sale success screen and links to `/recibo/<id>`
- [ ] Unknown/foreign order IDs return 404 (not 500) on all endpoints
- [ ] All currency values match between screen, CSV, and PDF (via `lib/money.ts`)

## Boundaries

- **In scope:** Order receipts only (one kind, closed set per AD-9). Server-side generation only. Print-to-PDF via browser. CSV with raw digits, UTF-8. No auth (inherits app posture).
- **Out of scope:** Tax/IVA lines (schema doesn't support it). Business contact fields on store (not modeled). Puppeteer/Playwright binary PDF. Scheduled/emailed receipts. Multi-language beyond es-MX.

## Known Decisions (from architecture spine)

- Paradigm: server-first layered (inherited from reporting-export)
- Folio = `ORD-<orderId>` (no new column)
- Money formatting centralized in `src/lib/money.ts`
- Receipt data contract in `src/app/recibo/types.ts`
- Single generation entry point: `getReceipt(orderId)` in `src/app/recibo/actions.ts`
- Store scoping via `getStoreId()` — cross-store returns 404
- Paid-only guard at the route level (404 for non-paid/cancelled)
- Standalone HTML with inline CSS, no JS, no external requests
- Client leaves only: receipt button components receive `orderId` prop
- Canonical URL: `/recibo/<id>`

## References

- Architecture spine: `architecture-receipt.md`
- Parent spine: `architecture-reporting-export.md` (AD-1..AD-13 inherited)