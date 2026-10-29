# BEE reassessment: brand feel and the Square connection

Review date: October 29, 2026. Reviewed live Home, Shop and the product-to-planner journey, plus source at main release 86ae456. This is a design and integration plan; no Square seller account, catalog, credentials or payments have been connected or inspected.

## What the current experience is missing

The last release improved navigation and readability, but the public experience is still a product-planning preview. It has little merchandise specificity, craft evidence or transaction continuity.

| Observed issue | Effect | Next change |
| --- | --- | --- |
| Hero and cards repeat flat garment illustrations | There is no fabric, print detail, finished artwork or recognizable BEE product to want | Build the visual direction around approved product photography, artwork and close-ups of actual printing/embroidery. Keep any concept imagery explicitly illustrative. |
| Abstract headline and broadly interchangeable copy | Visitors learn little about BEE's taste or specialty | Lead with custom apparel and graphics, using shorter, more concrete product-focused copy. |
| Green-tinted pale surfaces dominate | Amanda's sharper charcoal/gray/teal reference has become a muted green presentation | Give charcoal/graphite more visual weight, retain white/gray product surfaces, and use teal deliberately for focus and actions. |
| Numbered text category boxes | The categories feel administrative | Use compact, visual product shortcuts that remain easy to tap on phones. |
| Six concepts have no actual SKU, price, variant selection or detail page | Shop does not let a buyer make purchase decisions | Add real product detail pages, approved images, size/color choices, price, fulfillment information and explicit purchase availability. |
| Shop cards lead directly to a broad project questionnaire | Product selection is followed by more planning rather than a configured item | Route fixed-price items to cart; route genuinely unpriced custom work to a targeted quote flow. |
| Light storefront changes into older navy project screens | The experience loses visual and behavioral continuity | Use one design system for product, customization, quote, cart, checkout and confirmation screens. |
| Upcoming collections and launch-status copy occupy significant space | The page communicates future potential more than present value | Let actual products and work lead. Keep unavailable categories out of the main sales area until ready. |

The gray/teal palette is retained. The proposed feel is a confident independent print shop with a technical edge: tactile products, bold but readable headings, strong artwork and restrained color. Cars, computers and healthcare should be expressed through real designs and collection images, not a generic gaming-only theme.

## Proposed information structure

Home: one strong product/work image and clear shop action; visual category shortcuts; a small selection of actual featured products; concise proof of craft; one custom-order invitation. Keep the page compact. Put the custom-order process and detailed FAQs where they are needed.

Shop: product categories and design collections are separate filters. Product types include T-shirts, hoodies, hats and decals; design collections can be automotive, computers/gaming, healthcare and seasonal. An Embroidery shortcut can filter eligible garments by finish. Do not confuse a decoration method with a SKU.

A fixed-price product detail page should contain real images, product name, Square-backed variants and price, design/finish details, size guidance, current availability, and an honest fulfillment policy. Do not invent these values. Keep product name, image, selected variant and quantity visible through cart and checkout.

Custom work should remain product-oriented where possible: choose item, describe/upload artwork, review the brief, receive a quote/proof, then pay at the agreed stage. Use familiar labels rather than requiring everyone to learn Studio or the project-bag model. Guest purchasing should be supported; future customer accounts must not be a prerequisite for the first retail order.

## Square's role

Recommended target: BEE retains the storefront and embeds Square Web Payments SDK in the site's checkout. The SDK provides Square-managed payment fields and tokenization. A server processes the token using the Payments API. Styling uses supported SDK properties; raw card data must never pass through BEE's own forms or server.

Square Catalog and Inventory are the commerce source for published products, item variations, prices and tracked stock. Website merchandising metadata can add collection placement, editorial copy and approved images, keyed to real Square IDs. Publish an explicit selection of sellable merchandise rather than exposing every internal Square item.

The website retains artwork, design revisions, customer approvals, quoted custom specifications and production-stage records. Square retains its financial/order records. Store an explicit mapping between them; payment status and production status are different facts.

Using one Square commerce system is the proposed architecture. Adding Shopify would create a second catalog/order owner without a demonstrated need at this stage.

## Handshake 1: connect the BEE seller account

Choose the account ownership path before implementing authentication:

- If BEE owns the Square account and developer application, Square supports a server-held personal access token for a custom integration accessing that same account. It has broad access and belongs only in host secrets.
- If DTB owns the application and connects to BEE's separate seller account, use Square OAuth. Amanda/Brian authorize the seller account; the server exchanges the authorization code for tokens and stores them securely. Implement state verification, protected connection controls, token refresh and revocation handling. Square OAuth access tokens expire after 30 days.

For either path, verify merchant identity, business location, currency and production readiness before enabling payments. Keep Sandbox and production credentials, catalog IDs and webhooks separate. Payment activation and banking readiness must be checked in the actual seller account; an account's existence is not evidence that it can accept payments.

