# Technical Foundation

## Initial stack

- React and TypeScript frontend
- Vite development and build system
- GitHub source control
- Cloudflare deployment target
- Future Cloudflare Functions/Workers API layer
- Future D1 structured order database
- Future R2 artwork and proof storage
- Future Turnstile form protection
- Future Stripe deposit and approved-order payments

## Architecture principles

1. Keep the legal entity and public brand in configuration, not hard-coded throughout components.
2. Separate marketing pages from quote, order, artwork, proof, and creator features.
3. Use stable order references for reorders and support.
4. Store original artwork separately from production-ready derivatives and proofs.
5. Record status changes and approval timestamps.
6. Never expose private artwork storage directly through public URLs.
7. Build mobile-first because many customers will start inquiries from social platforms.

## Planned feature domains

```text
src/features/quotes/
src/features/orders/
src/features/proofs/
src/features/artwork/
src/features/portfolio/
src/features/creators/
src/features/admin/
```

## Environments

- Local development
- Staging/client review
- Production

Use separate environment variables, storage bindings, payment keys, and analytics properties for
each environment.
