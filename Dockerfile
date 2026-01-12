# Tahap 1 : Build Vue App 
FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Tahap 2 : Serve dengan Nginx
FROM nginx:alpine

# hapus default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Salin hasil build ke folder nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# (Opsional) salin konfigurasi custon nginx jika ada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]