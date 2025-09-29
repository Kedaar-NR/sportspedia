# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY server/package.json server/package-lock.json* ./
RUN npm ci --omit=dev

FROM node:20-alpine AS build
WORKDIR /app
COPY server/package.json server/package-lock.json* ./
RUN npm ci
COPY server/tsconfig.json ./tsconfig.json
COPY server/src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY server/public ./public
COPY server/cache ./cache
EXPOSE 8080
CMD ["node", "dist/server.js"]
