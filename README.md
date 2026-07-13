# Hotel ABC — Ordering & Billing

A mobile/tablet/laptop-responsive ordering and billing app for waiters and admins, built from the Hotel ABC Claude Design prototype. Frontend-only prototype with in-memory mock data (no backend yet).

## Features

- **Login** — Waiter/Admin role toggle (any username/password works in this prototype)
- **Tables** — sectioned by area (Dine In Hall / AC Family / Non-AC / Outdoor), color-coded by status (Free / Occupied / Ready to Bill)
- **Order screen** — category chips, search, item grid, cart with per-item special-instruction notes
- **Invoice / cart** — Hold Order, Send to Kitchen (KOT), Print Bill, Cancel Order, customer details — shown as a persistent side panel on wide screens and a bottom-sheet drawer on mobile
- **Admin dashboard** — sales overview, menu items & categories, tables & sections, staff accounts, sales reports
- Installable as a **PWA** (manifest + offline-caching service worker)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project structure

- `src/app` — Next.js App Router entry (`layout.tsx`, `page.tsx`, `manifest.ts`)
- `src/components` — screens (`LoginScreen`, `TablesScreen`, `OrderScreen`, `AdminScreen`) and shared UI (`InvoicePanel`, `NoteModal`, `CustomerModal`, `Toast`)
- `src/lib` — mock data (`data.ts`), shared color tokens (`colors.ts`), types (`types.ts`)
- `src/hooks/useIsNarrow.ts` — responsive breakpoint hook (900px)
- `public/sw.js` — service worker for offline app-shell caching
- `scripts/gen-icons.js` — regenerates the PWA icons in `public/icons` and `src/app` if the brand color changes

## Next steps

This is currently frontend-only with mock, in-memory data — logins aren't verified, orders don't persist across refresh, and there's no real kitchen printer integration. A real backend (auth, database, KOT printing) would be the natural next step before using this in production.
