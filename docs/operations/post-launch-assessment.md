# Works by BEE: live-site assessment and development order

Baseline: main f84dc19, September 14, 2026. This assessment precedes the implementation described in the release notes below.

## Executive assessment

The site is a deployed planning experience, not yet an operating ordering business online. Its strongest foundations are a clear group-first story, a functional local design-to-bag workflow, immutable request snapshots, defensive intake validation, and successful Cloudflare deployment. Its largest commercial weakness is that no visitor can currently deliver an inquiry to Brian through the site: intake is disabled and the public contact fields are empty.

The DTB breakthrough here is reducing the organizer's work from scattered artwork, headcounts, and messages to a clear brief Brian can review, quote, produce, and repeat. Feature priority follows that journey, not the number of pages or dashboards.

## Evidence and limitations

- Inspected the deployed homepage and quote journey in Chrome, including rendered DOM and desktop composition. The quote service reports unavailable, consistent with server configuration.
- Reviewed routing, service pages, Studio/bag/local storage, request form, shared validation, Worker API, metadata, tests, and deployment configuration.
- The homepage has no observed app-origin console errors in the inspected session; a browser-extension error is not counted as an app defect.
- Prior release: 30 automated tests, frontend/server type checks, production build, and Cloudflare deploy succeeded. These are not a WCAG certification, penetration test, or proof that every mobile layout works.
- No access to production D1, operational mailbox, Turnstile setup, or business policy decisions was available. No real customer data was submitted during this audit.

## Current-state inventory

| Area             | Working today                                                                                                 | Incomplete / risk                                                                                                            | Development decision                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Hosting          | Custom domain, HTTPS, Worker assets and API routing, main build integration                                   | No alerting or documented restore drill; dashboard overrides may diverge                                                     | Keep verified main releases; add deployment checks                                                  |
| Brand            | Works by BEE name, Build. Empower. Equip., blue/ice/violet palette                                            | Generic interim B icon; old conflicting brand docs; abstract garment illustrations                                           | Original vector BEE wordmark and small-format mark; authoritative usage guide                       |
| Homepage         | Primary audiences, services, process, FAQ, project CTA                                                        | No real work; availability revealed only after entering quote flow                                                           | Disclose planning availability earlier; retain honest concept labels                                |
| Services         | Embroidery, graphics, creator and bulk routes                                                                 | Some future workflows described as if established; broken About anchor                                                       | Clarify practical tools and fix broken navigation                                                   |
| Quote intake     | Three steps, autosave, bot-check component, validation, retry identity, confirmed receipts only after storage | Disabled; no public contact; final review omits many entered fields; JSON is not a friendly business handoff                 | Complete review and readable brief now; configure actual delivery next                              |
| Studio           | Garment/color/text/raster preview, approximate placement, save/duplicate/edit, bag connection                 | No production artwork upload, multiple placements, garment SKU or actual proofs; previews limited in size                    | Retain as optional concept tool, not a prerequisite or production promise                           |
| Project bag      | Multiple designs, quantities, edit/remove, review handoff                                                     | One size per design; unknown historical product slugs disappear from rendering                                               | Group-size plan first; future variant matrix and migration validation                               |
| My projects      | Local design history, unsent/received copies, private notes, similar requests                                 | Not an account; autosaved current request not listed unless separately saved; no cloud recovery; no project-copy deletion UI | Surface current draft, enable explicit local-copy removal; authenticated portal later               |
| Group collector  | Local prototype with participant/organizer views                                                              | No access control, cross-device sharing, duplicate prevention, or request handoff; public demo competes with useful CTA      | Replace promotional links with aggregate size planner; leave old data untouched                     |
| Staff operations | Protected paginated read API                                                                                  | Shared operator token is not individual roles; no queue UI, assignments, estimates, versioned proofs, notifications          | Staff authentication and inbox before customer account expansion                                    |
| Commerce         | Future collection and checkout explanations                                                                   | No products, inventory, processor, taxes, refunds, receipts, shipping or payouts                                             | Defer payments until quote/order and business policies are established                              |
| Trust            | Honest sample-stage language, privacy explanation                                                             | No sample photos, approved testimonials, contact, service area, hours, turnaround or minimums                                | Obtain genuine business inputs; do not fabricate                                                    |
| Accessibility    | Skip link, native dialog/focus handling, labels, reduced-motion rules                                         | No comprehensive mobile/keyboard/contrast/screen-reader acceptance pass                                                      | Test key task journeys; retain explicit QA limits                                                   |
| Search/sharing   | Titles/descriptions/canonicals, sitemap, noindex tool routes                                                  | Client-rendered content; no social card; unknown routes return SPA HTTP 200                                                  | Social asset and correct missing-route response later; prerender marketing pages next SEO milestone |
| Privacy/security | Same-origin intake, size limits, Turnstile guard, rate limit, immutable records, protected queue              | No individual accounts, audit trail, retention automation, secure original-art upload                                        | Keep submissions off until actual setup and operator workflow verified                              |
| Maintenance      | Lockfile, Node pin, tests, lazy routes, reduced CSS                                                           | CSS still contains layered historical overrides; old docs conflict                                                           | Consolidate incrementally with visual regression coverage                                           |

