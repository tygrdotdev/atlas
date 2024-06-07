FROM node:20

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm install -g typescript

RUN tsc

ENV NODE_ENV production

CMD ["node", "dist/index.js"]