# Works by BEE

Custom apparel and embroidery for teams, businesses, creators and communities. **Build. Empower. Equip.**

Domain: **worksbybee.com** · Legal entity: **BEE Organization LLC**

The public site is live at worksbybee.com. Releases go to `main`, as authorized by Shawn, and deployment checks must pass before a release is considered published. The site includes the BEE identity, group size planner, portable project briefs and request-intake foundation.

- [Release, Kut Shoppe patterns, validation and remaining work](docs/operations/worksbybee-release.md)
- [Cloudflare deployment and intake activation](docs/operations/worksbybee-deployment.md)
- [Email and protected staff inbox setup](docs/operations/email-and-staff-setup.md)
- [Post-launch assessment](docs/operations/post-launch-assessment.md)
- [Current brand direction](docs/brand/site-identity.md)

## Local development

Use Node 24.19+ and npm 10+. Run `npm ci`, then `npm run dev`. `npm run check` runs frontend/server TypeScript, workflow tests and the production build. Static output is `dist`. The lockfile is committed; do not delete it as a routine installation repair.

## What works and what needs configuration

The public pages, design studio, local project bag/history, request downloads and saved-design reorders work without a backend. Online intake is available only after the documented Cloudflare D1, Turnstile, contact and operator configuration is completed. No request is labeled received until the server confirms it is stored. Local project copies are not authenticated customer accounts.

The `/staff` inbox supports protected request review, internal notes, status filters and immutable review history. It requires Cloudflare Access and the second D1 migration before it can operate. Missing staff configuration denies access. Hosted customer accounts, live customer project updates, quotes, proof approvals, shared group invitations, email delivery and payments remain separate milestones. The local group collector is labeled a demo and should use test names only. Merchandise checkout remains unavailable until real products and commerce are ready.

## DTB approach

A useful website should help BEE capture an idea, preserve its details, move it through a clear process, and make the next order easier. The platform separates drafts, received requests, quotes, proofs and payments so customers know what has actually happened. Original requests are immutable; later changes should become revisions. Systems are built around real capabilities and customer ownership, with documented configuration and a testable path forward.

Private secrets belong in host configuration. The planned public address is hello@worksbybee.com; the mailbox has not been provisioned. Public email links require VITE_PUBLIC_CONTACT_EMAIL and VITE_PUBLIC_CONTACT_EMAIL_VERIFIED=true after an actual mailbox test. Phone links use VITE_PUBLIC_PHONE. The repository does not contain production customer records or credentials.
