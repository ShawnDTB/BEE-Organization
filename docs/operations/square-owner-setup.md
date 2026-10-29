# Works by BEE — Square owner setup

Status: Square account is not created or not yet confirmed, per Shawn on October 29, 2026. This guide prepares the connection; it does not indicate that checkout is implemented or activated.

## First: the account belongs to BEE

Amanda/Brian should own the Square seller account and its recovery email. Enter the correct business and owner details during Square's setup. The owner completes Square's agreements, identity checks and banking/activation steps directly with Square. DTB provides development support without taking ownership of BEE's merchant account.

Do not create a second account until checking whether either owner already has a Square account for this business.

## Setup order

1. Sign in to the existing Square account, or create BEE's account from Square's official site. Use an address BEE controls and can continue accessing.
2. Open the [Square Developer Console](https://developer.squareup.com/console/en/apps) using the same BEE account. Create an application named **Works by BEE Website**.
3. Start with **Sandbox**. Square provides separate testing credentials; use a Sandbox location and test catalog. Production activation is required before taking real payments, but does not need to block Sandbox development.
4. Record the Sandbox Application ID and Location ID. Configure the Sandbox Access Token directly as a server secret in Cloudflare. Do not put the token in frontend `VITE_` variables, GitHub source, website fields or chat messages.
5. Once secure development access is arranged, DTB verifies the correct seller/location and builds one end-to-end test purchase. The current site has no Square adapter or payment endpoint; credentials alone will not activate it.
6. Add an initial real product set after BEE confirms artwork, images, prices, sizes, colors and shipping/pickup policies. Keep test catalog data separate from production merchandise.
7. Complete Square production activation and banking with the owner. Run the production-readiness checks below before enabling public checkout.

[Square's account/application setup instructions](https://developer.squareup.com/docs/get-started/create-account-and-application) distinguish developer setup from production payment activation.

## Information needed for the developer connection

| Information | Where it belongs | Purpose |
| --- | --- | --- |
| BEE owner/business name and controlled email | Square owner account | Merchant ownership, recovery and verification |
| Sandbox Application ID | App configuration | Initializes Square's test payment fields |
| Sandbox Location ID | App/server configuration | Identifies the intended test business location |
| Sandbox Access Token | Cloudflare server secret | Authorizes test API requests |
| First product variation IDs | Server catalog mapping | Connects selected size/color and price to actual Square records |
| Webhook signature key and exact notification URL | Server secret/configuration, after endpoint exists | Validates payment/order updates |
| Production credentials | Separate production configuration, later | Enables real commerce after acceptance |

The application ID and location ID are identifiers. Access tokens, application secrets and webhook signing keys are secrets. DTB must confirm the access method available in Square before requesting a specific permission set.

## Authentication choice

For a BEE-owned application accessing BEE's own Square account, Square supports a server-held personal access token in production. This is broad access and must be protected as an owner credential.

If DTB instead owns the developer application and connects to BEE's separate seller account, use Square OAuth with the scopes needed by the integration. That requires the seller's authorization and server-side token refresh/revocation handling. Do not mix tokens from one merchant with another merchant's location.

[Square's token ownership guidance](https://developer.squareup.com/docs/build-basics/access-tokens)

## First Sandbox purchase to prove

Use one clearly labeled test apparel item with test size/color variations. Build the whole flow before expanding the catalog:

- Product selection and current price are loaded from Square-backed server data.
- Cart remains editable and preserves chosen variants.
- Server validates the cart, fulfillment and authoritative total.
- Embedded Square payment fields tokenize the test payment; the server creates the payment for the correct order.
- Confirmation includes matching BEE and Square references.
- Verified, deduplicated webhook updates reconcile payment and refund state.
- Decline, double-click/retry, cancellation, changed price, unavailable variation and refund cases are tested.
- No production card charge is needed to prove Sandbox integration.

## Before live checkout

Confirm seller payment activation; actual published catalog and prices; configured and verified tax/shipping/pickup policies; monitored support contact; appropriate privacy and return policies; webhook delivery/signatures; duplicate-payment protection; guest-order access privacy; complete receipts; fulfillment responsibilities; and refund handling. Payment success and approval to print artwork remain separate states.

Use one Square commerce system for the initial launch. Shopify is not a dependency of the proposed custom BEE storefront.

## What can proceed before the account exists

Home/Shop styling, product presentation, a consistent custom-order planner, approved artwork preparation, responsive/accessibility testing and the application integration contract can proceed. Catalog synchronization and real Sandbox transactions require the account and securely configured test credentials.

## Official references

- [Create an account and application](https://developer.squareup.com/docs/get-started/create-account-and-application)
- [Access tokens](https://developer.squareup.com/docs/build-basics/access-tokens)
- [Web Payments SDK](https://developer.squareup.com/docs/web-payments/overview)
- [OAuth API](https://developer.squareup.com/docs/oauth-api/overview)
- [Webhook verification](https://developer.squareup.com/docs/webhooks/step3validate)
