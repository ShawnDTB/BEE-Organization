# BEE Organization — Customer Experience Blueprint

## Purpose

This document defines the intended customer journey and page architecture for the next stage of the BEE Organization website. The locked Carbon / Graphite / Bone / Steel / Copper identity remains unchanged. The next design problem is **clarity, sequencing, usefulness, and conversion**.

The site should stop behaving like documentation for a platform under construction and start behaving like a confident customer experience.

## Core experience rule

Every major section must answer one of these questions:

1. **What can BEE do for me?**
2. **Is this relevant to my situation?**
3. **What does the result look like?**
4. **What happens if I continue?**
5. **What should I do next?**

If a section does not materially answer one of those questions, earn trust, show real work, or advance the customer, it should usually be removed.

## Content rule

Less copy, fewer repeated headings, stronger visual proof.

Avoid the recurring pattern of:

`eyebrow → large H2 → explanation → four cards → another large H2 → another explanation`

Use headings when they orient the customer. Do not use headings merely because every section currently has one.

Most public service pages should contain **3–4 substantial sections**. The homepage should contain approximately **5–7 meaningful sections**, not a sequence of repeated explanation blocks.

## Primary customer intents

BEE serves several audiences, but the homepage should not force visitors to identify themselves before they can act. Organize entry points around **what they need to accomplish**:

### Design something custom

For individuals, small groups, businesses, or creators who want to visualize a garment and start a custom project.

Primary destination: `/studio`

### Order for a group

For schools, teams, businesses, organizations, events, and recurring programs.

Primary destination: `/bulk-orders` (future combined Bulk & Organizations experience)

### Shop a finished collection

For customers buying already-approved BEE, creator, collaboration, or organization merchandise.

Primary destination: `/shop`

## Global navigation

Recommended desktop primary navigation:

- Shop
- Design
- Bulk & Organizations
- Creator Merch
- Work
- About

Utility actions:

- Account
- Bag
- Contextual primary action

Do not give Embroidery and Graphic Apparel equal top-level navigation weight if doing so makes the primary navigation crowded. They can live under a compact Services / Capabilities pattern, be linked contextually from Design and Bulk, and remain indexable direct pages.

### Contextual primary action

- General pages: **Design custom apparel**
- Bulk / organization pages: **Get a bulk quote**
- Creator pages: **Plan a merch drop**
- Published product pages: **Add to cart**

## Homepage narrative

### Intent

A first-time visitor should understand within seconds:

- BEE makes custom apparel.
- They can design a custom piece, organize a group order, or shop finished merchandise.
- BEE handles the project in an organized way from concept through approval and reorder.

### Section 1 — Hero: choose the next action

**Job:** answer “What can I do here?”

Keep it concise. One value proposition, one supporting sentence, and three explicit paths.

Suggested hierarchy:

**Custom apparel built around your group, brand, or idea.**

Embroidery and graphic apparel with a clear path from design and quote through approval, production, and reorder.

Actions:

1. **Design custom apparel** → Studio
2. **Bulk & team orders** → Bulk & Organizations
3. **Shop collections** → Shop

Hero media should eventually be one strong real garment or mixed apparel composition. Avoid another technical dashboard inside the hero unless it directly helps someone choose an action.

### Section 2 — Three paths

**Job:** remove ambiguity for customers who scroll instead of choosing immediately.

Three compact visual cards:

- Create Custom
- Order for a Group
- Shop Finished Merch

Each card gets one sentence and one action. No duplicate audience grid is needed afterward.

### Section 3 — Featured engagement

**Job:** create a reason to explore instead of immediately leaving after reading services.

Priority order:

1. Real featured creator collection
2. Real organization storefront
3. Real BEE production sample / BEE original
4. If none exist yet, a single compact Studio demonstration

Do not publish fake collection history or multiple large “coming soon” placeholders.

### Section 4 — What BEE makes

**Job:** show capability visually.

Use a compact media-led row or mosaic:

- Embroidery
- Graphic apparel
- Staff / team systems

Each item can open its relevant capability page or Studio preset. Copy should be descriptive, not educational essays.

### Section 5 — Real work / Sample Lab

**Job:** answer “Can they actually make something I would wear?”

Use only real imagery.

Before customer portfolio volume exists, this may be called **Sample Lab** and use clearly identified BEE-owned production tests. Once enough approved projects exist, transition naturally into **Our Work**.

If there is no real media yet, hide this section rather than showing nine placeholders.

### Section 6 — How it works

**Job:** reduce uncertainty.

Use four steps maximum:

1. Design or request
2. Review the details
3. Approve quote + proof
4. Produce, deliver, reorder

Do not repeat the same process again as metrics, trust cards, and six more steps.

