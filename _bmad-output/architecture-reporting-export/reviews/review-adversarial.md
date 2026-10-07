# Review — Lens 2: Adversarial "two compliant units diverge" pass

**Verdict:** FAIL (2 high, 2 medium) — fixes applied to spine.

**Findings:**
1. **HIGH — `view` breakdown unspecified.** AD-8 gives `sales` three row variants (by day / by channel / by product) but `generateReport(kind, period)` (AD-9) has no parameter selecting one. Unit A adds `?view=`; unit B adds `?group=` — incompatible URLs, incompatible Report rows. → FIXED: `view` param added to AD-9, per-kind view enum owned by types.ts (AD-8 amended).
2. **HIGH — numeric row values ambiguous.** pg `numeric` returns strings; AD-10 says "numbers as raw digits in CSV", AD-12 charts need JS numbers. Unit A converts at query time, unit B at render — charts silently break or CSV gains quotes. → FIXED: AD-7 amended — numeric fields in `Report.rows`/`summary` are JS numbers, converted once inside `generateReport`.
3. **MEDIUM — dashboard vs report totals.** `getDashboardStats` (existing) and the `sales` report both total sales; only the low-stock threshold is shared (AD-5). Unit A could compute "sales today" differently from the report. → FIXED: AD-9 rule extended — shared aggregates (sales totals, low-stock count) derive from the same predicates/helpers in `reporting/`, not re-implemented in `getDashboardStats`.
4. **MEDIUM — unknown `kind`/`view` on export URL.** No rule says whether `/api/report/bogus` 404s or 500s. → FIXED: convention row — unknown kind/view → 404, never a stack trace.

**Pairs that did NOT diverge (checked):** period params (AD-13 closes), money formatting (AD-4), CSV escaping (AD-10), file naming (AD-10/AD-11), chart library choice (AD-12), messaging entity ownership (AD-6).
