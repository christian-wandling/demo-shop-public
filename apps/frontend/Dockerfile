FROM docker.io/node:lts-alpine AS dev
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .


FROM docker.io/node:lts-alpine AS build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=dev /usr/src/app .
RUN npx nx build frontend
RUN npm pkg delete scripts.prepare
RUN npm ci --omit=dev && npm cache clean --force
USER node


FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --chown=node:node --from=build /usr/src/app/dist/apps/frontend/browser ./
COPY --chown=node:node ./secrets/server.key /etc/ssl/keys/server.key
COPY --chown=node:node ./secrets/server.crt ./secrets/dhparam.pem /etc/ssl/certs/
COPY --chown=node:node nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
