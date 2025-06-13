FROM node:20.17.0 AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

FROM node:20.17.0-alpine3.20

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/nest-cli.json ./nest-cli.json
COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json
COPY --from=builder /usr/src/app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /usr/src/app/src ./src

EXPOSE 3000

CMD ["npm", "run", "start:dev"]