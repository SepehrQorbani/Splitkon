<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <title>{{ __('ui.app.name') }}{{ isset($group) ? " - $group->title" : '' }}</title>
    <meta name="description" content="{{ __('ui.app.description') }}">
    <meta name="keywords" content="{{ __('ui.app.metaKeywords') }}">
    
    <meta property="og:title" content="{{ __('ui.app.name') }}{{ isset($group) ? " - $group->title" : '' }}">
    <meta property="og:locale" content="fa_IR" />
    <meta property="og:site_name" content="{{ __('ui.app.name') }}" />
    <meta property="og:description" content="{{ __('ui.app.description') }}" />
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
        "name" => __('ui.app.name'),
        "alternateName" => __('ui.app.alternateName'),
        "description" => __('ui.app.description'),
        "operatingSystem" => "Web",
        "keywords" => explode(',', __('ui.app.metaKeywords')),
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
            __('ui.app.feature1'),
            __('ui.app.feature2'),
            __('ui.app.feature3'),
            __('ui.app.feature4'),
        ],

       "name_en" => __('ui.app.name', [], 'en'),
        "alternateName_en" => __('ui.app.alternateName', [], 'en'),
        "description_en" => __('ui.app.description', [], 'en'),
        "keywords_en" => explode(',', __('ui.app.metaKeywords', [], 'en')),
        "featureList_en" => [
            __('ui.app.feature1', [], 'en'),
            __('ui.app.feature2', [], 'en'),
            __('ui.app.feature3', [], 'en'),
            __('ui.app.feature4', [], 'en'),
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