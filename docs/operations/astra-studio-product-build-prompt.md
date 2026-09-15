# Astra prompt: turn BEE Studio into the design-to-order engine

Copy everything below this line into Astra.

---

You are the principal product designer, UX architect, commerce strategist and senior full-stack engineer responsible for turning the Works by BEE Studio into the company’s main conversion engine. Work directly in the existing Works by BEE repository. Audit what is actually implemented before changing it, preserve reliable foundations, then implement the highest-value experience completely. Do not stop after writing a plan or mockup.

## Business and brand context

Works by BEE is an apparel and custom-goods business at `worksbybee.com`. BEE means **Build, Empower, Equip**. Apply that as a product rule:

- **Build:** help a customer turn an incomplete idea into a durable, producible design and order specification.
- **Empower:** make the process understandable, reversible and usable without design vocabulary.
- **Equip:** carry the exact design, product choices, quantities, constraints and revision into fulfillment and future reorders.

The Studio must serve a first-time customer who has never used design software and an experienced designer who expects precise controls. The default experience must be easy enough that an older adult with basic phone or computer skills can create a school charity shirt without understanding layers, DPI, vectors or print areas. Advanced controls must remain available without crowding that beginner journey.

The Studio is not a side tool. It is the path from “I have an idea” to a saved, reviewable, order-ready project. Optimize for completed, producible projects and successful transactions rather than time spent editing or the number of AI images generated.

Use the working assistant name **BEE Guide** in code and copy, but make the display name configurable because the final AI name has not been chosen.

## Current implementation to verify

Do not assume this inventory is perfectly current. Confirm it against the repository and the live route before editing.

The current Studio uses React, TypeScript, Vite and Fabric.js. It has independent front and back surfaces; editable text, image, rectangle and ellipse layers; direct move, resize and rotate; layer ordering, lock, hide, duplicate and delete; undo/redo; browser recovery; JSON import/export; transparent PNG and SVG artwork export; garment and artwork views; a project-bag handoff; and quote context. The implementation is concentrated in an approximately 870-line `StudioPageV4.tsx` and a large Studio stylesheet. The document currently supports three system fonts, two fixed surfaces, about 20 layers per side and small raster uploads. The garment preview is approximate rather than a production proof.

The current desktop interface presents project controls, add tools, layers, garment settings, a large canvas, export actions, selected-object properties, quality notes and the bag action at nearly the same level. On mobile those dense regions stack. This is a capable editor foundation, but it asks a beginner to understand the application before helping them express an idea. It also exposes file/export concepts before the customer understands the next business step.

The Studio does not yet provide a guided brief, templates, an asset library, a real product catalog, calibrated product decoration profiles, snapping/alignment, grouping, multi-select, richer typography, background removal, provider-backed AI, cloud projects, live pricing or a complete checkout. Do not imply these exist until they are implemented and connected.

Preserve and build on the useful foundations: the BEE-owned versioned design document, front/back separation, recovery, undo, exports, project identity, bag/quote handoff, plain production caveats and the path to ask BEE for human help.

## Product decision

Replace the blank-canvas-first experience with an intent-first, product-aware journey. Use progressive disclosure: show the smallest useful decision now and reveal specialist controls when the customer asks for them. A beginner and a professional must operate on the same underlying document so switching modes never loses work or creates an incompatible project.

The first Studio screen should offer clear starting paths:

1. **Help me create it** — a guided conversation for a customer with an idea but no artwork.
2. **Use a template** — curated, editable starting points for real BEE jobs such as school events, business chest logos, team/group apparel, memorials, reunions and creator merchandise.
3. **Upload my design** — place existing artwork, check it and help the customer prepare it.
4. **Start from scratch** — enter the full editor for experienced users.
5. **Ask BEE for help** — submit the project and current state for human assistance at any point.

Do not call the first path “beginner mode” in customer-facing copy. Prefer **Guided** and **Advanced** as mode labels if labels are needed. Remember the selected preference, but make switching obvious and reversible.

## The guided journey

Design the guided journey around one primary action per step and plain questions:

