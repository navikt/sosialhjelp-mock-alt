FROM node:14-alpine

ENV NODE_ENV production

WORKDIR /app
COPY server.js server.js
COPY build build/

CMD ["node", "./server.js"]