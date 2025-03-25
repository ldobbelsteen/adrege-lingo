FROM docker.io/library/node:22-bookworm AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run check
RUN npm run build

FROM docker.io/library/nginx:1.27-alpine
COPY --from=builder /build/dist /usr/share/nginx/html
EXPOSE 80
