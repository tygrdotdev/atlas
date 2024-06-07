FROM node:latest

ENV NODE_ENV production

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

RUN npm run build

CMD [ "node", "dist/index.js "]