FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN node build-static.js

FROM nginx:alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app /usr/share/nginx/html
EXPOSE 80
