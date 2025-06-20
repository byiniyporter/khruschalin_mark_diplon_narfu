# Этап сборки
FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Этап nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
