# Aramway Admin Dashboard

Internal admin dashboard for managing Aramway site content (subscribers, blog
categories, blogs/news, career applications, contact messages, and
consultations).

## Important: this is a self-contained mock

This dashboard is **intentionally not connected to AramwayBackend** (the real
Express + Prisma + Postgres API being built separately). Instead, its own
Next.js API routes (`app/api/**`) act as a fake backend over **in-memory
data** defined in `lib/mock-data.ts`.

- All data lives in module-level arrays and **resets whenever the dev/prod
  server restarts**. That's expected — this is a demo/mockup, not a
  production data store.
- The field shapes of every resource (`Subscriber`, `BlogCategory`, `Blog`,
  `CareerApplication`, `ContactMessage`, `Consultation`) mirror the real
  backend's data model exactly, so wiring this dashboard up to the real
  AramwayBackend later should be a drop-in swap of the `lib/mock-data.ts`
  store functions for real HTTP calls.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (brand color tokens reused from the main Aramway site's
  `app/globals.css` — gold primary `#cc9138`, ink/cream palette, Ubuntu Sans /
  Montserrat fonts)
- Auth via [`jose`](https://github.com/panva/jose) (Edge-runtime compatible,
  unlike `jsonwebtoken`) — a signed JWT is stored in an `httpOnly` cookie
  named `token` and verified in `middleware.ts` on every request
- Playwright for end-to-end tests (`e2e/`)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/login`.

**Login credentials (hardcoded, mock-only):**

- Email: `admin@example.com`
- Password: `Admin@1234`

Copy `.env.local.example` to `.env.local` if you want to customize
`JWT_SECRET` (a working default is already baked in for local dev).

## Project structure

```
middleware.ts            Protects everything except /login and /api/auth/*
lib/
  mock-data.ts            In-memory arrays + CRUD helpers for all 6 resources
  auth.ts                 signJwt / verifyJwt via jose
  api-utils.ts            Small shared helper for building PATCH payloads
app/
  login/page.tsx          Login form
  (dashboard)/            Sidebar layout + Overview + one page per resource
  api/                    Route handlers acting as the mock backend
components/               Shared Badge / Button / Modal / Sidebar / form bits
e2e/                      Playwright specs
```

## Running the tests

```bash
npx playwright install --with-deps chromium   # first time only
npx playwright test
```

`playwright.config.ts` starts the dev server for you (`npm run dev`) and
points the tests at `http://localhost:3000`. Tests run serially (single
worker) since all specs share the same in-memory mock data on the server —
running them in parallel would let tests race and stomp on each other's
rows.

Test coverage:

- `login.spec.ts` — invalid credentials stay on `/login` with an error,
  valid credentials redirect to the dashboard, and visiting a protected page
  while logged out redirects to `/login`.
- `subscribers.spec.ts`, `blogs.spec.ts`, `careers.spec.ts`,
  `contact.spec.ts`, `consultations.spec.ts` — each logs in, confirms the
  seeded rows render, creates a new row through the UI form, edits its status,
  and deletes it, verifying the table reflects every step.

## Production build

```bash
npm run build
npm start
```

## Notes

- No file uploads: career application `resumeUrl` / `coverLetterUrl` are
  plain text/URL fields, matching how the real backend mock accepts them
  (JSON, not multipart).
- Every non-auth API route requires the `token` cookie; `middleware.ts`
  enforces this centrally and returns `401 { error }` JSON for API requests,
  or redirects browser requests to `/login`.
