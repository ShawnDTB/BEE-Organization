# BEE Organization — Platform Completion Roadmap V2

## Goal

The website is not complete when the marketing pages look finished. It is complete when a customer can discover BEE, create or select a product, submit a real request or purchase, approve work, pay, receive updates, and return for another order — while the BEE team can manage the same information without rebuilding it in spreadsheets, DMs, or disconnected systems.

## Recommended system domains

### Identity and access

- Customer authentication using a low-friction passwordless / magic-link or OTP approach
- Customer profiles
- Organization profiles
- Organization memberships and roles
- Staff/admin roles and permissions
- Session management and account recovery
- Audit-sensitive actions recorded with timestamps

### Leads and project intake

- Public project intake
- Studio design drafts
- Group/bulk requests
- Creator requests
- Contact attribution / campaign source where appropriate
- Save and resume
- Project/reference number generation
- Internal assignment / ownership

### Product and garment catalog

Keep two concepts separate:

1. **Published merchandise** — finished products with price, variants, availability, and direct checkout
2. **Custom garment bases** — products used in Studio / quoting and not assumed to have a fixed consumer price

Data should support:

- Product / garment identifiers
- Supplier reference
- Colors and sizes
- Decoration-compatible locations
- Artwork zones
- Cost / pricing inputs
- Availability state
- Product imagery / 3D model references where available

### Studio and designs

- Saved design documents independent of the visual renderer
- Garment
- Surface / placement
- Artwork layer(s)
- Text layer(s)
- Transform data
- Decoration method
- Color
- Personalization fields
- Version history
- Share link permissions
- Draft / submitted / approved states

### Artwork storage

Use private object storage rather than browser localStorage for production files.

Recommended responsibilities:

- Original upload
- Sanitized / preview derivative
- Production-ready derivative
- Proof exports
- File metadata
- Version history
- Ownership / authorization
- Private access / signed delivery URLs

### Quotes

- Quote request
- Line items
- Garments
- Decoration locations
- Artwork / setup fees
- Fulfillment / shipping
- Discounts where authorized
- Tax handling
- Quote versions
- Expiration
- Approval / decline state
- Notes

### Proofs

- Proof version
- Linked project/order
- Linked artwork version
- Placement / garment context
- Customer review link
- Approve / request changes
- Revision notes
- Timestamp and actor
- Production lock after final approval where appropriate

### Orders

- Order record created from an approved quote or direct merchandise checkout
- Line items / variants
- Size breakdowns
- Names / numbers / personalization
- Customer and organization
- Payment state
- Production state
- Fulfillment state
- Due / event date
- Internal production notes

### Payments

- Deposits
- Final balances
- Direct merchandise payments
- Refunds / adjustments
- Payment links
- Receipts
- Transaction references
- Payment state reflected in customer and admin interfaces

Stripe remains a suitable planned integration, but payment behavior should follow BEE's finalized operational policy rather than being hard-coded around one assumed deposit percentage.

### Production

- Production queue
- Method / machine / work center
- Due date and priority
- Artwork/proof lock
- Task/checklist stages
- Quality-control checkpoint
- Production notes
- Completion state
- Exception / issue handling

### Fulfillment

- Pickup
- Bulk delivery
- Shipping
- Individual participant shipping where supported
- Address validation where required
- Tracking
- Fulfillment notifications
- Partial fulfillment if operations later require it

### Customer communication

- Project confirmation
- Quote ready
- Proof ready
- Approval reminder
- Deposit/payment request
- Production status
- Ready for pickup / shipped
- Reorder / follow-up

Messages should be attached to the relevant customer/project/order where possible rather than becoming separate context in an inbox.

### Reorders

A reorder is not simply “buy the same SKU again.”

Clone the useful prior state:

- Garment reference
- Color
- Decoration method
- Artwork version
- Placement
- Personalization structure
- Prior quantities / sizes for reference

Then reconfirm:

- Supplier availability
- Current cost / price
- New quantities / sizes
- Artwork changes
- Deadline
- Fulfillment

### Group Collector

A high-value group-order module should allow an organizer to share a project link so participants can supply data without the organizer maintaining a spreadsheet.

Potential fields:

- Participant name
- Email where needed
- Product choice
- Size
- Name / number personalization
- Shipping address if individual fulfillment is enabled
- Payment if individual payment is enabled

Organizer view:

- Participant completion progress
- Missing responses
- Size totals
- Personalization review
- Payment state where relevant
- Collector close date

### Creator and organization storefronts

