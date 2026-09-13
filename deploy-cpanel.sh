#!/usr/bin/env bash

set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"

if [ ! -f composer.phar ]; then
    echo "composer.phar is missing. Install Composer in the project directory first."
    exit 1
fi

if [ ! -f .env ]; then
    echo ".env is missing. Create production .env before deploying."
    exit 1
fi

if [ ! -f public/build/manifest.json ]; then
    echo "public/build/manifest.json is missing. Build and commit frontend assets locally first."
    exit 1
fi

php composer.phar install --no-dev --prefer-dist --optimize-autoloader --no-interaction
php artisan migrate --force

if [ ! -L public/storage ]; then
    php artisan storage:link
fi

php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Malta Tours deployment completed successfully."
