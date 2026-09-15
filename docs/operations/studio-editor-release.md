# Studio editor foundation

September 15, 2026. Implements the initial editor foundation from studio-research-blueprint.md using pinned Fabric.js 7.4.0.

The studio now has independent front/back documents, text/image/rectangle/ellipse layers, direct object transforms, keyboard-accessible property fields, layer ordering, lock/hide/duplicate/remove, and bounded undo/redo. Drafts have a versioned BEE schema independent of Fabric serialization. Existing drafts open as new migrated copies; legacy originals remain available. Migration preserves text/art assets and the original side but uses new starter coordinates: the UI asks customers to check placement.

A debounced browser recovery copy stores the most recently edited design. It is not a cloud account or a complete archive of every unsaved project. Explicit Save to My projects and editable JSON downloads remain available. Recovery records the draft identity in the URL so refresh after reopening a saved draft restores newer edits. Storage failures show a download recovery message.

Both surfaces survive server validation, request snapshots, project history and reorders. Quote review and staff detail show both sides. SVG and transparent 1800×2400 PNG exports use a separate Fabric canvas populated from the same document adapter. They exclude the garment, selection handles and editor UI. The SVG's physical board size is 12×16 inches; the PNG is 150 PPI at that board size. Fonts remain system-font references rather than outlined text. Preview SVGs use a lightweight approximate renderer and are labeled accordingly; use the Fabric export for actual artwork layout.

Limits remain explicit: 20 layers per side; 250 KB uploaded raster images; one-million-character document limit; supported raster data URLs only; maximum decoded image area of 16 million pixels in the canvas adapter. Larger production originals, arbitrary SVG/vector file import, custom fonts, multiline/curved text, snapping, zoom controls, product-specific dimensions, cloud persistence and AI generation are not shipped by this milestone. Imported originals within the upload limit are embedded unchanged in the editable document. No AI service or production credentials were created.

The 12×16 inch board is a starting size and not a validated production area for every garment. Garment previews are approximate. Embroidery requires digitizing and BEE review. Current quality messages identify obvious edge crossings and rotated objects needing inspection; they are not a production preflight engine.

Validation: 71 tests across ten files passed; frontend and server TypeScript passed; production build and Cloudflare Worker dry-run packaging passed. Tests include document bounds, malicious source rejection, both-side serialization, migration, history, immutable request/reorder handoff, and component-level saving/recovery. Component tests substitute the rendering adapter and do not establish actual browser canvas behavior. Hosted browser checks follow the main deployment; physical mobile-device and print/sew-out checks remain separate acceptance work.

Next studio priorities: larger private original-file storage, accurate product-specific placement profiles, source-resolution checks, richer typography and navigation controls. Introduce AI asset generation only after durable asset handling and controlled generation jobs are ready.
