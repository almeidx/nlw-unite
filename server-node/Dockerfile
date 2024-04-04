FROM node:20-alpine AS base

RUN corepack enable && corepack install -g pnpm@8

FROM base AS deps

WORKDIR /usr/src/app

COPY package.json ./

RUN pnpm install

FROM base AS build

WORKDIR /usr/src/app

COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules

RUN pnpm exec prisma generate
RUN pnpm run build
RUN pnpm prune --prod

FROM base AS release

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json
COPY .env ./.env

EXPOSE 3333

CMD ["pnpm", "start"]
