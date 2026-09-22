# Sésé — Heritage, Reimagined

A premium, responsive frontend homepage for an African heritage design house. Built with Next.js App Router, TypeScript, React, custom CSS, GSAP and Lenis. No backend, checkout, authentication or payment integration.

## Run

- `npm install`
- `npm run dev` — http://localhost:3000
- `npm run lint`
- `npm run build`
- `npm start` — production preview after a successful build

## Architecture

- `src/app/page.tsx`: server-rendered editorial homepage; twelve sections.
- `src/app/layout.tsx`: metadata and bundled Cormorant Garamond regular/italic fonts.
- `src/app/globals.css`: design tokens, sculptural CSS artwork, responsive layouts and interaction styles.
- `src/components/primitives.tsx`: reusable artwork and editorial link components.
- `src/components/interactive.tsx`: navigation, native accessible dialogs, local search, product filtering, collection previews, journal reader, newsletter feedback and care information.
- `src/components/motion.tsx`: scoped GSAP reveals and subtle parallax; Lenis scrolling; reduced-motion support and effect cleanup.
- `src/data/collections.ts`: centralized illustrative product names, categories, NGN prices, descriptions and journal content.
- `public/images`: original supplied brand assets, unchanged. The original logo file is unchanged. `sese-navigation-logo.png` is a transparent PNG export of the supplied logo’s original lettering and tonal detail, with no font substitution or redrawn paths. Regenerate it with `node scripts/export-navigation-logo.mjs`. `BrandWordmark` is shared by the header and mobile navigation. The Heritage frame is an editorial textile placeholder.

## Art direction

Warm ivory, deep burgundy, charcoal, fine borders, oversized editorial serif and restrained sans-serif UI. The supplied reference informs the negative space and vertical proportions. Abstract CSS material/form studies stand in for photography. They do not represent photographed client inventory or assert specific materials or production methods. No remote imagery is used.

## Frontend behavior

Search and filtering work against local concept data. Product and collection previews are informational. Cart displays an empty-state preview; purchasing is intentionally unavailable. Newsletter validates email and explicitly states that email has not been stored. Shipping, returns, contact and social panels identify information still pending client approval. Journal text is original illustrative editorial copy, with no claims about particular communities or artisans.

## Verification

`node scripts/verify-home.mjs` uses headless Microsoft Edge through Playwright, with the development server on port 3000. It checks widths 1440, 768, 390 and 320; overflow; lazy image loading; browser errors; filters; preview closing with Escape; search; newsletter feedback; and reduced/normal motion. Screenshots are saved to `artifacts/` (ignored by git). Install an Edge browser or change the browser channel for another environment.

## Client assets needed

Final inventory, descriptions, materials, product dimensions, NGN prices and availability; authentic product and campaign photography; textile/material/process and artisan imagery with usage rights; approved heritage and craft copy; journal articles; newsletter provider; contact and social URLs; shipping, returns, privacy and other policies. Replace CSS studies with supplied photographs while retaining their frame proportions.
