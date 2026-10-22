# check=skip=InvalidDefaultArgInFrom

# Node の版は .nvmrc で決め、build のときに build arg で渡す。
# CI のテストと同じ版の Node を image に入れるため、ここには版を書かない。
# NODE_VERSION に既定値を付けると、Renovate がこの FROM も更新の対象として拾うので付けない。
ARG NODE_VERSION

FROM node:${NODE_VERSION}-trixie-slim AS base

ENV NODE_ENV=production
ENV CI=true

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
RUN pnpm run gen:licenses
RUN pnpm prune --prod

# runtime stage

FROM base

WORKDIR /app

COPY package.json .
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build/client /app/build/client
COPY --from=build /app/build/server /app/build/server
COPY --from=build /app/THIRD_PARTY_LICENSES.txt /app/THIRD_PARTY_LICENSES.txt

RUN corepack install

CMD ["pnpm", "start"]
