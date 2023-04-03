FROM node:16 AS builder

WORKDIR /usr/src/app

COPY scripts/ /usr/src/app/scripts
COPY .npmrc package*.json /usr/src/app/
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    NODE_AUTH_TOKEN=$(cat /run/secrets/NODE_AUTH_TOKEN) \
    npm ci --prefer-offline --no-audit --ignore-scripts --legacy-peer-deps

# Kjør evt. script uten NODE_AUTH_TOKEN tilgjengelig
RUN npm rebuild && npm run prepare --if-present

COPY . /usr/src/app
RUN npm run build

FROM node:16-alpine AS runtime

WORKDIR /usr/src/app

ENV PORT=3000 \
    NODE_ENV=production

COPY --from=builder /usr/src/app/.env* /usr/src/app/
COPY --from=builder /usr/src/app/public /usr/src/app/public
COPY --from=builder /usr/src/app/.next/static /usr/src/app/.next/static

EXPOSE 3000
USER node

CMD ["node", "server.js"]