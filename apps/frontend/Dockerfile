FROM docker.io/node:lts-alpine AS dev
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY package*.json ./
RUN chown -R node:node /usr/src/app
USER node
RUN npm ci
COPY --chown=node:node . .


FROM docker.io/node:lts-alpine AS build
RUN apk add --no-cache gettext
WORKDIR /usr/src/app
COPY package*.json .
COPY --from=dev /usr/src/app/node_modules ./node_modules
COPY --from=dev /usr/src/app .
COPY secrets/keycloak-config.txt .
COPY .ops/docker/frontend/update-angular-environment.sh .
RUN sh update-angular-environment.sh "apps/frontend/src/environments/environment.ts" "keycloak-config.txt"
RUN npx nx build frontend \
    && npm pkg delete scripts.prepare \
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
