FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:latest-dev AS builder

ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --include=dev

COPY . .
RUN npm run build

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/nginx AS production
COPY --from=builder dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
