# Works by BEE deployment and intake

## Frontend on Cloudflare Pages

Connect the existing site project to ShawnDTB/BEE-Organization, main. Use repository root, Node 24.19 or newer, `npm ci` for installation, `npm run build` for build, and `dist` as output. Keep dev dependencies available during build. The functions/api/[[path]].ts adapter handles API requests when deployed through Pages with Functions support. A static-only upload of dist does not include Functions.

No database or secret is needed for the public frontend and local tools. Intake availability stays false without its full server configuration. Do not use `vite preview` as a production server.

## If the existing domain uses a Worker

GitHub's Cloudflare check identifies the existing Worker as `bee-organization`. The committed wrangler.jsonc now targets that service, builds the frontend with `npm run build`, and binds dist to ASSETS with server/worker.ts as the API entry point. Use repository root and `npx wrangler deploy` as the deployment command. Existing domain assignments remain managed in Cloudflare; no DNS change is declared here.

The initial release c757d53 passed the frontend build, then failed Workers deployment with error 100324: the legacy `/* /index.html 200` rule in public/_redirects caused an infinite loop under Workers asset canonicalization. That file has been removed. The committed SPA fallback handles client routes without a redirect rule. The explicit Wrangler configuration also prevents deployment-time framework auto-configuration. Node 24.19.0 is pinned to satisfy the installed test dependencies; remove any older NODE_VERSION override in the Cloudflare build settings.

Validation: Wrangler 4.131.2 successfully built and bundled the Worker and 69 static files locally in dry-run mode after the redirect removal. Remote deployment acceptance is verified separately.

The adapter directs /api/* to the server before asset fallback; the remainder goes to ASSETS. Ensure asset security headers are applied on the selected hosting path. Verify /api/intake/status returns JSON, not index.html or Hello world. Both Pages and Workers paths still require a real hosted-runtime acceptance check.

## Intake activation

Current planned public email is hello@worksbybee.com. It is unprovisioned and must pass a real send/receive test before CONTACT_EMAIL_VERIFIED=true or VITE_PUBLIC_CONTACT_EMAIL_VERIFIED=true. See [email-and-staff-setup.md](email-and-staff-setup.md) for the verified-mailbox guard, Cloudflare Access staff inbox, and migration 0002.

Create a D1 database in the appropriate account and bind it as DB. Apply migrations/0001_quote_requests.sql to that database. Do not run a remote migration against an unidentified database.

Server configuration:

| Setting | Purpose |
|---|---|
| APP_ORIGIN | Exact canonical origin, https://worksbybee.com |
| INTAKE_ENABLED | false until operational checks complete; true enables submission when all required values exist |
| CONTACT_EMAIL | Verified public business contact, required by the server activation guard |
| CONTACT_EMAIL_VERIFIED | Must be true after a real mailbox send/receive test |
| TURNSTILE_SITE_KEY | Public widget key for the correct hostname |
| TURNSTILE_SECRET_KEY | Server-only Turnstile secret |
| STAFF_API_TOKEN | Random server-only bearer secret, at least 32 characters; generate securely and keep out of the browser/repository |
| DB | D1 binding for the migrated request database |

Build-time VITE_PUBLIC_CONTACT_EMAIL and VITE_PUBLIC_PHONE control public contact links. Set the email to the same verified address as CONTACT_EMAIL. Public brand name is fixed to Works by BEE in siteContent.ts; the legal entity remains BEE Organization LLC.

Turnstile must verify the hostname and action `quote`. /api/requests accepts only same-origin JSON with X-BEE-Request: 1. Request and preview size limits are shared between frontend validation and the API. New requests are limited to 20 per hour per hashed IP; matching retries recover their stored reference without another insertion. Plan cleanup of expired intake_limits rows as an operations task.

The intake API stores an immutable normalized snapshot in quote_requests. A returned reference means stored, not emailed, quoted, approved, paid, or in production. No email delivery is implemented in this increment. Production enabling requires an operator to monitor the protected request queue and respond via the configured business contact process.

Authorized server-side operators can read GET /api/staff/requests with Authorization: Bearer <secret>. Keep this credential out of URLs, client-side code, browser storage and source control. The endpoint returns up to 50 snapshots in descending received order; do not expose it directly as customer access. Rotate the secret if access changes. Authentication for individual staff/customer accounts is a separate milestone.

## Validation before enabling intake

1. Confirm homepage and representative nested routes serve BEE HTML and assets.
2. Confirm /api/intake/status returns JSON and unavailable status without configuration.
3. Verify an unauthorized /api/staff/requests request returns 403 without records.
4. Submit approved test data from the configured origin after Turnstile succeeds. Verify the record in D1 and the authorized operator queue.
5. Retry the identical request identity; verify one record and the same reference.
6. Disable a required binding/setting in a preview environment; verify there is no false received state and drafts remain recoverable.
7. Test downloads, mobile form/menu behavior, and actual business response workflow.
8. Establish contact/retention/privacy handling, then enable public intake deliberately.

Run `npm ci` and `npm run check` for local verification. The tests use SQLite and jsdom; they do not substitute for hosted D1, Turnstile, account authorization, real notifications, or visual device review.
