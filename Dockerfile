FROM node:lts-alpine AS base
WORKDIR /app

FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base
ENV NODE_ENV production
COPY --from=build /app/public /app/public
COPY --from=build /app/.next/standalone /app/
COPY --from=build /app/.next/static /app/.next/static
CMD ["node", "server.js"]
