# BEE — editorial character and purposeful motion

29 October 2026

## Reference review

Reviewed the [Lenis showcase](https://lenis.dev/showcase), then explored [Serotoninn](https://serotoninn.com/) and its product presentation. The useful lessons are strong typographic hierarchy, tactile garment imagery, a recognizable visual language, and movement that connects one part of the brand story to another. Serotoninn's split imagery, oversized condensed headings and campaign sections give it an editorial identity.

BEE's translation centers custom apparel: an idea becomes artwork, then a possible garment. It retains BEE's charcoal/teal palette and direct Home → Shop navigation. No reference imagery, brand assets, layout code or text was copied.

## Implemented

- A bolder condensed headline, fabric texture, editorial image labeling and original overlaid type give the homepage a stronger first impression.
- The existing optimized, labeled AI apparel study remains the hero asset; its responsive variants and high-priority loading remain intact.
- Category cards keep direct URLs and gain subtle pointer-device hover movement. Product selection is always an ordinary link.
- The custom-studio invitation becomes a three-stage **Idea → Artwork → Your piece** example with original inline SVG artwork. Buttons work with a keyboard, report their selected state and update a complete live description. There is no automatic stage cycling.
- The example is explicitly illustrative, not a product or production proof. The CTA starts a fresh T-shirt concept in the real Studio; no example is silently imported as customer artwork.
- Below-fold editorial content has one short entrance. It stays visible before enhancement, on unsupported browsers, for reduced-motion visitors and when focused. The first view and shopping controls are never held behind a loading animation.
- Homepage presentation styles are split from shared styles and declared in the generated page head. Shop and project tools do not download the new homepage stylesheet or interaction component.

## Why no Lenis dependency

Lenis provides scroll smoothing; it does not provide the art direction or garment narrative. This release uses native scrolling with small transform/opacity transitions. [Lenis's official documentation](https://github.com/darkroomengineering/lenis#settings) confirms reduced-motion support and describes extra configuration for anchors and nested scroll areas. BEE's canvas editor, nested panels, native dialog and forms benefit from retaining their established scroll behavior.

## Verification

Full checks cover frontend/server types, 140 tests across 17 suites, the production build, targeted axe checks and existing contrast checks. New tests cover stage selection, truthful links, no autoplay, static/failure fallback, reduced motion, focus and cleanup. Home/Shop JavaScript and shared CSS remain within the existing limits; a separate 4.5 kB gzip homepage-style budget prevents the visual pass from growing without bounds.

Production gzip sizes before final publication: Home initial JavaScript approximately 72.3 kB, Shop 70.0 kB, shared CSS 17.5 kB and homepage presentation CSS 2.5 kB. No dependency, external font or new raster image was added. These are asset measurements, not a Lighthouse or field Core Web Vitals claim.

Browser QA includes phone/tablet/desktop widths, horizontal overflow, keyboard stage changes, category links, Studio handoff and mobile composition. Reduced-motion behavior is covered by automated tests and scoped CSS; a full screen-reader/device audit remains distinct.

## Content and commerce boundaries

Real approved BEE product photography and process footage would add more authentic craft evidence when available. This release keeps concept labels visible rather than inventing finished work. Square checkout and online request activation remain separate milestones; visual polish does not enable payment or submission.
