<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/translations/{locale}', function ($locale) {
    app()->setLocale($locale);
    $translations = trans()->getLoader()->load($locale, '*', '*');
    return response()->json($translations);
});

// Route::get('/data', function () {
//     $delay = rand(2, 8);
//     sleep($delay);
//     return response()->json(['message' => "داده بعد از {$delay} ثانیه"]);
// });

Route::get('/data', function (Request $request) {
    $locale = $request->header('Accept-Language', 'en'); // پیش‌فرض en اگه هدر نبود
    app()->setLocale($locale); // تنظیم زبان اپلیکیشن

    $delay = rand(2, 8);
    sleep($delay);

    // $message = __('messages.data_message', ['delay' => $delay]); // گرفتن پیام ترجمه‌شده
    return response()->json(['message' => $message]);
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