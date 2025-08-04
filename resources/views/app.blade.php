<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <title>{{ __('ui.appName') }}{{ isset($group) ? " - $group->title" : '' }}</title>
    <meta name="description" content="{{ __('ui.description') }}">
    <meta name="keywords" content="{{ __('ui.metaKeywords') }}">
    
    <meta property="og:title" content="{{ __('ui.appName') }}{{ isset($group) ? " - $group->title" : '' }}">
    <meta property="og:locale" content="fa_IR" />
    <meta property="og:site_name" content="{{ __('ui.appName') }}" />
    <meta property="og:description" content="{{ __('ui.description') }}" />
    <meta property="og:image" content="{{ asset("/images/og-image.jpg") }}?v={{ filemtime(public_path("/images/og-image.jpg")) }}">
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ request()->fullUrl() }}" />

    <link rel="icon" href="/images/icons/favicon.ico" sizes="any">
    <link rel="icon" href="/images/icons/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/images/icons/apple-touch-icon.png">
    <link rel="manifest" href="/build/manifest.webmanifest" />
    @viteReactRefresh
    @vite('client/src/main.tsx')
    @php
    $schemaData = [
        "@context" => "https://schema.org",
        "@type" => "SoftwareApplication",
        "applicationCategory" => "WebApplication",
        "name" => __('ui.appName'),
        "alternateName" => __('ui.alternateName'),
        "description" => __('ui.description'),
        "operatingSystem" => "Web",
        "keywords" => explode(',', __('ui.metaKeywords')),
        "offers" => [
            "@type" => "Offer",
            "price" => "0",
            "priceCurrency" => "IRR",
            "availability" => "https://schema.org/InStock"
        ],
        "url" => config('app.url'),
        "applicationUrl" => url('/new'),
        "image" => asset('images/logo.png'),
        "featureList" => [
            __('ui.feature1'),
            __('ui.feature2'),
            __('ui.feature3'),
            __('ui.feature4'),
        ],

       "name_en" => __('ui.appName', [], 'en'),
        "alternateName_en" => __('ui.alternateName', [], 'en'),
        "description_en" => __('ui.description', [], 'en'),
        "keywords_en" => explode(',', __('ui.metaKeywords', [], 'en')),
        "featureList_en" => [
            __('ui.feature1', [], 'en'),
            __('ui.feature2', [], 'en'),
            __('ui.feature3', [], 'en'),
            __('ui.feature4', [], 'en'),
        ],
    ];
@endphp

<script type="application/ld+json">
{!! json_encode($schemaData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
</head>
<body>
    <div id="app"></div>
</body>
</html>