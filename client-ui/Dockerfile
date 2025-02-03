FROM node:22-bullseye-slim AS base

ENV NODE_ENV=production

# https://github.com/nodejs/corepack/issues/612#issuecomment-2629496091
RUN npm install -g corepack@latest

RUN corepack enable

# build stage

FROM base AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

COPY . .
RUN pnpm run build
RUN pnpm prune --prod

# runtime stage

FROM base

WORKDIR /app

COPY package.json .
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build/client /app/build/client
COPY --from=build /app/build/server /app/build/server

RUN corepack install

CMD ["pnpm", "start"]