- Storefront owner
- Collection(s)
- Products
- Theme/media configuration within BEE shell
- Order window or always-open state
- Inventory/preorder mode
- Fulfillment rules
- Creator / organization links
- Optional fundraising or revenue accounting only if the business formally supports it

### Admin platform

Protected application sections:

- Dashboard
- Leads
- Quotes
- Projects / orders
- Production
- Artwork / proofs
- Customers
- Organizations
- Creator accounts
- Group collectors
- Storefronts
- Products / garments
- Payments
- Fulfillment
- Reports / analytics
- Staff / roles
- Settings

## Recommended Cloudflare architecture

The existing plan remains directionally sound:

- React / TypeScript frontend
- Cloudflare Pages deployment
- Workers / Functions API layer
- D1 relational/structured operational data
- R2 artwork, proof, and media storage
- Turnstile on public submission surfaces
- Stripe for payment workflows

Before implementation, define environments separately:

- Local
- Staging (`dev-0`)
- Production (`main`)

No production payment key, storage binding, customer dataset, or analytics property should be reused in staging.

## Important additions to the current technical plan

### Routing

Replace the current manual `window.location.pathname` route map with a real routing architecture before the application grows substantially.

Requirements:

- Route-level lazy loading
- Route metadata
- Nested authenticated areas
- Proper not-found behavior
- Redirects for consolidated routes
- Search/query state where useful

### Data access

Introduce an API/domain layer so pages do not read production data directly from hard-coded content modules or localStorage.

### Validation

Use shared schemas for inputs crossing trust boundaries: project intake, quotes, artwork metadata, checkout, payments, admin changes.

### Background work

Notifications, image processing, proof generation, webhook handling, and some payment/order state transitions should not rely on a customer keeping a browser tab open.

### Observability

- Structured application logs
- Error monitoring
- API error rates
- Payment webhook failures
- Notification failures
- Storage failures
- Audit events for approvals and administrative changes

## Security / privacy requirements

Before real customer data:

- Secure cookies / session policy
- CSRF protections where applicable
- Rate limiting
- Turnstile on anonymous forms
- File-type / size validation
- Malware-aware upload strategy
- Private artwork storage
- Signed access links
- Role/authorization checks on every server-side resource
- Minimal personal-data collection
- Retention/deletion policy
- Audit logs for approvals and important account changes

Never trust route visibility as authorization.

## Legal / policy dependencies before launch

Operational decisions are needed for:

- Terms of service
- Privacy policy
- Shipping / pickup / delivery
- Returns / defects / replacements
- Cancellations
- Quote expiration
- Deposit / payment terms
- Customer-supplied garment policy if supported
- Artwork ownership / permission to reproduce marks
- School / organization logo authorization
- Creator content rights
- Production substitutions
- Rush orders if supported

## SEO / discovery platform

Current SPA metadata is global. Production should support route-specific:

- Page titles
- Meta descriptions
- Canonicals
- Open Graph / social cards
- Robots directives
- XML sitemap
- Organization / LocalBusiness schema when factual data is finalized
- Product / Offer / ProductGroup structured data for real purchasable merchandise
- Shipping and return policy structured data where eligible

## Analytics model

Measure the customer journey rather than pageviews alone.

Suggested events:

- homepage intent selected
- Studio opened
- garment selected
- artwork uploaded
- design saved
- bulk pathway opened
- quote flow started
- quote submitted
- published product viewed
- add to cart
- checkout started
- purchase completed
- quote approved
- proof approved
- deposit paid
- order completed
- reorder started

This allows BEE to learn where customers become confused or stop rather than guessing from total traffic.

## Delivery sequence

### Stage A — customer-flow cleanup

- Navigation / homepage architecture
- Public-copy cleanup
- Custom vs direct-commerce separation
- Consolidated group page
- Adaptive intake
- Mobile Studio layout

### Stage B — core identity/data

- Authentication
- Customer / organization models
- Project records
- Saved designs
- R2 uploads
- Quote model

### Stage C — approval / money

- Proof versions and approvals
- Stripe deposits / payments
- Notifications
- Customer account backed by real data

### Stage D — operations

- Admin dashboard
- Production queue / scheduling
- QC
- Fulfillment
- Reorders

### Stage E — scalable commerce

- Published merchandise checkout
- Creator / organization storefronts
- Group collectors
- Individual participant payments / shipping if operationally supported
- Deeper analytics

## Definition of operationally ready

BEE is ready for a real custom order when a customer can submit a project and BEE can process it end-to-end without needing to recreate the same information manually in another system.

BEE is ready for direct ecommerce when real products, prices, inventory/order policy, payment, tax, fulfillment, returns, transactional notifications, and customer support expectations are all connected and tested.
