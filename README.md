# Aramway Admin Dashboard

Internal admin dashboard for managing Aramway site content (subscribers, blog
categories, blogs/news, career applications, contact messages, and
consultations).

## Wired to AramwayBackend

This dashboard proxies to the real AramwayBackend (Express + Prisma +
Postgres) — every `app/api/**` route handler forwards to
`${BACKEND_URL}/api/**` (see `lib/backend.ts`), forwarding the admin's
session cookie both ways. AramwayBackend must be running (`npm run dev` in
`../AramwayBackend`, default `http://localhost:4000`) for this dashboard to
work.

- `JWT_SECRET` here **must match** AramwayBackend's `JWT_SECRET` exactly —
  the backend issues the session JWT on login, and this app's
  `middleware.ts` verifies it on every request.
- `BACKEND_URL` (default `http://localhost:4000`) points at the backend API.
- `lib/mock-data.ts` now only holds the shared TypeScript types (mirroring
  AramwayBackend's Prisma schema) that page components import; the
  in-memory store it used to contain has been removed now that the real
  backend is wired up.

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

`playwright.config.ts` starts the dashboard's dev server for you (`npm run
dev`) and points the tests at `http://localhost:3000` — but **AramwayBackend
must already be running separately** (`npm run dev` in `../AramwayBackend`,
with its database migrated and seeded; see that repo's README) since these
tests exercise the real API end to end. Tests run serially (single worker)
since specs share the same backend database — running them in parallel
would let tests race and stomp on each other's rows.

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
