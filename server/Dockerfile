# Clinova API — production image
FROM node:20-alpine AS base
WORKDIR /app

# Install production dependencies first (better layer cache)
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5001

RUN addgroup -g 1001 -S nodejs && adduser -S clinova -u 1001 -G nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

# Writable uploads volume mount point
RUN mkdir -p uploads && chown -R clinova:nodejs /app
USER clinova

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5001/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]
