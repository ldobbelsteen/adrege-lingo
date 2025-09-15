FROM docker.io/node:24-bookworm AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run check
RUN npm run build

FROM docker.io/nginx:1.29-alpine
COPY --from=builder /build/dist /usr/share/nginx/html
EXPOSE 80
