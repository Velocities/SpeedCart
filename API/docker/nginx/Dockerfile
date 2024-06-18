# nginx Dockerfile

FROM nginx:alpine

WORKDIR /etc/nginx

# Copy SSL certificates
COPY ssl /etc/nginx/ssl

# Copy Nginx configuration
COPY conf.d /etc/nginx/conf.d

# Copy Snippets
COPY snippets /etc/nginx/snippets

RUN ls -la /etc/nginx/snippets

# Expose ports
EXPOSE 80 443
