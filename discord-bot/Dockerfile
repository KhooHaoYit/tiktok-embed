ARG PNPM_VERSION=8.3.1

FROM node:18-alpine AS BUILDER
RUN npm i -g pnpm@$PNPM_VERSION
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY package.json ./
RUN pnpm i --offline

COPY . .
RUN npm run build

FROM node:18-alpine AS PRODUCTION_PACKAGE
RUN npm i -g pnpm@$PNPM_VERSION
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod
COPY package.json ./
RUN pnpm i -P --offline

FROM node:18-alpine
WORKDIR /app
COPY --from=PRODUCTION_PACKAGE /app/node_modules /app/node_modules
COPY --from=PRODUCTION_PACKAGE /app/package.json /app/package.json
COPY --from=BUILDER /app/dist /app/dist
CMD ["npm", "run", "start"]
