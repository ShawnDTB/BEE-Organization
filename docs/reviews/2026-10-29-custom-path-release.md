# Works by BEE — custom pathway, performance and accessibility

29 October 2026

## Assessment

The existing storefront has a useful Home → Shop hierarchy, route-level lazy loading, deferred Fabric editor, and accessible native mobile navigation. A rebuild would discard useful work. The main opportunity is continuity: explain what custom work means, put the studio where customers can find it, and preserve their decisions through planning and review.

The previous Studio looked like a separate navy/blue application. Shop selections could quietly retain an older garment brief. Opening a new garment could overwrite the only autosaved Studio concept. Studio designs did not prefill the planner's main garment and quantity fields. Autosave announcements also described saving as recovery and repeated after every edit.

DTB's Design → Transform → Breakthrough philosophy is applied through listening to the idea, making it tangible, and making the next action clear. BEE retains its own identity and Build. Empower. Equip. message. No personal founder biography, invented portfolio, testimonials, prices, or production promises were added.

## Changes

- Home keeps Shop as the main action, with a purposeful custom-studio section explaining piece → idea → review. Its imagery remains labeled as an AI-generated concept.
- Shop cards lead supported garments directly to the matching studio garment. Hats and decals retain an honest planning route. Filters stay ahead of supplemental guidance.
- Custom design studio is directly visible in desktop navigation, mobile navigation and footer.
- Studio uses the same charcoal/teal visual language, begins at one approximate piece, and explains the distinction between a saved concept and an order.
- Starting another garment protects the previous concept through an explicit continue/save-and-start choice. Saving failure leaves recovery intact and offers a download. Focus follows the choice into the editor.
- The planner carries forward unambiguous garments/quantities from attached pieces, preserves prior briefs, and flags conflicts. A new Shop choice requires an explicit keep/change decision.
- Offline planning does not require contact information. Quote submission requires the review step, consent, security verification and a single active submission; existing retry identities and server validation are retained.
- Autosave stops repeatedly announcing routine saves. Recovery failures remain announced. Mobile-menu focus restoration on desktop resize and work-gallery announcements are improved.

## Performance evidence

The original 188,636-byte hero now has 38,908-byte and 84,716-byte alternatives: 79.4% and 55.1% smaller respectively. Actual selection depends on viewport and pixel density; browser QA confirmed the small alternative loading. Route-specific module preloads and a homepage-only responsive image preload reduce discovery delays. Hashed assets receive immutable caching. Fabric remains outside the initial storefront download; no dependency or external font was added.

The final build passes the existing 85 kB gzip Home/Shop JavaScript and 20 kB shared CSS budgets. Bundle budgets and transfer savings are measured; no Lighthouse score or field Core Web Vitals improvement is claimed.

## Validation

`npm run check` passes frontend/server types, 131 tests across 15 files, production build, metadata and performance budgets. Targeted axe structural checks cover Home, Shop and planner; 21 explicitly tested color pairs cover storefront and Studio text. These checks do not establish full WCAG conformance.

Browser layout checks cover Home, Shop, planner and Studio at 320, 390, 820, 1440 and 2560px with no horizontal overflow. Manual phone interaction verifies filtering → selected hoodie → preserve old concept → template wording → artwork review → planner. The hoodie, one-piece quantity and artwork carry forward. Keyboard advancement focuses the next heading; mobile-menu Escape returns focus. Offline submission is visibly disabled.

Production intake was checked directly and returned `{ "enabled": false, "siteKey": null }`. No customer request or real payment was sent during verification.

## Remaining launch work

Square account/catalog access, approved real product photography, actual prices/variants, fulfillment terms, a verified monitored contact channel and online intake activation remain separate dependencies. The custom concept tools now work coherently; this release does not implement a live purchase flow.

For the first Square Sandbox purchase, require:

1. Browsing, editing, saving, adding to a bag and pressing Enter in unrelated fields never charge.
2. An editable final review shows garment, size/color, quantity, custom details, delivery and the complete total before payment.
3. The final action says **Pay $X.XX** with the current authorized total. Changed pricing/availability/fulfillment requires renewed review.
4. Double-click, keyboard activation, reload, Back and network retries create at most one charge for the same attempt.
5. Pending/declined/uncertain outcomes remain distinct from verified success; payment status comes from authenticated server/provider state.
6. Payment cannot silently approve artwork or begin production. The accepted quote and exact proof revision remain explicit.
7. Keyboard and screen-reader users get the same edit controls, total and final action; sticky controls cannot obscure focused fields or important amounts.

These are future integration acceptance gates, not claims of implemented payment functionality. They follow [W3C's error-prevention guidance](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html). Other references: [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) and [browser fetch-priority guidance](https://web.dev/articles/fetch-priority).
