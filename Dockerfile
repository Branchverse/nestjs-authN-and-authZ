FROM node:current-alpine as dev

WORKDIR /usr/src/app

EXPOSE 3001

COPY package.json ./

RUN npm i --only=dev

COPY . .

RUN npm run build

FROM node:current-alpine as prod

ARG NODE_ENV=prod

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=prod

COPY --from=dev /usr/src/app/dist ./dist

COPY --from=dev /usr/src/app/package.json .

CMD ["node", "dist/main"]