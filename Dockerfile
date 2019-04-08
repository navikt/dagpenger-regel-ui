FROM node:current-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN chown node:node /usr/src/app

USER node

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY .npmrc .npmrc
COPY package.json /usr/src/app/
RUN npm install && npm cache clean --force && rm -f .npmrc

COPY . /usr/src/app
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
