FROM cgr.dev/chainguard/node:latest-dev AS builder

USER ROOT
ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --include=dev

COPY . .
RUN npm run build

FROM cgr.dev/chainguard/nginx AS production
COPY --from=builder dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
