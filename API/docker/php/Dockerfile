# Use the official PHP image as a base image
FROM php:8.2-fpm

# Set working directory (all subsequent commands will be run in this directory)
WORKDIR /var/www/SpeedCart/API

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    jpegoptim optipng pngquant gifsicle \
    vim \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    sqlite3 \
    libsqlite3-dev \
    --no-install-recommends

# Clear cache (This cleans up the package cache to reduce the size of the Docker image)
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions required by Laravel
RUN docker-php-ext-install pdo pdo_sqlite mbstring exif pcntl bcmath gd intl zip soap

# Install Composer (copies the composer binary from the latest Composer image 
# into your Docker image, making Composer available for dependency management)
COPY --from=composer:2.1.3 /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents from working directory
# on host to /var/www/SpeedCart/API in the container
COPY . /var/www/SpeedCart/API

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www/SpeedCart/API

# Change current user to www-data (used by web servers to improve security)
USER www-data

# Expose port 9000 (the default port for PHP-FPM to listen on) and start php-fpm server
# (Even if you are using Nginx as a reverse proxy, PHP-FPM will still need to be exposed 
# internally within the Docker network, which is why we need EXPOSE 9000)
EXPOSE 9000
CMD ["php-fpm"]
