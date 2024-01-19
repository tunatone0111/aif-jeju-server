FROM node:20.11-alpine AS base

# dependencies
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

# build
FROM base AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build
ENV NODE_ENV production
RUN yarn --frozen-lockfile --production

# production
FROM base AS production
WORKDIR /app

COPY .env ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000 

ENTRYPOINT ["node", "dist/main"]