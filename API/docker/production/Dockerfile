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
    libicu-dev \
    zip \
    unzip \
    libzip-dev \
    --no-install-recommends \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
# - Add required libs for building `intl` (libicu-dev) above
# - Configure `gd` with freetype and jpeg support
# - Don't call `docker-php-ext-install pdo` (PDO is built in); install only drivers like pdo_mysql
# - Enable opcache with docker-php-ext-enable
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd intl zip soap \
 && docker-php-ext-enable opcache

# Copy custom opcache configuration
COPY ./opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Enable Apache Rewrite module (required by Laravel)
RUN a2enmod rewrite

# Copy existing application directory contents
COPY . /var/www/html

# Set Apache to serve the Laravel "public" directory
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf

# Also allow .htaccess overrides in public directory
RUN echo '<Directory /var/www/html/public>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' >> /etc/apache2/apache2.conf

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
