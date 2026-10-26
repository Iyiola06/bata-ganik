# Working Memory

## Problem Summary

Search results presently identify the Bata Ganik site as "Sulva Tech" and the site is only strongly associated with the query "Bata Ganik".

## Product Goal

Associate the website with "Bata Ganik", "Ganik", and "Ganik Leathers" in its on-site SEO signals; expose "Ganik Leathers" as the search-facing site identity; use the supplied crest artwork as the visual logo and favicon source.

## Stack and Runtime Assumptions

- Next.js 15 App Router application.
- Production URL is configured by `NEXT_PUBLIC_APP_URL` and currently points to `https://bata.sulvatech.com`.

## Confirmed Facts

- Root metadata and JSON-LD are defined in `app/layout.tsx`.
- The existing branded logo is `public/logo.svg` and did not match the supplied image.
- Google determines the final search-result site name and refresh timing after crawl; metadata is a strong signal, not a guarantee.

## Active Files

- `lib/site.ts`
- `app/layout.tsx`
- `app/manifest.ts`
- `app/[[...slug]]/page.tsx`
- `src/layouts/StorefrontLayout.tsx`
- `public/ganik-leathers-logo.jpg`, favicon assets

## Decisions and Tradeoffs

- Keep `Bata Ganik` as the visible product brand.
- Publish `Ganik Leathers` as the Website and Organization name, with all three requested names as aliases.
- Use a 48px PNG derived from the supplied logo for Google-compatible favicon discovery.

## Remaining Risks and Next Actions

- Build to validate metadata and UI changes.
- Deploy the changes, then request Google reindexing in Search Console. Google may retain the old site label until it recrawls.
