# BEE Studio: research and product blueprint

Research date: September 15, 2026. Scope: the studio and its design-to-production handoff. This is a researched development direction, not a claim that the proposed features are implemented.

## The breakthrough

BEE can help someone who has an idea—but no design skills or production knowledge—create apparel they are proud to wear, with Brian guiding the final result. The studio should shorten the distance between an idea and a producible, approved design. Its success should be measured by good projects and easier repeat orders, not the number of images generated.

The product promise: **Create your idea. Make it yours. Work with BEE to bring it to life.**

Build means supplying useful tools and a durable design document. Empower means allowing customers to experiment, understand choices, undo changes and ask for help. Equip means delivering the assets, measurements and decisions Brian needs to produce the work. This applies the DTB approach to the full customer task.

Preserve the earlier direction: modern apparel presentation, a more technical studio interface, convincing 2D previews before 3D, and a route to request help without having to use the editor. Brian's actual equipment, garment suppliers, usable decoration areas and digitizing workflow have not been established. These must become configurable production profiles, not assumptions baked into the editor.

## Evidence and limits

Reviewed the current StudioPageV3.tsx, StudioDraft/project storage model, relevant styles and package manifest. Researched official competitor pages, upstream repositories, selected source files, license files and AI provider documentation. These are documented capability comparisons; no paid competitor account, model comparison or physical production test was performed.

Repository activity was checked through GitHub on the research date. A recent push is a maintenance signal, not evidence of a stable release or adequate test coverage. Pin and validate a published version during the implementation prototype. No third-party editor code was copied into BEE during this research.

## Current studio assessment

| Area | What exists | What must change |
|---|---|---|
| Garment selection | Tee, hoodie, polo, shared color palette | Confirm product profiles and real available colors; preserve exploratory selections as requests until confirmed |
| Preview | SVG silhouettes, front/back switching | Use licensed product imagery or calibrated mockups; separate garment appearance from decoration geometry |
| Artwork | One PNG/JPEG/WebP preview under roughly 250 KB | Preserve original files and metadata separately from small previews |
| Composition | Text and image share one positioned container | Independent text, image and vector layers with selection, grouping and ordering |
| Placement | One preset, percentage X/Y and scale | Independent front/back documents, then supported sleeves; physical dimensions and product-specific bounds |
| Typography | One short text field and color choices | Licensed fonts, multiline text, sizing, alignment, spacing and later curved text |
| Interaction | Form fields and sliders | Direct manipulation plus accessible numeric/keyboard controls, undo/redo and zoom |
| Persistence | Explicit browser save, reopen, JSON download | Autosave/recovery, clear unsaved state, versioned documents and a tested import path |
| Order connection | Saved draft enters project bag | Carry every placement, asset and exact design revision into the request |
| Quality | Mockup/final-proof notices | Live, actionable artwork checks tied to decoration method |
| AI | No generation service | Controlled generation and editing jobs, selectable results, provenance and spending limits |

Changing the view currently does not create a second design surface. Changing placement moves the same design. The suggested decoration area is visual guidance rather than a production constraint. The embroidery appearance is a preview treatment, not a stitch simulation. A JSON download preserves the existing draft fields but is not a production artwork export.

The existing local draft identity and project-bag connection are worth retaining. Migrate old drafts without deleting the original or pretending that their percentage coordinates are verified physical measurements.

## Competitor inspiration

