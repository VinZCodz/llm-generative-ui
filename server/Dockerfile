# Builder stage for clean build.
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./

# Install ALL dependencies (including devDeps). Use --frozen-lockfile # for strict version check 
RUN bun install --frozen-lockfile

COPY . .

# Release stage for non-bloat slim prod build.
FROM oven/bun:1-slim AS release
WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/bun.lock .

# Re-install only production deps. Use --frozen-lockfile # for strict version check 
RUN bun install --production --frozen-lockfile

COPY --from=builder /app/src ./src

# Create logs directory and set permissions BEFORE switching user
RUN mkdir -p /app/logs && chown -R bun:bun /app/logs

USER bun
EXPOSE 3001

CMD ["bun", "run", "src/server.ts"]