The exact authorization scopes depend on selected endpoints. Catalog/inventory reads, order reads/writes and payment reads/writes are the expected core capabilities. Customer-directory access is optional. Do not request unrelated staff, payroll or banking permissions.

## Handshake 2: a complete transaction

1. Read the selected published Square item variation and approved merchandising data.
2. Let the buyer select size, color, quantity and any supported priced options. Keep bespoke artwork/quote requests separate from fixed-price items.
3. The server validates publication, variant, quantity, location and current availability, then calculates authoritative prices, discounts, shipping and taxes. Browser totals are display-only. Reconfirm changed totals before payment. A stock read is not an inventory reservation; inventory concurrency must be handled and tested.
4. Create and persist a local checkout attempt and a Square order reference. Preserve an immutable cart/customization snapshot and idempotency keys so retries do not duplicate payments.
5. Square's embedded form returns a payment token. The server submits it to Square for the validated order and amount.
6. Display success only after a verified server-side Square result. If completion is pending, show a pending state. A success URL or browser flag is not evidence of payment.
7. Validate signed Square webhook events using the exact notification URL and raw request body. Deduplicate events, confirm merchant/order/payment association and reconcile current Square state to handle delayed/out-of-order events.
8. Show the same product details, BEE reference, receipt and next fulfillment step in confirmation. Keep customer order access private, including guest access.
9. Keep refunds/cancellations synchronized. Payment confirmation does not itself approve artwork or indicate that production/fulfillment is complete.

Proposed components: a Square server adapter, a published catalog endpoint, server-side checkout/order endpoints, a signed webhook endpoint, durable checkout/order records, secure artwork storage and a matching storefront confirmation view. These do not exist in the current release.

## Hosted checkout alternative

Square's Checkout API can generate a hosted payment page and return the buyer to the website. It is a lower-effort launch option with a visible off-site payment step. It supports orders with catalog variation IDs, a return URL, prepopulated buyer details and up to two custom checkout fields.

The hosted custom fields do not replace a design/artwork workflow. Save artwork and approvals before checkout, and link them by order reference. API payment links are single-use, so create a new transaction link for each checkout. Do not expect reusable Dashboard links and API-generated links to behave identically.

Do not build both hosted and embedded checkout for the initial release. Embedded is the recommended target for the cohesive experience requested; hosted remains an explicit launch tradeoff if speed becomes the priority.

## Implementation sequence and acceptance

1. Confirm Square account/application ownership and whether a real catalog exists. Obtain secure development access and configure Sandbox.
2. Select one approved product with actual variants, price, artwork and fulfillment policy. If real merchandise is not yet ready, use clearly labeled Sandbox test data privately.
3. Build a complete vertical purchase flow: product detail → cart → embedded checkout → confirmation → Square order/receipt. Use the proposed charcoal/gray/teal design throughout.
4. Test decline, cancellation, double-click/retry, changed price, unavailable variant, webhook signature rejection, duplicate/out-of-order notifications, refund and guest order access. Complete operational tax/shipping/fulfillment checks.
5. Assess the feel and usability of that whole flow on phone and desktop. Use this as the visual and interaction standard for Home and Shop.
6. Add the approved catalog and custom quote/proof handoff; perform keyboard, screen-reader, contrast, reduced-motion and performance checks. Run the existing required repository checks.
7. Enable production only with verified seller readiness and policies, then publish through main and verify the live order journey. Never use a real financial charge merely as an unapproved test.

## Inputs still needed

- Square account state: not created, created without products, or an existing catalog.
- Whether the Square developer application belongs to BEE or DTB.
- A small initial product set with approved artwork/images, variations and prices.
- Shipping/pickup/production policies and the monitored customer-contact channel.

No Square plugin was found in the available integration directory during this review. That is a tooling observation, not a claim about whether BEE has a Square account. The developer integration can still use Square's supported APIs once secure account access is established.

## Primary references checked

- [Square Web Payments SDK](https://developer.squareup.com/docs/web-payments/overview)
- [Payment form styling](https://developer.squareup.com/docs/web-payments/customize-styles)
- [Access tokens and ownership](https://developer.squareup.com/docs/build-basics/access-tokens)
- [OAuth flows and token lifetime](https://developer.squareup.com/docs/oauth-api/overview)
- [Create orders and reference catalog variations](https://developer.squareup.com/docs/orders-api/create-orders)
- [Inventory API](https://developer.squareup.com/docs/inventory-api/what-it-does)
- [Validate webhook signatures](https://developer.squareup.com/docs/webhooks/step3validate)
- [Payment update events](https://developer.squareup.com/reference/square/payments-api/webhooks/payment.updated)
- [Checkout API](https://developer.squareup.com/reference/square/checkout-api)
- [Hosted checkout options](https://developer.squareup.com/docs/checkout-api/optional-checkout-configurations)
- [Hosted checkout pitfalls](https://developer.squareup.com/docs/checkout-api/common-pitfalls)
