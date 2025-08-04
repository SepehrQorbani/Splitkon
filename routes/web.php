<?php

use App\Models\Group;
use Illuminate\Support\Facades\Route;

// Route::get('/', function (?string $path = null) {
//     return view('home', [
//         'layout' => 'main',
//     ]);
// });

Route::get('/{path?}', function (?string $path = null) {
    $token = explode('/', $path)[0];
    if (strlen($token) === 32) {
        $group = Group::where('view_token', $token)
            ->orWhere('edit_token', $token)
            ->first();

        return view('app', ['group' => $group]);
    }

    return view('app');
})->where('path', '^(?!api).*');
