# BEE Organization Website

Website, custom-order intake, brand foundation, and future commerce platform for **BEE Organization LLC**.

## Current status

The project now contains a complete customer-facing website structure while the final public name and logo remain undecided.

- Temporary site label: **BEE Organization**
- Legal entity: **BEE Organization LLC**
- Public brand name: **Pending approval and clearance**
- Final logo: **Pending design and production testing**
- Current mark: Neutral placeholder only

No founder or private personal name is used in the active website or documentation.

## Website pages

- `/` — Homepage
- `/bulk-orders` — Bulk-order programs and quote factors
- `/embroidery` — Embroidery applications, artwork, placement, and production considerations
- `/graphic-apparel` — Graphic-decoration methods and artwork readiness
- `/creator-merch` — Creator merchandise development and future program support
- `/schools-organizations` — Schools, teams, businesses, and community-order programs
- `/our-work` — Transparent portfolio framework with approved-work placeholders
- `/about` — Business model, operating values, and DTB partnership
- `/start-order` — Interactive quote-intake prototype

The Cloudflare Pages `_redirects` file provides fallback routing for direct page visits.

## Local development

### Requirements

- Node.js 20.19 or newer
- npm 10 or newer

Node.js 22.16.0 is pinned through `.node-version` and used by CI.

### Start the project

```bash
npm install
npm run dev
```

The development server normally runs at `http://localhost:5173`.

### Repair an older failed Windows installation

Command Prompt:

```cmd
rmdir /s /q node_modules 2>nul
if exist package-lock.json del package-lock.json
npm cache verify
npm install
npm run dev
```

### Validate production

```bash
npm run check
```

This runs TypeScript validation and the Vite production build.

## Why Vite was not recognized

The original dependency set referenced an unavailable React type release. `npm install` stopped before the project-local Vite executable was installed. The dependency versions are now compatible and GitHub Actions verifies installation and production compilation.

## Repository structure

```text
.github/workflows/       Automated install, typecheck, and build validation
docs/brand/              Temporary-brand rules and final-brand decision requirements
docs/content/            Sitemap and launch copy
docs/development/        Local setup and troubleshooting
docs/operations/         Quote, proof, production, and reorder workflows
public/brand/placeholder Neutral temporary identifier
src/components/          Header, footer, and shared interface components
src/content/             Centralized site configuration and copy
src/pages/               Complete customer-facing page set
src/styles/              Responsive design system
```

## Content standards

The current build intentionally avoids:

- Private personal names
- Unapproved customer names or creator identities
- Invented testimonials, order counts, or savings claims
- Guaranteed turnaround without production data
- Public flat pricing that ignores project variables
- Presenting placeholder branding as final

## Platform roadmap

The next platform phases can connect:

- Secure quote submission
- Artwork uploads
- Customer and order records
- Proof approval
- Deposit and payment collection
- Production status tracking
- Automated customer notifications
- Reorders
- Analytics and conversion tracking

## Commercial notes

Earlier planning discussed a **2% website-sales fee plus a 15% profit-share** for Designed to Breakthrough LLC. That remains a planning reference until responsibilities, qualifying revenue, expenses, refunds, chargebacks, reporting, intellectual property, payout timing, maintenance, and exit terms are defined in a signed agreement.

## Launch limitations

This repository is not yet a public commerce launch. Pricing, policies, production capacity, service availability, public naming, final identity, legal terms, and customer-support commitments must be approved before accepting live orders through the website.