### Section 7 — Final conversion / help

**Job:** catch people who are ready or still unsure.

Two clear options:

- Start a project
- Ask a question

A compact persistent help/contact affordance may eventually make a large final CTA band unnecessary.

## Shop

### Intent

The Shop is for **finished, approved merchandise**, not generic blank garments that still need custom quoting.

### Layout

1. Featured collection / creator banner
2. Collection navigation or promoted filters
3. Product grid
4. Secondary collection story / drop feature when useful
5. Cross-sell into Studio: “Need something made for you?”

### Empty state before launch

Use one compact honest empty state. Do not use several sections explaining that merchandise does not exist yet.

If no products are ready, consider removing Shop from the primary navigation until BEE has at least one real BEE product, creator collection, or organization store that can be purchased.

## Collection / Creator Store — new

Suggested route: `/collections/:slug`

### Intent

The collection owner should feel like the protagonist; BEE provides the commerce and production shell.

### Layout

1. Creator / organization hero with campaign media
2. Short collection story and relevant creator/social links
3. Product grid
4. Drop, stock, preorder, or order-window status
5. Shipping / fulfillment summary
6. Related collection or creator link when useful

Allow collection media and artwork colors to create personality while keeping the BEE interface chrome on the locked palette.

## Real merchandise product page

Suggested route: `/product/:slug`

### Intent

Help a buyer confidently decide whether this specific finished product is right for them.

### Layout

1. Product image gallery
2. Product name, creator/collection, price
3. Color / size variants with visible availability
4. Size / fit information
5. Add to cart — sticky on mobile when appropriate
6. Shipping / pickup / returns summary near purchase controls
7. Product / design story
8. Decoration and garment details in collapsed secondary content
9. Related products

Do not mix this with the quote-based custom product builder.

## BEE Studio

### Intent

Turn a customer’s idea into a structured design concept without forcing them to understand production terminology.

### Desktop layout

- Compact page title / project state
- Large sticky garment viewport
- Controls grouped into four steps:
  1. Garment
  2. Design
  3. Placement
  4. Project details
- Save / share / add to project actions remain visible

### Next Studio capabilities

- Direct drag, resize, and rotate on garment
- Undo / redo
- Multiple design layers
- Front / back / sleeves / applicable garment surfaces
- Names / numbers / personalization
- Artwork-resolution warning
- Decoration-safe-area warning
- Product-specific placement constraints
- Save and share design
- Design duplicated across additional products
- Production notes generated from design state

### 3D direction

Do not make true 3D a prerequisite for the customer workflow. Keep garment, artwork, placement, scale, color, and surface data independent of the renderer.

Once real supplier products are confirmed, a 3D renderer can replace or complement the current visual layer without rewriting the project model.

### Mobile Studio

Do **not** place the entire control panel underneath a 500–600px garment and force repeated vertical travel.

Recommended mobile behavior:

- Preview remains sticky in approximately 40–45% of the viewport
- Controls appear as a bottom sheet or stepper
- Primary save / continue action remains reachable with one thumb
- Every drag action has button / input alternatives
- Avoid keyboard/focus being hidden behind sticky UI

## Bulk & Organizations — combine

### Intent

Answer one question quickly: “How do we get apparel for a group without one person manually collecting everything?”

### Layout

1. Compact hero: **Ordering for a team, school, business, or group?**
2. Three ordering modes:
   - One organizer / one bulk invoice
   - Shared size & personalization collector
   - Dedicated organization storefront
3. What BEE needs to quote the project
4. Real example / sample program when available
5. Four-step order process
6. Concise FAQ
7. Get bulk quote CTA

### High-value future feature: Group Collector

An organizer creates or approves a design, shares one link, and participants can submit:

- Name
- Size
- Item choice
- Personalization / number where enabled
- Shipping information where needed
- Individual payment where enabled

The organizer sees completion progress without managing a spreadsheet or message thread.

## Creator Merch

### Intent

Move from “we can print merch for creators” to a creator-commerce program.

### Layout

1. Creator-focused hero
2. Three pathways: Launch a Drop / Restock Existing Merch / Build a Storefront
3. Featured real creator collection when available
4. Product-development flow: concept → sample → approval → launch → restock
5. Storefront / fulfillment capabilities
6. Plan a merch drop CTA

Avoid explaining hypothetical partnerships, revenue arrangements, or internal development agreements publicly.

## Embroidery

### Intent

Show why and when embroidery is a good fit, then move interested visitors into Studio or a quote.

### Layout

1. Short hero + **Design with embroidery** action
2. Real stitch / garment detail gallery
3. “Great for / consider another method when…” comparison
4. Placement visual + common garment applications
5. Quote / Studio CTA

