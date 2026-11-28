<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Publik (dibatasi laju untuk mencegah brute force)
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    // Wajib login (token Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
        Route::get('/me', [AuthController::class, 'me']);

        Route::get('/profile', [ProfileController::class, 'show']);
        // Upload file (multipart) harus memakai POST; PUT hanya untuk body JSON
        Route::match(['put', 'post'], '/profile', [ProfileController::class, 'update']);
        Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

        // Khusus admin (contoh; endpoint manajemen user akan ditaruh di sini)
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/ping', fn () => response()->json(['message' => 'pong, admin']));
        });
    });
});