| Reference | Verified pattern | Application to BEE |
|---|---|---|
| [Custom Ink design assistance](https://www.customink.com/help_center/faq-get-help-with-my-design) | Design Lab customers can obtain help with artwork, color and review | Keep “Ask BEE for help” available with the current design attached; human expertise is part of the service |
| [Printful Design Maker](https://www.printful.com/design-maker) | Product selection, design creation, saved templates and an order/sell handoff | Begin with a product context, preserve a reusable design, and make the next step explicit |
| [Kittl AI vector generator](https://www.kittl.com/tools/vector-generator) and [vector tools](https://www.kittl.com/features/vector-suite) | Generated vector artwork can be refined using editing tools | AI results should enter an editable workflow; typography, colors and placement must remain under customer control |
| [Kittl vectorizer](https://www.kittl.com/tools/vectorizer) | Raster-to-vector conversion is offered alongside design tools | Offer cleanup/conversion as a deliberate operation with a comparison, not an automatic guarantee of better artwork |

Printify's public AI-related pages were also explored, but the fetched pages did not provide enough stable detail for a reliable feature-by-feature comparison. Do not base implementation requirements on their search snippets.

These competitors establish useful patterns, not proof that BEE will outperform them. BEE's opportunity is a focused apparel experience combined with Brian's production judgment, saved customer assets and repeat-order context. A broad design application would add substantial complexity without necessarily helping customers finish an apparel project.

## Open-source and commercial foundations

| Project | License/status checked | Useful role | Assessment for BEE |
|---|---|---|---|
| [Fabric.js](https://github.com/fabricjs/fabric.js) | MIT; not archived; push Sep 13, 2026 | Object transforms, editable text, grouping, JSON and SVG interchange | **Leading prototype candidate.** Strong starting point for an object-based apparel editor; BEE still owns the interface, history, persistence and production rules |
| [React Konva](https://github.com/konvajs/react-konva) | MIT; not archived; push Sep 9, 2026 | React-managed canvas scene and interactions | Strong alternative for a highly tailored React editor. More design-editor behavior would need to be assembled and export requirements proven |
| [SVG-Edit](https://github.com/SVG-Edit/svgedit) | MIT; not archived; push Aug 5, 2026 | Full browser SVG editor and separable svgcanvas engine | Useful reference for advanced vector work; its general-purpose interface is more complex than the initial customer task |
| [Filerobot Image Editor](https://github.com/scaleflex/filerobot-image-editor) | MIT; not archived; push Jun 16, 2026 | Crop, adjustments, filters and image preparation | Candidate for a focused “Edit image” tool. Its documented design-state save/load is experimental; do not make that BEE's authoritative project format |
| [miniPaint](https://github.com/viliusle/miniPaint) | MIT confirmed in [license file](https://github.com/viliusle/miniPaint/blob/master/MIT-LICENSE.txt); not archived; push Apr 20, 2026 | Browser raster editing with layers and cleanup tools | Useful workflow reference or later specialist tool; a full photo editor is too much interface for the first studio release |
| [Ink/Stitch](https://github.com/inkstitch/inkstitch) | GPL-3.0; not archived; push Sep 14, 2026 | Inkscape-based embroidery digitizing and machine-format output | Explore for Brian's production workflow. It is not a drop-in browser editor or a one-click guarantee of stitch quality |
| [Polotno SDK](https://polotno.com/docs/overview) | Commercial SDK; separate from open-source canvas libraries | Packaged editor UI, state and export facilities | Build-versus-buy fallback. Obtain appropriate commercial terms before adoption; publicly visible examples do not make the SDK free |

GitHub's license detector returned NOASSERTION for miniPaint; the actual MIT license file resolved that ambiguity. Preserve license notices and inspect dependencies/assets separately when adopting any project. Treat Ink/Stitch as a separately evaluated production tool; do not copy its internals into BEE without assessing the applicable obligations.

Polotno's [published SDK pricing](https://polotno.com/sdk/pricing) showed $899/month for self-serve licensing and a $249/month grassroots option subject to eligibility review on the research date. BEE should not assume it qualifies for the lower tier. No purchase is proposed here.

Selected source inspection went beyond README claims: Fabric's StaticCanvas implements JSON serialization/loading and SVG export; IText includes text-editing behavior. React Konva's current ReactKonvaCore source explicitly checks for React 19, which matches BEE's current major version. That is compatibility evidence, not a successful BEE integration test.

**Architecture recommendation:** prototype Fabric behind a small rendering adapter while keeping a BEE-owned document schema. Avoid running Fabric and Konva together in the main editor. Reconsider the engine only if the prototype fails a concrete requirement.

## The customer experience

Start with four useful entry choices: upload artwork, start from a template, describe an idea, or start blank. A customer can also ask BEE to help. Templates should reflect real work: business chest logos, school/team designs, events and creator merchandise. Begin with a small curated collection of layouts BEE can actually support.

Desktop layout: compact project/save bar; tools on the left; a large center workspace; properties for the selected object on the right; persistent design review action. Provide front/back tabs with previews so customers understand each surface holds independent content. Put garment/quantity details in a collapsible panel rather than competing with editing controls.

Mobile layout: the artwork stays visible above a bottom tool sheet. Show one tool panel at a time. Provide numeric position/size inputs, visible selection, pinch/zoom where supported, and controls that remain reachable with the keyboard open. A keyboard-accessible layer list must provide an alternative to canvas-only interaction.

Visual direction: charcoal work surfaces, blue-white active controls, restrained violet for AI assistance and amber for issues needing attention. Keep colors on the artwork accurate; selection glows belong around controls, not across the customer's design. Use fine boundaries and readable labels instead of decorative grids. Keep motion subtle and respect reduced motion.

Two views of the same document matter: **Artwork** shows the flat decoration surface for precise editing; **On garment** shows its approximate appearance. A photographic mockup does not replace dimensions or proof approval. Introduce 3D only after testing whether customers need it to make a decision that convincing 2D views cannot resolve.

## AI assistance with real creative control

AI should work on chosen assets and propose changes the customer can accept. Preserve the original, show alternatives and make every accepted change undoable. Do not silently regenerate an entire composition when a customer asks to alter one element.

| Customer task | Proposed assistance | Control retained |
|---|---|---|
| “I have an idea, no artwork” | Guided brief captures subject, style, colors, placement and intended method; generate a small set of concepts | Pick, refine or discard; blank editor remains available |
| “This needs to match my brand” | Use authorized reference art to generate supporting graphics or layout suggestions | Lock the original logo and exact colors/text |
| “Make this simpler” | Propose fewer details or a limited palette for the intended decoration | Before/after comparison and human review of suitability |
| “Change this part” | Select an image/layer or mask and request a targeted edit | Keep unaffected layers and the previous version |
| “Make the design work on a hoodie” | Suggest a revised layout for the new product's decoration area | Confirm the new layout; retain the tee version |

Keep names, numbers, slogans and logos as ordinary editable text/vector assets wherever possible. An AI-generated raster illustration is still a single raster image; it does not automatically provide independently editable objects. Actual vector outputs must be inspected and sanitized. Vectorization can change details, and upscaling cannot prove that invented detail matches the intended artwork.

### Provider evaluation

Shortlist hosted APIs before considering a self-hosted model. [OpenAI's image documentation](https://developers.openai.com/api/docs/guides/image-generation) describes generation/editing and transparent output options; [Adobe Firefly's API](https://developer.adobe.com/firefly-services/docs/firefly-api/) offers image-generation services; [Black Forest Labs](https://docs.bfl.ai/quick_start/introduction) documents generation and editing through its API. These are candidates, not an evaluated winner. Current project code has no generation-provider integration.

Use a small BEE-specific evaluation set: clean two-color graphic, detailed creator illustration, composition with a separately supplied logo, selected-region revision, background cleanup, and a design intended for embroidery review. Compare instruction adherence, unwanted changes, edge quality/transparency, actual usable resolution, latency, failure rate and cost per **accepted design**. Brian should judge sample output at the intended physical size. Provider pricing and terms must be checked for the selected model at implementation time.

Generate the decoration artwork separately from the garment mockup. Otherwise customers may receive attractive images of clothing instead of usable artwork for clothing.

### Service design

The browser submits an authorized design job to the server. The server validates access and budget, queues the operation, calls a provider, stores the result privately and returns an asset reference. The customer inserts the chosen result into the document. Keys stay server-side. Refreshing or retrying must not create duplicate jobs or duplicate customer charges.

Record provider/model, generation time, source asset references and revision lineage. Keep job states understandable: queued, creating, ready or failed. Preserve manual editing during provider outages. Proposed rollout: limited trial generation, clear usage remaining, account/project limits and a business-wide spending cap. Do not launch unlimited anonymous generation.

Customer uploads should remain private and be sent to an AI provider only for an explicitly requested AI operation, with clear disclosure. Provide an artwork-rights acknowledgment at the relevant step, respect provider restrictions, and support reporting/removal. Do not promise exclusive ownership or guaranteed commercial clearance merely because artwork was generated.

## Quality assistance and production handoff

A quality panel should explain the issue and offer a practical next action: smaller placement, better original, different treatment or help from BEE. Distinguish a deterministic file check, a heuristic suggestion and Brian's approval. Avoid a single “100% quality” score.

For raster art, calculate effective pixel density at its actual placed size. For example, 1024 pixels across 12 inches is approximately 85 pixels per inch; at 4 inches it is 256. Changing a file's DPI label alone does not add pixels. Printful's [file guide](https://www.printful.com/uk/blog/everything-you-need-to-know-to-prepare-the-perfect-printfile) illustrates product-specific print areas and resolution guidance. Its values are a reference, not BEE's universal production specification.

Proposed checks: image dimensions/decodability; artwork outside the permitted area; missing fonts/assets; unintended solid backgrounds; very small lettering; low visual contrast; transparency/edge concerns; and color/detail suitability for the chosen method. Explain when a check cannot be completed until the product or process is confirmed.

Embroidery needs a distinct path: design simplification, digitizing, thread/stitch decisions and an appropriate sample review. A stitch-textured preview or generated SVG is not a machine embroidery file. Define acceptable lettering/detail with Brian using the actual fabric, thread, hoop and equipment rather than imposing a borrowed universal threshold.

The handoff package should contain the immutable design revision, original assets, separate artwork exports for each surface, garment preview, physical dimensions, requested method, product/color/size plan, customer notes and quality findings. Later proofs should identify the precise revision approved. Any artwork change after approval creates a new revision requiring review.

## Data and rendering decisions

Use a versioned document with product/profile reference, independent surfaces, typed layers, physical coordinates, asset references and revision identity. Keep preview transforms separate from production geometry. Include font identity/version, original pixel dimensions, crop/transforms, layer locks, AI lineage and review results.

Use browser storage suitable for draft documents and blobs, with quota/error handling and downloadable recovery. Cloud originals require private object storage and project-scoped access; do not put base64 artwork or customer assets in source control. Background processing must enforce byte, pixel, path-complexity and time limits. Sanitize SVG scripts, external references and unsafe content before preview/rendering.

Export should come from the document, not a screenshot of the UI. Validate fonts, clipping, alpha, scaling and supported SVG behavior. A server renderer may require a separate runtime from the current Cloudflare Worker; do not assume Node canvas dependencies run there. Keep BEE's normalized document independent of the engine's serialization details.

## Prioritized development sequence

| Priority | Deliverable | Completion evidence |
|---|---|---|
| P0 | Fabric prototype and document schema | Editable text/image/vector layers; front/back preservation; resize/rotate; JSON round-trip; expected artwork export; React integration; keyboard and mobile feasibility |
| P1 | Reliable customer editor | Undo/redo, layers, snapping, physical sizing, autosave/recovery, original-file preservation, draft migration and project handoff |
| P2 | Quality guidance and useful templates | Product-aware bounds; actionable artwork findings; curated apparel layouts; reproducible per-surface exports reviewed by Brian |
| P3 | AI creation and selected-asset editing | Provider comparison completed; accepted outputs editable as appropriate; no silent replacement; job recovery; private assets; spending controls |
| P4 | Repeat-design efficiency | Saved brand assets, locked logos, garment variants, names/numbers and reuse of approved design revisions |
| Later | Advanced vector tools, collaboration and 3D | Add only after observed customer needs justify the added complexity |

P0 is deliberately small: one garment profile, two surfaces and a representative design. It must prove the hard foundation before the studio acquires a large tool catalog. AI UI and evaluation preparation can follow the same schema work, but public generation should wait for reliable saving and asset handling.

Launch tests should cover reload recovery, corrupt/oversized imports, missing fonts, transparent edges, different screen sizes, keyboard-only edits, front/back isolation, undo after an AI insertion, failed jobs, export scale and exact-revision handoff. A test with real apparel samples is a separate gate for any production-quality claim.

Track time to first usable design, abandoned designs, submitted requests, Brian's correction time, reasons for revisions, first-proof acceptance, repeat orders and AI cost per accepted project. Establish a baseline before promising improvements.

The immediate recommendation is to build and evaluate the P0 editor foundation next. The studio can become a durable advantage when a customer's creative effort survives intact from the first draft to the next order.
