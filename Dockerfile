FROM node:23-alpine AS builder

ENV NODE_ENV production

COPY package.json .
COPY package-lock.json .
RUN npm install --include=dev

COPY . .
RUN npm run build

FROM nginx:alpine AS server

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder dist /usr/share/nginx/html