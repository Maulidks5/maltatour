<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Malta Tours and Safari — authentic Zanzibar tours and Tanzania safaris.">
        <meta name="theme-color" content="#14213D">
        <meta name="robots" content="{{ request()->is('admin*') ? 'noindex,nofollow' : 'index,follow' }}">
        <link rel="canonical" href="{{ url()->current() }}">
        <link rel="icon" type="image/png" href="/brand/favicon.png">

        <title inertia>{{ config('app.name', 'Malta Tours and Safari') }}</title>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
