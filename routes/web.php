<?php

use Illuminate\Support\Facades\Route;

// Serve React app for all routes (SPA fallback)
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
