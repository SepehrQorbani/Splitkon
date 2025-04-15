<?php

use App\Http\Controllers\BalanceController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\RepayController;
use App\Http\Controllers\SummaryController;
use App\Http\Middleware\CheckGroupAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//---------- temp
Route::get('/data', function (Request $request) {
    $delay = rand(1, 2);
    sleep($delay);

    $message = __('data_response', ['delay' => $delay]);

    return response()->json(['message' => $message]);
});
// Route::get('/groups/{group}/members/{id}', [MemberController::class, 'show']);
//---------- end temp

Route::post('/groups', [GroupController::class, 'store']);
Route::prefix('groups')->middleware(CheckGroupAccess::class)->group(function () {
    // Route::get('/', function () {
    //     abort(404, __('messages.pageNotFound'));
    // })->name('api.root');

    Route::get('/{token}', [GroupController::class, 'show']);
    Route::put('/{token}', [GroupController::class, 'update']);

    Route::get('/{token}/summary', [SummaryController::class, 'show']);

    Route::get('/{token}/members', [MemberController::class, 'index']);
    Route::post('/{token}/members', [MemberController::class, 'store'])->name('members.store');
    Route::get('/{token}/members/{id}', [MemberController::class, 'show']);
    Route::patch('/{token}/members/{id}', [MemberController::class, 'update']);
    Route::delete('/{token}/members/{id}', [MemberController::class, 'destroy']);

    Route::get('/{token}/expenses', [ExpenseController::class, 'index']);
    Route::post('/{token}/expenses', [ExpenseController::class, 'store']);
    Route::get('/{token}/expenses/{expense}', [ExpenseController::class, 'show']);
    Route::patch('/{token}/expenses/{expense}', [ExpenseController::class, 'update']);
    Route::delete('/{token}/expenses/{expense}', [ExpenseController::class, 'destroy']);

    Route::get('/{token}/repays', [RepayController::class, 'index']);
    Route::post('/{token}/repays', [RepayController::class, 'store']);
    Route::get('/{token}/repays/{repay}', [RepayController::class, 'show']);
    Route::patch('/{token}/repays/{repay}', [RepayController::class, 'update']);

    Route::get('/{token}/balance', [BalanceController::class, 'index']);

    // Route::get('/{token}/attachments', [AttachmentController::class, 'index']);
    // Route::post('/{token}/attachments', [AttachmentController::class, 'store']);
    // Route::get('/{token}/attachments/{attachment}', [AttachmentController::class, 'show']);
});

Route::fallback(function (Request $request) {
    return response()->json(['message' => __('messages.pageNotFound')], 404);
});