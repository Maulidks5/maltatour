# Malta Tours cPanel deployment

The server has PHP 8.3 and Git, but no global Composer, Node.js or npm. Frontend
assets must therefore be built locally and committed in `public/build`.

## Server layout

- Laravel application: `/home/maltatourtravel/malta-app`
- Fixed primary-domain document root: `/home/maltatourtravel/public_html`

Keep `.env`, `vendor`, `app`, `storage` and the rest of Laravel outside the
public document root. `deploy-cpanel.sh` places only the safe front controller in
`public_html` and links the public build, brand, images and uploaded media. It
preserves cPanel's `.well-known`, `cgi-bin`, `php.ini`, `.user.ini` and existing
PHP handler rules.

## Local release

Before pushing an update:

```bash
npm ci
npm run build
git add public/build
git add -A
git commit -m "Prepare production release"
git push origin main
```

Never commit `.env`, email passwords or database passwords.

## First server setup

Clone the repository:

```bash
cd /home/maltatourtravel
git clone REPOSITORY_URL malta-app
cd malta-app
```

Install a project-local Composer binary using the official Composer installer,
then create `.env`, generate `APP_KEY`, and configure the production database and
SMTP credentials.

For the first deployment only, import the prepared public CMS content. The
snapshot excludes users, bookings, messages, sessions and credentials:

```bash
php artisan db:seed --class=ProductionContentSeeder --force
```

Do not run that seeder during normal updates. Content edited in the production
CMS remains in MySQL, while uploaded images remain in `storage/app/public`.

## Normal update

```bash
cd /home/maltatourtravel/malta-app
git pull --ff-only origin main
bash deploy-cpanel.sh
```

The deployment script installs production PHP dependencies, migrates the
database, creates the storage link when needed, and rebuilds Laravel caches.
