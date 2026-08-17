# BEE Organization — Polish, Accessibility, and Performance Standards

## Purpose

The locked visual identity should feel premium because the product is clear, fast, stable, and usable — not because the interface is visually dense.

These standards should guide the final pass on every feature before it enters `dev-0` and again before `dev-0` is promoted to `main`.

## Current baseline

The current frontend is still lightweight enough to evolve safely, but architectural cleanup should happen before large new dependencies are added.

Latest staging build inspected during this audit:

- 47 transformed modules
- JavaScript: approximately 289 kB raw / 85 kB gzip
- CSS: approximately 87 kB raw / 16 kB gzip
- Vite production build under one second in CI

The main current risks are not raw bundle size. They are:

- all route code eagerly bundled together
- a large CSS override stack
- prototype/localStorage state mixed with production-facing components
- no automated accessibility / interaction / visual regression testing
- no route-specific metadata architecture

## Performance targets

At minimum, target current Core Web Vitals “good” thresholds at the 75th percentile for mobile and desktop:

- LCP ≤ 2.5s
- INP ≤ 200ms
- CLS ≤ 0.1

These are field targets, not only Lighthouse lab targets.

## JavaScript strategy

### Route splitting

Before authentication, 3D, admin, charts, or rich editors are added, split major routes:

- Marketing / Home
- Shop / product commerce
- Studio
- Account
- Admin

The homepage should never download Studio's eventual 3D renderer, admin tables, or account-only logic.

### 3D

If Three.js / React Three Fiber is introduced:

- dynamic import only inside Studio
- keep a usable 2D fallback
- do not block initial Studio UI on a large model download
- lazy load alternative garment models
- use compressed production assets
- avoid continuously rendering at full frame rate while nothing changes

### Interaction work

Keep drag / resize operations local and responsive. Expensive preview generation, upload processing, proof rendering, and file conversion should move to workers/background services where appropriate.

## CSS architecture

Current CSS is loaded through multiple chronological override layers. Refactor toward:

```text
styles/
  tokens.css
  reset.css
  typography.css
  layout.css
  components/
  routes/
    home.css
    shop.css
    studio.css
    account.css
```

The locked brand variables belong in one token source.

Do not keep old blue/temporary declarations alive only because `brand-system.css` overrides them later.

Benefits:

- less accidental style inheritance
- smaller CSS payload over time
- easier responsive debugging
- fewer specificity battles
- visual regression becomes easier to reason about

## Fonts

Current Google Fonts load through CSS `@import`.

Improve by:

- loading font resources in document head rather than a nested CSS import
- preconnecting only when needed
- using the minimum required weights
- considering self-hosted approved webfont assets later if licensing and deployment policy allow
- using `font-display: swap` behavior

Do not change the approved Inter / Space Grotesk pairing during optimization.

## Images and media

Real garment photography will become one of the most performance-sensitive parts of the site.

Requirements:

- generate AVIF/WebP plus suitable fallback where needed
- responsive `srcset` / sizes
- explicit width, height, or aspect ratio to prevent CLS
- lazy-load below-fold media
- prioritize the actual LCP hero/product image
- avoid shipping 3000px originals to mobile cards
- use CDN/image transformations when available
- separate thumbnails, detail media, and full-resolution artwork assets

Customer artwork originals should not be the same files used as public web previews.

## Mobile-first standards

### Touch targets

Design interactive controls to be comfortable rather than merely technically clickable.

- never rely on tiny text as the only tap target
- aim for approximately 44px interaction height for important buttons/rows where the layout permits
- maintain sufficient spacing around compact controls
- Studio swatches and placement controls need especially careful testing

### Sticky UI

Sticky previews, bottom action bars, cookie banners, chat/help tools, and mobile sheets must not cover the currently focused field or control.

### Forms

- correct input types
- autocomplete attributes
- single-column mobile flow
- clear inline validation
- preserve entered state when moving between steps
- do not repeatedly ask for data already collected in the same account/project
- keyboard should not hide submission or navigation controls

### Navigation

Mobile users should be able to understand the site hierarchy without opening several nested menus.

Use clear labels such as:

- Design custom apparel
- Bulk & team orders
- Shop collections

rather than ambiguous labels such as “Explore” or “Get started” when the destination matters.

## Accessibility

Target WCAG 2.2 AA.

### Pointer / dragging

