FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:latest-dev AS builder

USER root
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY pnpm-*.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM cgr.dev/chainguard/nginx AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
