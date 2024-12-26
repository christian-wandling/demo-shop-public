FROM docker.io/node:lts-alpine AS dev
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci


FROM docker.io/node:lts-alpine AS build
ENV NODE_ENV=production
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_DEMO_SHOP_API_PROJECT
RUN apk add --no-cache openssl
WORKDIR /app
COPY . .
COPY --from=dev /app/node_modules ./node_modules
RUN npx prisma generate && npx nx build backend
WORKDIR /app/dist/apps/backend
RUN npm ci


FROM docker.io/node:lts-alpine AS prod
RUN apk add --no-cache dumb-init openssl
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
COPY --from=build /app/dist/apps/backend ./
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
CMD ["dumb-init", "node", "main.js"]
