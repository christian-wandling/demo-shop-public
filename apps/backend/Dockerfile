FROM docker.io/node:lts-alpine AS dev
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY package*.json ./
RUN chown -R node:node /usr/src/app
USER node
RUN npm ci
COPY --chown=node:node . .
RUN rm -rf .nx/cache \
    && npx prisma generate


FROM docker.io/node:lts-alpine AS build
ENV NODE_ENV=production
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_DEMO_SHOP_API_PROJECT
WORKDIR /usr/src/app
COPY --from=dev /usr/src/app .
RUN npx nx build backend \
    && npm pkg delete scripts.prepare \
    && npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force \
    && npx prisma generate


FROM docker.io/node:lts-alpine AS prod
RUN apk add --no-cache dumb-init openssl
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
USER node
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/dist/apps/backend ./dist
CMD ["dumb-init", "node", "dist/main.js"]
