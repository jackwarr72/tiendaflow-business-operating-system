# TiendaFlow

Sistema operativo ligero y móvil para comerciantes informales: catálogo,
ventas, productos, clientes y gastos.

## Local development

```bash
cp .env.example .env   # fill in DATABASE_URL
npm install
npm run migrate       # apply schema
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | start the dev server |
| `npm run build` | production build |
| `npm start` | serve the production build |
| `npm run migrate` | apply pending migrations |
| `npm run db:push` | sync schema to the database |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `eslint .` |

## Environment

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `DATABASE_URL` | yes | — | PostgreSQL connection string |
| `BUSINESS_WHATSAPP` | no | — | WhatsApp number on the public catalog |
| `PORT` | no | `3000` | port for `npm start` |

## Deploy

1. Set `DATABASE_URL` (and `BUSINESS_WHATSAPP`) on the host.
2. `npm install && npm run build`
3. `npm run migrate`
4. `node .next/standalone/server.js`

`npm start` is not supported under `output: "standalone"` — use the node command above.

### Docker

```bash
docker build -t tiendaflow .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgres://user:pass@host:5432/db \
  tiendaflow
```