Studio drag interactions must have non-drag alternatives such as:

- X/Y controls
- directional controls
- preset placement buttons
- numeric scale/rotation controls where needed

### Target size

Meet WCAG target-size requirements and design larger targets for key mobile actions.

### Focus

- visible keyboard focus on all interactive elements
- focus not hidden beneath sticky header / sheet / preview
- modal/dialog focus containment and restoration
- no focus loss after dynamic changes

### Tabs

If using ARIA tab patterns:

- tabs and tabpanels need correct relationships
- keyboard behavior should follow the expected pattern

If that complexity does not help the interface, ordinary buttons/links may be the better semantic choice.

### Landmarks

Only one primary `<main>` landmark per document. Current nested account `<main>` should become a section/div landmark structure.

### Motion

- honor `prefers-reduced-motion`
- avoid animation required to understand status
- no decorative movement that competes with garment/product browsing

### Contrast

Test the locked Bone / Steel / Copper combinations in their actual sizes and states rather than assuming palette values are accessible everywhere.

## Content polish standards

### Section budget

Homepage: usually 5–7 meaningful sections.

Capability pages: usually 3–4 substantial sections plus a final action.

Do not add a section because there is more information available. Add it because the information must be understood at that point in the journey.

### Heading budget

Not every section needs:

- eyebrow
- H2
- descriptive paragraph
- card title
- card paragraph

Vary the composition.

Examples:

- image + short caption
- three direct intent links
- one headline + products
- one proof point + media
- compact FAQ accordion

### Prototype language

Development/staging warnings should be environment-specific and visually compact.

Public production pages should not repeatedly say:

- development visual
- interface preview
- planned feature
- future workflow
- brand in development
- this does not submit

A disabled/unlaunched feature should generally be hidden from production rather than explained repeatedly.

## SEO / metadata polish

Before launch:

- route-specific title and description
- canonical URL
- Open Graph and social metadata
- favicon using current approved site mark
- theme color aligned to Carbon `#090B0C`
- sitemap
- robots policy
- factual Organization / LocalBusiness data
- Product / Offer / variant data for actual purchasable merchandise

Avoid structured product data on custom quote templates that are not actually purchasable products.

## Testing stack to add

### Static quality

- ESLint
- formatting policy
- TypeScript strict validation

### Component / domain tests

- Vitest or equivalent
- project/cart calculations
- quote state transitions
- Studio serialization/deserialization
- route helpers
- authorization rules once backend exists

### End-to-end

Playwright coverage at minimum for:

1. Homepage → Studio → save design → project bag
2. Homepage → Bulk → project intake
3. Published product → cart → checkout once direct commerce exists
4. Login → proof approval
5. Reorder → project review
6. Mobile navigation
7. Mobile Studio
8. Keyboard-only critical flows

### Accessibility automation

Add axe-based checks to major routes, while retaining manual keyboard, screen-reader, zoom, contrast, and mobile testing.

### Lighthouse CI

Add budgets/alerts for:

- performance regression
- accessibility regression
- SEO/meta regressions
- bundle growth

Do not optimize solely for a Lighthouse score; use it as a regression tool alongside real-user Core Web Vitals.

### Visual regression

Once the locked design system is stable, capture reference screenshots for major breakpoints/routes. This is especially useful because the current site has many cascading CSS layers and will soon contain creator-specific imagery.

## Responsive test matrix

At minimum validate:

- 320px narrow mobile
- common 360–390px mobile
- large mobile / small tablet
- 768px tablet portrait
- ~1024px tablet/compact desktop
- 1440px desktop
- high-resolution 2K / ultrawide layouts

Also test:

- 200% browser zoom
- reduced motion
- keyboard only
- touch / coarse pointer
- slow network
- long real content rather than only ideal short strings

## Release checklist

Before feature branch → `dev-0`:

- purpose of feature is clear
- no new palette drift
- responsive at target breakpoints
- keyboard usable
- typecheck / build / lint / tests pass
- no private/internal business content exposed
- no fake data presented as real
- copy does not repeat information unnecessarily

Before `dev-0` → `main`:

- production environment configuration checked
- staging-only notices removed/hidden
- Lighthouse / accessibility / E2E gates pass
- payment/webhook behavior tested if touched
- emails/notifications verified if touched
- metadata and canonical behavior verified
- analytics events verified
- privacy/security review for any new data collection
- rollback path known
