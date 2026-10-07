# TiendaFlow — Quickstart App

Get the app running locally in a few minutes.

## Prerequisites

- Node.js 20+ and npm
- Docker (for PostgreSQL) — or any local Postgres 16 with a database named `app_db`
- No other dependencies: PDF export is print-to-PDF in the browser, CSV needs no library

## 1. Install dependencies

```powershell
npm install
```

## 2. Configure environment

```powershell
Copy-Item .env.example .env
```

`.env` must contain a reachable PostgreSQL URL (defaults match `drizzle.config.json`):

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
BUSINESS_WHATSAPP=
PORT=3000
```

`.env` is gitignored — never commit it.

## 3. Start PostgreSQL

With Docker (recommended):

```powershell
docker run -d --name tiendaflow-db `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_DB=app_db `
  -p 127.0.0.1:5432:5432 `
  postgres:16-alpine

# wait until ready
docker exec tiendaflow-db pg_isready -U postgres -d app_db
```

Reuse an existing container later with `docker start tiendaflow-db`.

## 4. Apply the database schema

```powershell
npm run migrate
```

Expected output: `migrations applied successfully`.

## 5. Run the dev server

```powershell
npm run dev
```

Next picks the first free port (3000, else 3001, …) and prints the URL. If another dev server for this project is already running, Next will point you at it. Check the terminal output for the actual port — on this machine it was **http://localhost:3101**.

## 6. Verify

```powershell
# should return {"ok":true}
Invoke-WebRequest http://localhost:3000/api/health -UseBasicParsing
```

Then open the printed URL — you should see the TiendaFlow dashboard ("Ventas de hoy"). A fresh database shows zeros until you add products and record sales.

## 7. Login

This template ships with **stub authentication**: any registered customer email logs in successfully (no password is checked). Register a customer with an email before logging in.

```powershell
# Seed the database with demo accounts
node seed-customers.js
```

Default credentials:

| Field | Value |
| --- | --- |
| **Email** | `admin@tiendaflow.com` |
| **Password** | `admin@tiendaflow.com` |

> The password is ignored by the stub auth — use any value on the login form. The email must match a row in the `customers` table.

To manage customers, run `npm run db:push` after updating `src/db/schema.ts`, or connect to PostgreSQL directly.

## All scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run migrate` | Apply Drizzle migrations |
| `npm run db:push` | Push schema changes without a migration file |

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `DATABASE_URL is required` | `.env` is missing or empty — redo step 2, restart the dev server |
| `ECONNREFUSED 127.0.0.1:5432` | Postgres isn't running — `docker start tiendaflow-db` |
| Health check returns `{"ok":false}` | DB unreachable from the app — verify URL in `.env`, `docker ps` |
| `Port 3000 is in use` | Another process owns 3000 — use the port Next prints instead |
| `Another next dev server is already running` | A dev server for this project already exists — use the URL it lists |
| Tables missing / query errors | Run `npm run migrate` against the current `.env` |
| Stale DB state | `docker rm -f tiendaflow-db`, redo step 3 + 4 |
| `+` buttons do nothing when opened from the phone (`http://<lan-ip>:3101`) | Next dev blocks the HMR websocket from non-localhost origins, so React never hydrates. `next.config.ts` must list the LAN hostname in `allowedDevOrigins` (e.g. `allowedDevOrigins: ["192.168.100.3"]`), then restart `npm run dev`. After any restart, close and reopen the phone tab (old chunks are stale). |
| Public test URL dead / `ERR_CONNECTION` | Quick Tunnels are temporary (no uptime guarantee; the URL changes each restart). Re-launch: `cmd /c "%TEMP%\start-tiendaflow-tunnel.cmd"` (cloudflared is at `C:\Program Files (x86)\cloudflared\cloudflared.exe`) and grab the new `*.trycloudflare.com` URL from `%TEMP%\tiendaflow-tunnel.log`. |

## Public HTTPS test URL (Cloudflare Quick Tunnel)

The production Docker image runs as container `tiendaflow-prod` on `127.0.0.1:3200`
(bound to the existing `tiendaflow-db` Postgres) and is exposed with HTTPS via a
Cloudflare **Quick Tunnel** — no account needed, temporary URL, **the app has no
login: treat the URL as sensitive**.

- Start container: `docker start tiendaflow-prod`
- Start tunnel: `cmd /c "%TEMP%\start-tiendaflow-tunnel.cmd"` → new URL in `%TEMP%\tiendaflow-tunnel.log`
- Stop: `docker stop tiendaflow-prod`, kill the `cloudflared` process
- Rebuild image: `docker build -t tiendaflow:latest .`

## Project layout (what matters first)

```text
src/
  app/
    (app)/           # authenticated-style app pages (dashboard, ventas, productos, ...)
    actions.ts       # all server actions (db queries live here)
    api/health/      # health check
  components/        # shared UI forms + nav
  db/schema.ts       # Drizzle schema (source of truth for tables)
drizzle/             # SQL migrations
```
