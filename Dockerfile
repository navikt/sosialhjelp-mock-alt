FROM gcr.io/distroless/nodejs:18 as runtime


WORKDIR /app

COPY package.json /app/
COPY .next/standalone /app/
COPY public /app/public/
COPY .next/static /app/.next/static


EXPOSE 3000

ENV NODE_ENV=production

CMD ["server.js"]