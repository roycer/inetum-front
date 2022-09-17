FROM node:16-alpine AS app-build

WORKDIR /app

COPY . .

RUN npm ci && npm run build

FROM nginx:alpine

COPY --from=app-build /app/dist/app-builder /usr/share/nginx/html

EXPOSE 80