Artwork preparation and digitizing can live in concise expandable help content rather than occupying multiple large sections.

## Graphic Apparel

### Intent

Show what graphic decoration enables and help customers understand whether their artwork can work.

### Layout

1. Short hero + **Design a graphic piece**
2. Real graphic / print detail gallery
3. Method by use case — simplified, not production-jargon-first
4. Artwork readiness / quality tips
5. CTA

## Our Work / Sample Lab

### Intent

Evidence, not explanation.

Before a meaningful customer portfolio exists:

- Publish real BEE-owned samples under **Sample Lab**
- Clearly mark them as internal/sample development
- Show macro embroidery, print texture, garment fit, wash/quality testing where useful

Once approved customer projects exist:

- Filter by project type
- Use case-study cards only where the story adds value
- A case study can include objective, garments, decoration, challenge, solution, and approved outcome

Never display rows of “project pending” cards.

## About

### Intent

Make the business feel human and trustworthy without turning the page into internal project documentation.

### Layout

1. Short origin / purpose
2. What BEE values in production and service
3. Real equipment / workspace / process imagery when available
4. Who BEE serves / service area
5. Contact / start project

Remove public copy about DTB being a flagship platform, commercial arrangements, IP arrangements, or internal partnership guardrails.

## Start Project / Request Quote

### Intent

Collect only the information required to move the customer forward, progressively.

### Recommended flow

1. **What are you making?** — custom / bulk / creator / not sure
2. **What do you know?** — garment, quantity, design/artwork
3. **When / how?** — deadline, fulfillment, personalization
4. **Who should we contact?** — contact details, files, submit

Later capabilities:

- Save / resume
- Secure artwork upload
- Create project reference
- Account invitation / magic link
- Confirmation email / SMS
- Route automatically into quote/admin workflow

Do not maintain multiple nearly identical intake experiences across Start Order and custom Checkout.

## Project Bag

### Intent

Hold custom project configurations together.

- Visual preview for each configured piece
- Edit configuration
- Clear decoration / artwork state
- Quantity and size breakdown
- Group products by project
- Continue to **Project Review**, not “Checkout”

## Project Review / Request Quote

Suggested route: `/project-review`

This is the custom-work equivalent of checkout.

It should:

- Summarize configured items
- Capture missing project context
- Attach artwork
- Confirm contact / account
- Submit a quote request
- Create a project/reference ID

Reserve `/checkout` for fixed-price published merchandise customers can actually purchase.

## Customer Account

### Intent

Be the ongoing relationship layer, not another marketing page.

Remove the large marketing-style hero in production. Open directly into what needs attention.

Recommended navigation:

- Overview
- Projects
- Quotes
- Proofs
- Payments
- Designs / Files
- Reorders
- Messages

Organization accounts may additionally expose:

- Members / roles
- Size collectors
- Storefronts
- Order windows

### Overview rule

**Attention first, history second.**

Show approvals due, unpaid deposits, missing information, active production, delivery status, and current drafts before historical metrics.

## Admin / Production platform — protected, new

The public site will not be operationally complete until BEE can manage what the customer submits.

Primary areas:

- Dashboard
- Leads / inquiries
- Quotes
- Orders
- Production queue / schedule
- Artwork / proof versions
- Customers / organizations
- Products / garments / supplier references
- Storefronts / collections
- Payments
- Fulfillment
- Messages / notifications
- Analytics
- Settings / permissions

The admin system should use the same project states and vocabulary as the customer account.

## Support and policy pages

Before live commerce:

- Contact
- FAQ / Help
- Shipping / pickup / delivery
- Returns / replacements
- Artwork ownership / customer authorization
- Customer-supplied garment terms if offered
- Privacy
- Terms
- Accessibility contact

## Next-push priority

### P0 — information architecture / content

- Homepage rewrite and section reduction
- Remove internal/prototype/private-development language from public pages
- Merge Bulk + Organizations experience
- Separate real Shop commerce from custom Studio products
- Rename custom checkout flow to Project Review
- Shorten capability pages
- Remove placeholder portfolio grids
- Simplify navigation

### P1 — interaction

- Adaptive project intake
- Studio drag / resize / rotate + layer architecture
- Mobile Studio redesign
- Share/save design
- Group size collector prototype
- Compact production-style account layout

### P2 — backend foundations

- Authentication
- Customer / organization records
- Quotes / approvals
- R2 artwork storage
- D1 project / order data
- Notifications
- Stripe payments
- Admin / production platform

### P3 — commerce expansion

- Real published product catalog
- Creator / organization storefronts
- Direct merchandise checkout
- Shipping / tracking
- Reorders
- Analytics / conversion measurement
