<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->header('Accept-Language', 'fa');
        $availableLocales = ['en', 'fa'];
        $locale = in_array($locale, $availableLocales) ? $locale : 'fa';
        app()->setLocale($locale);

        return $next($request);
    }
}