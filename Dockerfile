FROM gcr.io/distroless/nodejs:18 as runtime


WORKDIR /app

COPY package.json ./
COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY .env /app/

EXPOSE 3000

ENV NODE_ENV=production

CMD ["server.js"]