FROM docker.io/node:lts-alpine AS dev
RUN apk add --no-cache libc6-compat openssl
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN rm -rf .nx/cache
RUN npx prisma generate

FROM docker.io/node:lts-alpine AS build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=dev /usr/src/app .
RUN npx nx build backend
RUN npm pkg delete scripts.prepare
RUN npm ci --omit=dev && npm cache clean --force
USER node


FROM docker.io/node:lts-alpine AS prod
RUN apk add --no-cache dumb-init openssl
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist/apps/backend ./dist
CMD ["dumb-init", "node", "dist/main.js"]
