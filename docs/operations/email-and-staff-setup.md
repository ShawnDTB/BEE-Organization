# Email and staff inbox activation

September 15, 2026. Planned public address: **hello@worksbybee.com**, chosen under Shawn's instruction to use a sensible domain address. The mailbox does not exist yet. No mailbox, forwarding rule, DNS record, or email provider was created by this release.

## Email

Use hello@worksbybee.com for general inquiries and customer replies. It should support receiving and replying with that address, not just forwarding incoming messages. Keep staff sign-in tied to named individuals; the public mailbox is not itself a staff role.

Provision the mailbox with the business's chosen provider, follow that provider's MX/SPF/DKIM instructions, and establish DMARC after checking all legitimate senders. Verify inbound mail from an external account and a reply back to it. This is a real mailbox test, not a syntax check.

Only after successful verification:

- Server CONTACT_EMAIL=hello@worksbybee.com and CONTACT_EMAIL_VERIFIED=true.
- Build-time VITE_PUBLIC_CONTACT_EMAIL=hello@worksbybee.com and VITE_PUBLIC_CONTACT_EMAIL_VERIFIED=true; rebuild to publish the contact links.
- Keep INTAKE_ENABLED=false until the database, spam prevention, staff monitoring and end-to-end intake checks also pass.

The example files declare the intended address with verification false. No address is advertised as reachable just because it appears in configuration. This release does not send notifications or confirmation email.

## Staff access

The `/staff` interface reads its requests from protected APIs. It contains no embedded customer data and no browser token/password field. Configure a Cloudflare Access self-hosted application for the existing host covering `/staff`, `/staff/*`, and `/api/staff/*`. Confirm the same intended application audience protects the staff paths; do not protect the public homepage or public quote-intake endpoint by mistake.

Restrict Access policies to the actual named reviewers and require an appropriate sign-in/MFA policy. Set these server-only values:

| Setting | Value |
|---|---|
| ACCESS_TEAM_DOMAIN | Exact `https://your-team.cloudflareaccess.com` issuer, no trailing slash |
| ACCESS_AUD | The staff application's actual audience tag |
| STAFF_EMAILS | Comma-separated verified individual staff emails, matching the Access policy |
| APP_ORIGIN | `https://worksbybee.com` |
| DB | The existing BEE D1 database binding |

The Worker independently verifies the Access JWT signature, RS256 algorithm, issuer, audience, expiration, issued-at, subject and exact email allowlist. It does not trust a plain email header. Missing configuration or invalid identity returns 403. The Access application itself and its membership were not created in this release.

All allowlisted people have the same request-review role in this milestone. There is no permission to issue a quote, approve a proof, take payment, or start production. Add distinct permission scopes as those actions are implemented. The older bearer-protected GET `/api/staff/requests` remains an operator integration endpoint; its secret must never be used in the browser, and cannot authorize the new inbox mutations.

References: [Cloudflare JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/), [jose](https://github.com/panva/jose).

## Database and workflow

Apply migrations/0002_staff_triage.sql to the identified BEE database after migration 0001. It adds request_events; it does not rewrite original customer snapshots. No remote migration was run here.

Each note/status save appends one immutable event with verified actor and timestamp. The unique request/version constraint prevents stale or concurrent updates from overwriting each other. The UI retains an in-memory idempotency identity across a lost-response retry. Reusing the same identity with different details is rejected. Refreshing a record explicitly loads its latest version and keeps the unsaved note for review; compare the history before saving again if the previous outcome was uncertain.

Statuses are New, Reviewing, Needs details, Ready to quote and Archived. Needs details and Archived require an explanatory note. They are internal triage states, not customer approvals. The original request never changes. The detail view shows the newest 50 events; the database retains the full history. Database operators retain the ability to handle authorized deletion/retention requests.

## Hosted acceptance before activation

1. Verify that anonymous access, a forged identity header, and a user outside the allowlist cannot read or change records.
2. Verify a real authorized sign-in from the intended staff path, then sign out and confirm API access ends.
3. Apply the migration to the correct database and submit one approved test inquiry after Turnstile and mailbox readiness are verified.
4. Open the request in the staff inbox, read the actual brief, save an internal review note, and see the actor/history update.
5. Open two tabs and try stale changes; the second save must report a conflict. Retry an identical uncertain save and verify no duplicate event.
6. Confirm an operator is responsible for checking the inbox. No email notification automation exists yet.

Local cryptographic/SQLite/component tests cover the guards and state behavior, but cannot replace real Access, D1, mailbox or mobile-device acceptance. The staff shell can be deployed safely before configuration: protected APIs refuse access.

## Release validation

`npm run check` passed: frontend and server type checking, 53 tests across eight files, and the production build. Cloudflare Worker packaging also passed `wrangler deploy --dry-run`. The tests include actual signed identity tokens, SQLite migrations, stale updates, retry deduplication, pagination and the locked staff interface. Hosted authenticated acceptance remains pending the configuration above.

## Next milestone

Immutable quote revisions with line items, expiry and explicit send/accept actions; proof revisions and approvals; a notification delivery queue. Follow with customer identity and project-scoped access. Do not use internal review notes as a substitute for customer communication or commercial records.
