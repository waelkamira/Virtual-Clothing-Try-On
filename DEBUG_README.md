# Debug and integration audit

## Issues found during the baseline audit

Ordered by impact; entries reflect the working tree before this implementation.

1. **Build/type errors — `app/search/page.tsx`**: Next.js generated route validation rejects the page module's exported shape. Confirm the route's export signature against Next.js 16 App Router requirements.
2. **Type error — `components/search-bar.tsx:50`**: A function accepting an optional string is passed directly as a button click handler, whose argument is a mouse event.
3. **Type errors — `lib/color-extractor.ts`**: The installed `colorthief` package does not export the named functions imported by this module. This causes subsequent implicit-`any` and tuple-spread diagnostics.
4. **Try-on provider availability and licensing**: The API has one public IDM-VTON demo, with no failover. The shared demo is best-effort and its model is licensed for non-commercial use; it is not a production SLA or a free commercial service.
5. **Online product search is mock data**: `/online-search` filters a static local seed list rather than querying retailers. Scraping arbitrary store pages is not a reliable or safe substitute for authorized retailer feeds.
6. **Persistence/authentication absent**: The repository has no Prisma schema, Supabase client, or auth/session setup. User photos and favorites currently rely on browser state or optional Blob storage.
7. **Environment-dependent features are not configured locally**: No environment file is present. Hosted storage and external provider integration require deployment credentials and provider acceptance.

## Remediation status

- [ ] Correct all baseline TypeScript/build errors and re-run the checks.
- [ ] Add a six-provider failover contract with explicit configuration, licensing, and deployment requirements.
- [ ] Replace mock online search with an authorized product-search integration and report missing credentials clearly.
- [ ] Re-run focused verification and record any remaining deployment blockers.
