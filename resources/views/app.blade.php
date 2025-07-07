<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }}</title>
    <link rel="icon" href="/images/icons/favicon.ico" sizes="any">
    <link rel="icon" href="/images/icons/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/images/icons/apple-touch-icon.png">
    <link rel="manifest" href="/build/manifest.webmanifest" />
    @viteReactRefresh
    @vite('client/src/main.tsx')
</head>
<body>
    <div id="app"></div>
</body>
</html>