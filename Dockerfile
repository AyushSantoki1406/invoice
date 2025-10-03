# syntax=docker/dockerfile:1.6

# --- Base deps ---
FROM node:20-slim AS base

ENV NODE_ENV=production
WORKDIR /app

# Install OS deps used by node-gyp when optional deps are built
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ git ca-certificates \
  && rm -rf /var/lib/apt/lists/*


# --- Dependencies layer ---
FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci --omit=dev


# --- Builder layer (needs dev deps to build client and server bundle) ---
FROM base AS builder

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build client to dist/public and bundle server to dist
RUN npm run build


# --- Runtime image ---
FROM node:20-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

# Create a non-root user
RUN groupadd -g 1001 nodegrp && useradd -m -u 1001 -g nodegrp nodeusr

# Copy production node_modules from deps and built app from builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./package.json

# Runtime directories
RUN mkdir -p /app/uploads && chown -R nodeusr:nodegrp /app

USER nodeusr

EXPOSE 5000

ENV PORT=5000

CMD ["node", "dist/index.js"]


