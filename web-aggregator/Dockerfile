FROM node:20 AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install


COPY . .

ENV DATABASE_URL="mysql://temp:temp@localhost:3306/temp"

RUN npx prisma generate

RUN yarn build


FROM node:20 AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma


EXPOSE 3000

CMD npx prisma generate && node dist/main.js