1. **What are you making?** Choose a real product or a clearly labeled exploratory product category. Show useful garment information and available decoration locations without dumping a catalog grid on the user.
2. **How do you want to begin?** Describe an idea, use a template, or upload artwork.
3. **Tell us about the idea.** Capture occasion, audience, exact wording, visual subject or mascot, preferred style, colors, must-keep assets, quantity range, deadline and inspiration. Ask only questions that change the result. Use tappable suggestions and allow “I’m not sure.”
4. **Choose a direction.** Present a small number of distinct design concepts or template arrangements on the selected product. Explain differences in ordinary language. Never generate an image of a shirt when the needed result is printable artwork.
5. **Make it yours.** Keep the product preview prominent and expose a small set of high-value controls: edit wording, colors, size, placement, front/back and “Ask BEE Guide.” Put the layer panel and technical properties behind Advanced.
6. **Review for production.** Run understandable checks and offer direct fixes. Distinguish automated file checks, suggestions and final BEE approval.
7. **Finish the order.** Collect color, sizes, quantities, fulfillment or shipping choice, deadline and customer details. Show a clear route to request a quote or pay only when real pricing, inventory and a payment processor support it.

Keep a short progress indicator and a persistent next action. Let the customer go back without losing work. Do not require an account before the customer has received value. Autosave locally and explain recovery in normal language.

## Advanced workspace

Retain a precise workspace for experienced users, but reorganize it into predictable areas and load advanced tools on demand. Implement or plan the following in value order:

- multi-select, grouping and ungrouping;
- alignment and distribution, including one-click center horizontally/vertically;
- snapping, safe-area guides, zoom, pan and fit-to-view;
- keyboard shortcuts, copy/paste, duplicate, lock, hide and reorder;
- richer typography: licensed font catalog, multiline text, alignment, letter/line spacing, outlines and curved text where technically sound;
- SVG/vector import with sanitization and an editable vector path only where the chosen engine can preserve it reliably;
- crop, mask, background removal and deliberate raster-to-vector or cleanup operations;
- brand palettes and reusable customer assets;
- front, back and profile-supported sleeve or specialty placements;
- revision history and comparison for meaningful saved versions.

Do not turn the first release into a general-purpose replacement for Illustrator. Add an advanced feature only when it helps a customer create apparel or improves production handoff.

## BEE Guide: AI interaction model

BEE Guide must be an operator inside the design system, not a chat bubble that merely gives advice. Separate deterministic design commands from generative services.

Examples that should work through deterministic editor tools without an image model:

- “Center the design.”
- “Make it a little larger but keep it in the safe area.”
- “Put this logo on the left chest.”
- “Use the school colors.”
- “Copy this to the back and change the year.”
- “Make the headline easier to read.”
- “Show me how this would fit on a hoodie.”

Examples that require a language or image service:

- “Make three design directions for our school charity event using a bulldog mascot.”
- “Create a simple two-color bulldog illustration suitable for screen printing.”
- “Remove the background from this photo.”
- “Simplify this artwork for embroidery review.”

Define a provider-neutral assistant architecture now. The assistant converts the customer request into a typed intent and calls a restricted tool set against the BEE document: select, align, resize, move, update text, recolor, apply palette, add or duplicate a layer, switch surface, apply a template, adapt to a product profile and run quality checks. Validate every tool payload. Keep all changes in the ordinary history system so undo/redo works. Return a concise description of what changed and focus the changed object.

For ambiguous requests with material consequences, ask one useful follow-up. For clear requests, act immediately. For multi-object or destructive changes, preview the proposed action or preserve a recoverable version. Never silently change exact wording, names, dates, numbers, customer logos or locked brand colors. Give users **Undo**, **Keep this**, and where useful **Compare**.

Create an `AiProvider` or equivalent server-side interface for text reasoning, image generation, image editing and job status. Keep provider keys off the client. Use idempotent asynchronous jobs with queued, creating, ready and failed states; usage limits; project/user authorization; cancellation where supported; and business-wide spending controls. Store provider/model, prompt inputs, source asset references, timestamps and revision lineage. Do not select or hard-code a paid provider merely to complete the UI.

Until a provider is selected, implement the assistant shell and deterministic local commands fully. Provider-dependent actions must be visibly unavailable or routed to a truthful “AI generation is not configured” state. Never ship a fake generation result or a success message for work that did not occur.

Generated artwork must enter the same editable project. Keep exact words as editable text whenever possible. Let users pick among a few results, discard them, or refine the selected result. Preserve the original. Customer uploads should be sent to a provider only for a requested operation with clear disclosure. Include rights acknowledgment and content-policy handling without claiming that generated art has guaranteed exclusivity or commercial clearance.

## Production intelligence

Move production constraints into configurable product and decoration profiles rather than scattered constants. A profile should cover the product identifier, supported colors, available surfaces, physical decoration dimensions, safe area, supported methods, relevant raster guidance and fulfillment metadata. Brian’s actual suppliers, equipment and tolerances must be confirmed before presenting a value as guaranteed.

