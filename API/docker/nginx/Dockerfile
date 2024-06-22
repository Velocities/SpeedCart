# nginx Dockerfile

FROM nginx:alpine

WORKDIR /etc/nginx

# No need to COPY SSL certificates directly, as they will be mounted as volumes
# Copy SSL certificates
#COPY docker/nginx/ssl /etc/nginx/ssl

# Copy Nginx configuration
COPY docker/nginx/conf.d /etc/nginx/conf.d

# Copy Snippets
COPY docker/nginx/snippets /etc/nginx/snippets

RUN ls -la /etc/nginx/snippets

# Expose ports
EXPOSE 80 443
