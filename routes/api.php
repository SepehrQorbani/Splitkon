<?php

use App\Http\Controllers\GroupController;
use App\Http\Middleware\CheckGroupAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/translations/{locale}', function ($locale) {
    $translations = trans()->getLoader()->load($locale, '*', '*');
    return response()->json($translations);
});

Route::post('/create', [GroupController::class, 'store']);

Route::get('/data', function (Request $request) {
    $delay = rand(2, 8);
    sleep($delay);

    $message = trans('data_response', ['delay' => $delay]);

    return response()->json(['message' => $message]);
});

Route::middleware(CheckGroupAccess::class)->group(function () {
    Route::get('/', function () {
        abort(404, trans('Page not found'));
    })->name('api.root');

    Route::get('/{token}', [GroupController::class, 'show']);
    Route::put('/{token}', [GroupController::class, 'update']);
    Route::post('/{token}/members', [GroupController::class, 'addMember'])->name('members.store');
});

Route::fallback(function (Request $request) {
    return response()->json(['message' => trans('Page not found')], 404);
});