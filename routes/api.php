<?php

use App\Http\Controllers\GroupController;
use App\Http\Middleware\CheckGroupAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/create', [GroupController::class, 'store']);

Route::get('/data', function (Request $request) {
    $delay = rand(2, 8);
    sleep($delay);

    $message = __('data_response', ['delay' => $delay]);

    return response()->json(['message' => $message]);
});

Route::middleware(CheckGroupAccess::class)->group(function () {
    Route::get('/', function () {
        abort(404, __('messages.pageNotFound'));
    })->name('api.root');

    Route::get('/groups/{token}', [GroupController::class, 'show']);
    Route::put('/groups/{token}', [GroupController::class, 'update']);
    Route::post('/groups/{token}/members', [GroupController::class, 'addMember'])->name('members.store');
});

Route::fallback(function (Request $request) {
    return response()->json(['message' => __('messages.pageNotFound')], 404);
});