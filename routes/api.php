<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/translations/{locale}', function ($locale) {
    app()->setLocale($locale);
    $translations = trans()->getLoader()->load($locale, '*', '*');
    return response()->json($translations);
});

Route::get('/data', function (Request $request) {
    $locale = in_array($request->header('Accept-Language'), ['fa', 'en'])
        ? $request->header('Accept-Language')
        : 'fa';
    app()->setLocale($locale);
    // $locale = $request->header('Accept-Language', 'fa');
    // app()->setLocale($locale);

    $delay = rand(2, 8);
    sleep($delay);

    $message = trans('data_response', ['delay' => $delay]);

    return response()->json(['message' => $message]);
});