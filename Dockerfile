# syntax=docker/dockerfile:1.7

# ── Builder ───────────────────────────────────────────────────────────────────
FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund --include=dev --ignore-scripts
COPY tsconfig.json nuxt.config.ts tailwind.config.ts eslint.config.mjs ./
COPY src ./src
# postinstall (nuxt prepare) was skipped above; run it now after sources exist.
RUN npx nuxt prepare && npm run build

# ── Runner ────────────────────────────────────────────────────────────────────
FROM node:20-bookworm-slim AS runner
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates dumb-init wget \
    && rm -rf /var/lib/apt/lists/*
# Nitro produces a fully self-contained .output directory (no node_modules needed).
COPY --from=builder /app/.output ./.output
EXPOSE 3000
USER node
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", ".output/server/index.mjs"]