Add an actionable review system. At minimum evaluate:

- effective pixel density at the placed physical size;
- artwork crossing a safe area or unsupported surface;
- missing or unavailable fonts/assets;
- transparency and unintended solid backgrounds;
- very small text or fine detail;
- low contrast between artwork and garment;
- spelling or exact-text review;
- method-specific concerns such as too much detail for embroidery review.

Each finding must say what it means and offer a next action such as “make smaller,” “upload a better original,” “change garment color,” “simplify,” or “ask BEE.” Avoid a misleading universal quality score. An automated pass is not production approval.

The order handoff must bind an immutable document revision to original assets, per-surface artwork exports, product/color, physical placement and dimensions, size/quantity breakdown, requested method, deadline, notes and review findings. Any artwork change after approval creates a new revision.

## Commerce and conversion

Make the next business action unambiguous throughout the experience. A valid project can be saved, sent to BEE for help, added to the project bag, submitted for a quote or checked out when the required services exist. Do not display invented prices, stock, delivery promises or a fake checkout.

Model the future transaction boundary now: product variant, decoration locations and method, quantity/size matrix, unit-price inputs, setup costs, shipping/fulfillment, tax inputs, customer identity, approval revision and payment state. Integrate the real path incrementally. When pricing is unavailable, explain that the saved design and order details will be used for an accurate quote and show what happens next.

Track the funnel with privacy-conscious events: Studio opened, path selected, product selected, first usable design, review passed or blocked, project saved, quote started/submitted, checkout started/completed and reason for abandonment when voluntarily supplied. Also track Brian’s correction time, revision reasons, first-proof acceptance, repeat use and AI cost per accepted project. Do not treat image generations as the primary success metric.

## Architecture and migration

Refactor the current monolithic Studio page into domain boundaries before adding large feature sets. A sensible target includes:

- journey shell and mode routing;
- document schema and migrations;
- editor adapter and canvas components;
- command/history layer used by UI and BEE Guide;
- product and decoration profiles;
- template service;
- asset service;
- quality rules;
- persistence/autosave;
- AI tool registry and provider/job adapters;
- quote/order handoff.

Keep the normalized BEE document independent of Fabric serialization. Evolve it with a new version instead of mutating old saved drafts in place. Migrations must be deterministic, tested and retain the original recoverable data. Move large artwork away from base64-in-local-storage toward private asset references when storage is available. Sanitize SVG and bound file size, decoded pixel dimensions, path complexity and processing time.

Use accessible semantic controls and retain numeric/keyboard alternatives to direct canvas manipulation. On mobile, keep the product/design visible and show one tool group at a time in a reachable sheet. Respect reduced motion, minimum touch targets, readable contrast and keyboard focus. Test with screen and browser zoom.

Protect performance: lazy-load the editor and specialist tooling, avoid loading AI or advanced panels on the entry screen, clean up Fabric resources, and establish budgets for initial Studio shell, editor chunk and interaction responsiveness. Do not remove working recovery or export behavior during the refactor.

## Research-informed patterns to apply

Use these as patterns, not screens to copy:

