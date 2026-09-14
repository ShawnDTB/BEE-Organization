# Works by BEE — main release, September 14, 2026

Shawn authorized pushes to main for ongoing live-site review. This release starts from dev-0 at 6c39b8d and carries its accumulated work to main. Main previously ended at 726cdaa.

## Applied from The Kut Shoppe

Reviewed its actual dev-branch at 9a06724, including mobile-dashboard milestone, customer dashboard ownership, rescheduling, printable records, and immutable sale estimates. The older main branch did not contain those improvements.

- Native modal navigation escapes page clipping, makes the background inert, receives initial focus, returns focus on close, and uses a scrolling dynamic-height panel. The desktop media boundary is shared with BEE styling.
- The customer workspace leads with real next actions and records available to the visitor. Demo quotes, proofs, payments, and fictional reorder examples were removed.
- Quote requests preserve an immutable original snapshot and a retry identity. Editing the source draft cannot rewrite a submitted design. Requests, estimates, proof decisions, and receipts remain distinct concepts.
- D1-backed intake validates inputs server-side, checks origin and Turnstile, limits body/preview sizes, limits new requests, and records a server reference before reporting success.
- The staff request queue requires a server-side bearer secret. No public list or email-based customer lookup is exposed. This is an operator integration endpoint, not a complete staff dashboard or customer authentication system.

DTB's philosophy here is concrete: the project has one request snapshot, the next action is explicit, failures do not impersonate success, and the next order can start from saved details. BEE's customer narrative is Build. Empower. Equip.

## Implemented

- Works by BEE identity and domain metadata; blue-white/electric blue/violet direction from Brian's welding-arc reference.
- Group-first homepage, custom-apparel entry page, concise footer, and quote-first navigation.
- Native mobile menu with close/Escape/backdrop behavior and scroll restoration.
- Local design editing, download, duplicate/delete, snapshot-preserving project history, notes and similar-project requests.
- Bag quantities and draft edits synchronize. Quantities clamp to whole pieces. Oversized/non-raster mockup uploads are rejected.
- Local draft saving remains distinct from server receipt. If intake is unavailable, customers can save/download without a false sent state.
- Shared quote intake/review page; server acknowledgements; preserved identity after an uncertain response; immutable original request storage.
- Cloudflare Pages function adapter plus a Workers static-assets adapter. An example Workers configuration requires the actual existing Worker name rather than guessing it.
- Route-specific HTML metadata, canonicals, sitemap, private-tool noindex metadata, security headers and privacy information.
- One stylesheet after removal of 1,238 obsolete selector rules. Production CSS is approximately 64 kB / 13 kB gzip, down from 149.39 kB / 26.61 kB gzip.
- Committed npm lockfile and CI using npm ci. Server and frontend types are checked.

The current geometric B identifier is retained as an interim mark. The final circuit-E BEE wordmark from earlier image discussions was not available as an approved production asset in this checkout. The site does not claim that this mark resolves that logo work.

## Verified

30 tests across four files passed, covering real SQLite storage/immutability, input validation, private queue access, duplicate/concurrent retries, rate limits, storage failure, preserved designs, quantity consistency, reorders, native-menu lifecycle, and quote-form availability/failure/success behavior. Full check includes frontend/server TypeScript and production build. SQLite tests exercise the SQL through a small D1-compatible adapter, not the deployed Cloudflare runtime.

The browser environment refused localhost during the prior audit. Native dialog methods are mocked in component tests; tests do not establish physical mobile layout, native focus trapping, contrast, or screen-reader acceptance. GitHub's existing headless screenshot smoke remains a basic render gate, not complete usability testing.

## Deployment observation

A direct HTTPS check on September 14 returned HTTP 200 with text/plain and the body `Hello world` at worksbybee.com, behind Cloudflare. This establishes that the custom domain was not serving this frontend at the time of review. It does not establish the Worker name, Git integration settings, database bindings, or build failure cause.

A main push and a successful CI run are not confirmation of a live deployment. Inspect the Cloudflare project serving this hostname before modifying its deployment configuration. See worksbybee-deployment.md.

## Remaining work in order

1. Connect the existing Cloudflare project to this main build, then verify the actual public website, nested URLs, headers, and API fallback behavior.
2. Confirm the public contact details and operations owner; provision/bind D1, apply migration, configure Turnstile and the staff queue secret. Establish a monitored intake queue and privacy-request/retention process before setting INTAKE_ENABLED=true.
3. Complete rendered desktop/mobile, keyboard, zoom, short-landscape, Studio and file-download review. Review one-color logo and garment production samples.
4. Build authenticated customer/staff access with immutable customer IDs, role authorization, session handling and staff MFA using the established Kut Shoppe architecture as reference. Never treat browser-local delivery labels as server authorization.
5. Add project-specific live states/history, staff assignment and durable notifications/outbox. Current customer copies do not refresh production status across devices.
6. Add itemized quotes and immutable proof revisions/approvals. Keep pricing unknown until determined; production must depend on actual approved proof revision and commercial terms.
7. Implement real project-scoped group invitations, organizer permissions, participant updates and roster export. The existing group collector stays clearly labeled a local demo using test names.
8. Add original production-file uploads with controlled access, limits, retention and review. Current submitted attachments are small raster previews.
9. Activate products, payments/deposits, refunds, taxes/fulfillment and actual receipts only with operational provider configuration. No payment provider was selected or activated here.
10. Add approved sample photographs, customer case studies, genuine reviews and creator features. Generic illustrations remain explicitly identified as concepts.
11. Add conversion reporting across request → quote → approval → delivered work → reorder. No invented order counts or sale history.

This is a substantial main-branch frontend and intake-foundation release, not completion of every backend, commerce and business-operation milestone.
