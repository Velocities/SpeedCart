FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    --no-install-recommends \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd intl zip soap

# Enable Apache Rewrite module (required by Laravel)
RUN a2enmod rewrite

# Copy existing application directory contents
COPY . /var/www/html

# Copy existing application directory permissions
RUN chown -R www-data:www-data /var/www/html \
 && chmod -R 755 /var/www/html

# Set recommended PHP.ini settings
RUN cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini

# Set Laravel permissions
RUN chown -R www-data:www-data /var/www/html/

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Install composer dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Expose Apache port
EXPOSE 80
