# Use the official PHP 8.2 CLI image
FROM php:8.2-cli-alpine

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libxml2-dev \
    oniguruma-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql mbstring xml

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql mbstring xml

# Install Composer globally
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Copy application source
COPY . /var/www/html

# Install dependencies
RUN composer install

# Set correct permissions
RUN chmod -R 777 storage bootstrap/cache

# Expose port 8000 for Laravel's dev server
EXPOSE 8000

# Start Laravel development server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
