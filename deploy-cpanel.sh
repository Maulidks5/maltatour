#!/usr/bin/env bash

set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
ACCOUNT_DIR="$(dirname "$APP_DIR")"
PUBLIC_DIR="$ACCOUNT_DIR/public_html"
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

if [ ! -d "$PUBLIC_DIR" ]; then
    echo "Expected cPanel public directory was not found: $PUBLIC_DIR"
    exit 1
fi

php composer.phar install --no-dev --prefer-dist --optimize-autoloader --no-interaction
php artisan migrate --force

if [ ! -L public/storage ]; then
    php artisan storage:link
fi

# The primary cPanel domain is fixed to public_html. Keep Laravel source and
# .env outside it, and expose only the front controller and public assets.
cp deployment/cpanel/index.php "$PUBLIC_DIR/index.php"

link_public_asset() {
    source_path="$1"
    destination_path="$2"

    if [ -e "$destination_path" ] && [ ! -L "$destination_path" ]; then
        echo "Cannot create public link because this path already exists: $destination_path"
        exit 1
    fi

    ln -sfn "$source_path" "$destination_path"
}

link_public_asset "$APP_DIR/public/build" "$PUBLIC_DIR/build"
link_public_asset "$APP_DIR/public/brand" "$PUBLIC_DIR/brand"
link_public_asset "$APP_DIR/public/images" "$PUBLIC_DIR/images"
link_public_asset "$APP_DIR/storage/app/public" "$PUBLIC_DIR/storage"
link_public_asset "$APP_DIR/public/favicon.ico" "$PUBLIC_DIR/favicon.ico"
link_public_asset "$APP_DIR/public/robots.txt" "$PUBLIC_DIR/robots.txt"

touch "$PUBLIC_DIR/.htaccess"
if ! grep -q 'MALTA_LARAVEL_BEGIN' "$PUBLIC_DIR/.htaccess"; then
    printf '\n' >> "$PUBLIC_DIR/.htaccess"
    sed -n '1,$p' deployment/cpanel/laravel-rewrites.conf >> "$PUBLIC_DIR/.htaccess"
fi

php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Malta Tours deployment completed successfully."
