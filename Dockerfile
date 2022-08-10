FROM node:16 AS builder

WORKDIR /usr/src/app

COPY scripts/ /usr/src/app/scripts
COPY package*.json /usr/src/app/
RUN npm ci --prefer-offline --no-audit --legacy-peer-deps

COPY . /usr/src/app
RUN npm run build

FROM node:16-alpine AS runtime

WORKDIR /usr/src/app

ENV PORT=3000 \
    NODE_ENV=production

COPY --from=builder /usr/src/app/.env* /usr/src/app/
COPY --from=builder /usr/src/app/public /usr/src/app/public
COPY --from=builder /usr/src/app/.next/static /usr/src/app/.next/static
COPY --from=builder /usr/src/app/.next/standalone /usr/src/app/

EXPOSE 3000
USER node

CMD ["node", "server.js"]