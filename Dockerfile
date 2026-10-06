# syntax=docker/dockerfile:1

# DATABASE_URL is required for the build stage (src/db/index.ts reads it at
# import). Pass a build-time placeholder; the real value comes at runtime.
ARG DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db

# ---- Build ----
FROM node:20-alpine AS builder

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN mkdir -p public
RUN npm run build

# ---- Runtime ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Standalone output from the build stage.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public/ ./public/
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# DATABASE_URL and (optionally) BUSINESS_WHATSAPP are provided at runtime.
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]