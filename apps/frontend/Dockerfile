FROM docker.io/node:lts-alpine AS dev
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci


FROM docker.io/node:lts-alpine AS build
ARG SENTRY_ORG
ARG SENTRY_DEMO_SHOP_UI_PROJECT
RUN apk add --no-cache gettext
WORKDIR /app
COPY . .
COPY --from=dev /app/node_modules ./node_modules
RUN npx nx build frontend


FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist/apps/frontend/browser ./
COPY static/error-pages /usr/share/nginx/html/error-pages
COPY nginx.conf.template /etc/nginx/templates/demo-shop.conf.template
RUN rm /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
