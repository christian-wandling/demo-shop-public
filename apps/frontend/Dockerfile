FROM docker.io/node:lts-alpine AS dev
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY package*.json ./
RUN chown -R node:node /usr/src/app
USER node
RUN npm ci
COPY --chown=node:node . .


FROM docker.io/node:lts-alpine AS build
ARG KEYCLOAK_URL
ARG KEYCLOAK_REALM
ARG KEYCLOAK_CLIENT_UI
ARG SENTRY_DEMO_SHOP_UI_DSN
ARG SENTRY_TRUSTED_DOMAIN
ARG SENTRY_ORG
ARG SENTRY_DEMO_SHOP_UI_PROJECT
RUN apk add --no-cache gettext
WORKDIR /usr/src/app
COPY --from=dev /usr/src/app .
RUN envsubst < apps/frontend/src/environments/environment.ts > /tmp/environment.ts \
    && mv /tmp/environment.ts apps/frontend/src/environments/environment.ts \
    && npx nx build frontend \
    && npm pkg delete scripts.prepare \
    && sh .ops/scripts/utils/upload-sourcemaps.sh \
      "dist/apps/frontend" \
      "$SENTRY_ORG" \
      "$SENTRY_DEMO_SHOP_UI_PROJECT" \
    && npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force


FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /usr/src/app/dist/apps/frontend/browser ./
COPY nginx.conf /etc/nginx/conf.d/demo-shop.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY secrets/nginx-server.key /etc/ssl/keys/nginx-server.key
COPY secrets/nginx-server.crt secrets/dhparam.pem /etc/ssl/certs/
RUN chown -R nginx:nginx /etc/ssl/keys \
    && chmod 600 /etc/ssl/keys/nginx-server.key \
    && chown -R nginx:nginx /etc/ssl/certs \
    && chown -R nginx:nginx /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