## Ranked roadmap and acceptance gates

### P0 — make a real inquiry possible

Brian supplies a verified public email/contact method and an agreed monitoring owner. Configure the existing Cloudflare service's D1 binding/migration, Turnstile keys, contact and staff secret. Complete a test inquiry with permission, retrieve it as staff, verify retry deduplication, and confirm the actual follow-up process. Enable intake only after this gate. Do not create a guessed mailbox or advertise a response-time promise.

Until this is ready, disclose planning mode, offer useful preparation, and never show a false submitted state.

### P1 — remove friction from the core group-order journey (this increment)

1. Add a no-name aggregate size planner with bounded whole-number counts, garment/color, total, local recovery, and explicit transfer into the request. Do not collect student rosters or pretend links are shared.
2. Show all project fields and size totals before sending. Offer a plain-text brief alongside the structured JSON copy; preserve receipt/draft distinctions.
3. Surface the current autosaved request in My projects; allow confirmed removal of a selected local history copy without deleting server records.
4. Create a path-based BEE identity with color, light/dark monochrome, and a simple small-size mark. Integrate it into header/footer/favicon. No claim of trademark clearance or embroidery digitization.
5. Fix the broken About link and remove prominent prototype promotion.

### P2 — Brian's working inbox and quote/proof pipeline

Individual staff authentication and roles; inbound requests with assignment and last action; immutable quote revisions with explicit line items and expiry; versioned proofs and explicit approval; activity/audit events; reliable transactional notifications with retry and delivery visibility. Customer access must be scoped to their own project. Reuse Kut Shoppe's principles of real state, server authorization, immutable commercial records, and clear next actions—not its barber payroll model.

Acceptance: Brian can take one authorized test request from received to quoted to proof-approved without editing the original request or exposing another customer's work.

### P3 — shared organizer workflow and customer portal

Project-specific invitations, participant isolation, organizer permissions, roster deadlines/locking, size/variant reconciliation, validated production export, cloud draft recovery, and secure original-art files. Avoid public school rosters. Introduce accounts when there is useful server-backed state to show.

### P4 — transactions and growth

Payments/deposits after processor and policy choices; verified webhooks and payment reconciliation; tax/shipping/refund handling; inventory and collections; repeat-order programs and creator storefronts. Then analytics around actual funnel completion and follow-up time. No invented conversions or testimonials.

## Inputs only Brian/the business can settle

Verified public email and phone; service/fulfillment area; accepted garments and production methods; realistic minimums/capacity/timing; supplier/SKU choices; quote approval and deposit policy; fulfillment and remake rules; sample photographs; permission to publish customer work. These are decision inputs, not reasons to block independent engineering work.

## Brand direction

An engineered BEE wordmark, not an insect mascot. Bold chamfered letter shapes relate to making/building; a thick blue middle stroke in each E references the arc/circuit direction without fragile hairlines. The name is readable in one color. Electric blue is functional emphasis, ice is primary contrast, violet stays secondary. Keep decorative glow out of the production logo.

Website font roles: Space Grotesk for headings, Inter for body/interface; logo letterforms are paths, independent of installed fonts. Physical samples and stitch tests remain necessary before claiming embroidery suitability.

## Implemented after this assessment

- Original BEE color wordmark, two monochrome variants and small-format symbol; header/footer/favicon integrated. Existing archived assets remain recoverable in git.
- Public group-size planner with youth/adult labels, bounded integer validation, local saving, text download, and explicit confirmation before replacing an existing request's garment/counts. Aggregated counts—not participant names. Old collector records are untouched; the prototype is no longer promoted on the bulk page.
- Optional structured sizePlan validated on both client and API and preserved within immutable request snapshots. No database migration required because the existing record stores the snapshot as JSON.
- Complete final request-field review, attached size-plan summary with mismatch warning, remove-plan action, and human-readable text brief for current requests and saved project copies. JSON downloads remain available for embedded design snapshots.
- Current autosaved request surfaced in My projects, plus explicit local project-copy/note removal; this does not delete any server request or Studio design.
- Homepage planning-mode notice, finite availability-check timeout, repaired About navigation, and updated privacy description.
- Validation includes unit, API/SQLite and React component tests. Local browser preview was blocked by this environment; deployed desktop inspection is performed separately. Mobile device and print/embroidery acceptance remain open, not inferred from unit tests.
