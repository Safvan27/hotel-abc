# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm start` — run production build
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, `eslint-config-next` core-web-vitals + typescript)
- `node scripts/gen-icons.js` — regenerate PWA icons (`public/icons/*`, `src/app/icon.png`, `src/app/apple-icon.png`) from the accent color hardcoded in that script; re-run after changing the brand color

No test suite is configured.

## Architecture

Frontend-only prototype: no backend, no auth, no persistence. All state lives in one React component tree and resets on refresh. A `prisma/` folder and `.env` with a placeholder `DATABASE_URL` exist but are unused scaffolding — `prisma`/`@prisma/client` aren't in `package.json`.

- **App shell**: `src/app/page.tsx` renders `src/components/App.tsx`, which owns all top-level state (`screen`, `role`, `tables`, `cart`, etc.) and switches between screens via a `Screen` union (`"login" | "tables" | "order" | "admin"`) — navigation is state-driven, not route-based. State and callbacks are passed down as props; there's no context or store.
- **Data flow**: mock seed data (`ITEMS`, `TABLES`, `CATEGORIES`) lives in `src/lib/data.ts` and is copied into `App.tsx` state on load. All mutations (cart edits, table status changes, etc.) happen through setState callbacks in `App.tsx`, not the data module.
- **Screen flow**: `LoginScreen` → `TablesScreen` (grouped by section, color-coded by `TableStatus`) → `OrderScreen` (menu grid + cart, with `InvoicePanel` as a side panel on wide viewports or a bottom-sheet drawer on narrow ones) / `AdminScreen` (tabbed dashboard). The wide/narrow split is driven by `useIsNarrow()` (900px breakpoint, `src/hooks/useIsNarrow.ts`).
- **Styling**: no CSS framework — components use inline `style` objects with OKLCH colors centralized in `src/lib/colors.ts` (`colors`, `statusColors`). Add new colors there rather than inlining new OKLCH values.
- **PWA**: `src/app/manifest.ts` + `public/sw.js` (app-shell offline caching), registered via the `RegisterSW` client component in `layout.tsx`. Icons are generated, not hand-edited — see `scripts/gen-icons.js` above.
