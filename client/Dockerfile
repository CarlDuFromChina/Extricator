# Stage 1: Build Angular static assets
FROM node:14-alpine as node
WORKDIR /app
COPY ./ /app/
RUN npm config set registry https://registry.npm.taobao.org \
    && npm install \
    && npm run build

# Stage 2: Serve Angular assets using NGINX
FROM nginx:1.15.2-alpine

# Copy custom nginx config
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist /usr/share/nginx/html
EXPOSE 80 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]