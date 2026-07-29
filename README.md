# BEE Organization Platform

Brand, website, sales, and operating-system foundation for **BEE Organization LLC**.

The current recommended customer-facing identity is **BEE Assembly**. In this system, BEE represents founder **Brian Eugene Everson** rather than a literal bee or hornet mascot. “Assembly” connects the company’s group-focused customers, made-to-order production, creator communities, and Brian’s hands-on interest in computer hardware and systems.

> **Working identity:** Naming, domain, social-handle, and trademark clearance must be completed before public launch.

## Current milestone

This branch delivers the second identity milestone:

- Replaces **BEE Works** throughout the active experience.
- Introduces three stronger naming routes:
  - Everson Supply Co.
  - BEE Assembly — recommended
  - BEE Foundry
- Adds a flat modular BEE Assembly mark designed for embroidery and one-color production.
- Adds dark, light, and production-safe logo variants.
- Repositions BEE as Brian Eugene Everson’s founder mark.
- Repairs the dependency versions that prevented `npm install` from completing.
- Adds automated typecheck and production-build validation through GitHub Actions.

## Positioning

> **Custom apparel, built for your people.**

BEE Assembly is being designed to serve schools, teams, organizations, businesses, events, streamers, content creators, and individual customers through affordable bulk ordering, dependable quality, proof approval, and easy reorders.

## Brand architecture

- Legal entity: **BEE Organization LLC**
- Recommended public brand: **BEE Assembly**
- Founder meaning: **Brian Eugene Everson**
- Primary descriptor: **Custom Apparel · Embroidery · Creator Goods**
- Brand promise: **Built together. Made to represent.**
- Future-compatible divisions:
  - BEE Assembly Apparel
  - BEE Assembly Creator Goods
  - BEE Assembly Programs
  - BEE Assembly Systems

## Local development

### Requirements

- Node.js 20.19 or newer
- npm 10 or newer

Check your installation:

```bash
node --version
npm --version
```

### Clean installation

From the repository root:

```bash
npm cache verify
npm install
npm run dev
```

The development server will normally open at `http://localhost:5173`.

### If an older failed installation exists

Windows Command Prompt:

```cmd
rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
npm cache verify
npm install
npm run dev
```

PowerShell:

```powershell
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm cache verify
npm install
npm run dev
```

### Production validation

```bash
npm run check
```

This runs TypeScript validation followed by the Vite production build.

## Why the install previously failed

The original `package.json` referenced `@types/react@19.1.8`, which is no longer available from the active npm registry. Because installation stopped before creating `node_modules`, the local Vite executable was never installed. `npm run dev` then reported that `vite` was not recognized.

The toolchain is now pinned to an installable, mutually compatible set of React, TypeScript, Vite, and React type packages.

## Repository structure

```text
.github/workflows/       Automated install, typecheck, and build validation
docs/brand/              Brand strategy, naming rationale, and logo usage
docs/content/            Sitemap and launch copy
docs/architecture/       Technical architecture and implementation notes
docs/operations/         Quote, proof, production, and reorder workflows
public/brand/rebrand/    Current logo system and naming concepts
src/                     Interactive identity and platform prototype
```

## Ownership and commercial notes

Earlier planning discussed a **2% website-sales fee plus a 15% profit-share** for Designed to Breakthrough LLC. That structure remains a planning reference only until responsibilities, eligible revenue, expenses, refunds, chargebacks, reporting, intellectual property, payout timing, and exit terms are defined in a signed agreement.

## Status

This repository is a brand-and-platform foundation, not a public commerce launch. Pricing, policies, production capabilities, naming clearance, legal terms, and customer-service commitments must be finalized before accepting orders.
