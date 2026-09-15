# Guided Studio: first release and remaining priorities

Scope: first complete customer-journey slice of the Astra brief. This does not complete the full brief.

## Audit and gap matrix

| Area | Finding | Release / next dependency |
|---|---|---|
| Customer journey | Full editor was the default, with file controls competing with the next action | Guided first visit, garment choice, four entry paths, template editing and review |
| Editor | Independent surfaces, history, exports, individual centering already exist | Preserve Advanced; add whole-composition center, proportional sizing and fit |
| Mobile | Advanced panels stack into a long interface | Guided panels stack with preview before focused controls; browser verification recorded below |
| Accessibility | Numeric editing alternatives exist | Semantic mode/progress buttons, labeled controls and visible focus; full screen-reader audit remains |
| Persistence | Browser-only recovery, original JSON and quote snapshot work | Shared document and history across modes; mode preference persisted; no schema change needed |
| Production | Generic 12-by-16 board and approximate silhouette | Clearly retain approximation; show both-side boundary/rotation findings before handoff |
| Commerce | Project bag and intake form; Worker configuration sets INTAKE_ENABLED=false | Save snapshot before navigating to intake; actual submission/payment require operational configuration |
| AI | No provider | Explicit four-command local helper; no image-generation claims; broader language requests are unsupported |
| Privacy/security | Inline raster assets, small file limits | Existing validation preserved; private original storage and provider jobs remain future work |
| Performance | Fabric bundled into Studio route | Dynamically load Fabric and board on Advanced use or export; Studio route falls from about 96 KB gzip to about 10 KB gzip, excluding shared assets |

## Implemented

- Guided garment choice and entry paths; Help me create it currently assists through editable text layouts.
- Three original text-based template starters: school/community, business/team and creator. No generated mascot is implied.
- Front/back preview, text/color changes, artwork upload, whole-design controls and review.
- A restricted BEE Guide command parser. Unsupported compound requests are rejected instead of partially executed. Locked/rotated artwork prompts users to use Advanced.
- Both modes share the authoritative document and history. Changes preserve hidden elements. Template replacement asks before replacing a populated side and is undoable.
- Human-help and review actions save the current design and project bag snapshot before navigating. Failed saves do not navigate.
- Existing file export, browser recovery and advanced controls retained.

## Next priorities

1. Distinct guided brief and visually richer original templates, including a licensed mascot/graphic asset collection. Separate event intent from exact artwork wording and preserve it in the handoff.
2. Product/decoration profiles confirmed with Brian, calibrated preview geometry, effective raster density checks and improved original-file storage. Current board margins are layout assistance, not verified safe print areas.
3. Multi-selection/grouping, snapping, zoom and typography with consistent export behavior.
4. Intake operational configuration and delivery, proof/revision lifecycle, then real pricing/payment integration. Do not enable intake until its dependencies are configured.
5. Provider-neutral generation jobs, private storage, access controls and budget enforcement; evaluate a provider before connecting it. The local helper is not a general-language AI service.
6. Further component extraction, focus management between steps, usability sessions, screen-reader review and funnel measurement.

## Validation

77 tests across 12 files pass, including original recovery/front-back/request-snapshot tests and new guided-mode/history/command tests. Production build and Worker dry-run pass. No production suitability claim is inferred from software checks.

Browser screenshots and visual/live interaction verification were blocked in this environment: Playwright has no installed Chromium executable and the browser download timed out. The live URL could not be opened through web retrieval. Do not interpret unit/UI tests as completed visual QA. Before the next release, verify 390px mobile and desktop layouts, first-use creation, Advanced canvas mounting and intake handoff in a browser.
