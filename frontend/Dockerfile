# Stage 1: Build Vite
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_USE_MOCK=true
ENV VITE_USE_MOCK=$VITE_USE_MOCK
RUN npm run build

# Stage 2: Serve dengan Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