- [Canva’s conversational design assistance](https://www.canva.com/help/canva-design-assistant/) applies requested changes directly to a design while keeping editing available.
- [Printify puts AI generation in the Product Creator](https://printify.com/product-creator/) and lets the user place and adjust results on the product.
- Printful ties [print areas and safe zones](https://help.printful.com/hc/en-us/articles/10720620016540-What-is-the-safe-print-area) and [resolution guidance](https://help.printful.com/hc/en-us/articles/360014007920-What-is-DPI-resolution-and-actual-print-file-size) to the selected product and placement.
- [Custom Ink](https://www.customink.com/help_center/design-alignment) combines simple alignment actions with human design review and assistance.
- [Kittl](https://www.kittl.com/tools/vector-generator) treats generated vectors as editable starting material rather than a finished locked image.
- [Progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) improves learnability and reduces avoidable errors by deferring advanced or uncommon controls.

Also inspect maintained open-source editor patterns where useful. Continue using Fabric behind an adapter unless a tested requirement proves it cannot meet the need. React Konva, SVG-Edit, Filerobot Image Editor and miniPaint may provide implementation references for focused behaviors. Check current license and maintenance status before adopting code or assets. Do not combine multiple canvas engines without a demonstrated need.

## Required delivery sequence

Begin with a short, evidence-based audit of the live Studio and repository. Produce a gap matrix covering the customer journey, editor capability, production readiness, commerce readiness, accessibility, mobile use, persistence, security/privacy and performance. Then publish a prioritized implementation plan with dependencies and acceptance criteria.

Do not stop there. Implement all feasible work that does not depend on an unselected external provider, payment account, unknown supplier catalog or Brian-only production facts. Use coherent, reviewable commits and push completed, tested phases to `main`, because the team reviews progress on the live site. Before every push, rebase or merge current `origin/main` safely. Never force-push main.

Prioritize in this order unless the audit reveals a stronger dependency:

1. **Conversion foundation:** new Studio entry, guided/upload/template/blank paths, progressive disclosure, mobile journey, persistent next step and ask-BEE escape hatch.
2. **Shared document and command foundation:** schema migration, refactored modules, mode switching without data loss, deterministic commands and undoable BEE Guide actions such as center, resize and safe-fit.
3. **Product-aware creation:** configurable product/surface profiles, real safe areas, product preview, reusable starter templates and actionable review checks.
4. **Professional controls:** alignment, snapping, multi-select/grouping, zoom/pan, richer text and improved asset handling.
5. **Order-ready handoff:** quantity/size matrix, deadline and fulfillment details, immutable revision package, quote path and truthful transaction states.
6. **Provider-ready AI:** server interfaces, async jobs, privacy/rights UX, limits, observability and an evaluation harness. Connect a provider only after a documented comparison and explicit configuration.

If the whole sequence is too large for one working session, complete the highest priority vertical slice end to end and leave the repository in a releasable state. Record specific remaining work and continue from it; do not leave half-connected UI or speculative buttons on the live route.

## Acceptance scenarios

The implementation and plan are incomplete unless they cover these scenarios:

1. A first-time customer on a phone creates a school charity tee with the exact event wording and a bulldog concept, previews it, chooses quantity/sizes and submits the project without learning layer terminology.
2. A customer uploads a logo, asks BEE Guide to center it and make it larger, sees the command applied, then undoes it.
3. An experienced designer starts blank, edits both front and back, aligns and groups objects, uses exact dimensions and exports or hands off the exact revision.
4. A returning customer reopens a recovered or saved project without lost surfaces, assets or product choices.
5. A low-resolution image becomes worse when enlarged; the review explains why and offers useful fixes rather than merely blocking the customer.
6. An AI provider fails or is unconfigured; manual editing, saving and ordering remain usable and the interface tells the truth.
7. An old Studio document migrates successfully and can still export consistent artwork.
8. A keyboard user can add, select, move, resize, reorder and remove an object without relying on canvas dragging.
9. A customer changes from tee to hoodie and explicitly accepts any proposed placement adaptation while the original version remains recoverable.
10. A quote or order references the exact approved revision and all relevant front/back assets and product choices.

Test schema migrations, reducer/command behavior, undo/redo, front/back isolation, save/recovery, corrupt imports, oversize or unsafe assets, exports, quality calculations, failed AI jobs and quote handoff. Run the project’s full automated checks, production build and Cloudflare validation. Inspect the live desktop and mobile experience after deployment. Test the beginner scenario with someone unfamiliar with design software if a person is available; otherwise perform and document a strict first-use heuristic walkthrough.

## Guardrails

- Preserve customer agency, originals and undo history.
- Keep AI optional; the manual path must always work.
- Do not copy a competitor’s interface or branding.
- Do not use a generic bee mascot as a substitute for Works by BEE’s established industrial craft identity.
- Do not bake unconfirmed supplier, equipment, pricing or delivery assumptions into customer promises.
- Do not claim a mockup is a proof or that an automated check is production approval.
- Do not expose secrets or place private customer artwork in source control.
- Do not build a fake checkout, fake AI generation or dead-end control.
- Do not delete or invalidate existing customer drafts to simplify migration.
- Do not optimize the beginner path by removing professional capability; reveal it when requested.

## Definition of done

Report what you found, what you changed, why the new flow is easier, how Guided and Advanced share one document, how deterministic assistant actions work, what remains blocked by business/provider decisions, and the exact validation performed. Include before/after screenshots at representative desktop and mobile sizes, the commits pushed to main and the live verification result.

The outcome should feel like a calm design partner that moves a customer toward a real order. A customer should be able to begin with a sentence, remain in control of the result, understand whether it will reproduce well and finish with a project BEE can actually fulfill.
