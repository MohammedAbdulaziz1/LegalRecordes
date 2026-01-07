<?php

use App\Http\Controllers\Api\ArchiveController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AppealCaseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PrimaryCaseController;
use App\Http\Controllers\Api\SupremeCourtCaseController;
use App\Http\Controllers\Api\UserPermissionController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // Dashboard routes
    Route::get('/dashboard/statistics', [DashboardController::class, 'statistics']);

    // Primary Cases routes
    Route::apiResource('cases/primary', PrimaryCaseController::class);

    // Appeal Cases routes
    Route::apiResource('cases/appeal', AppealCaseController::class);

    // Supreme Court Cases routes
    Route::apiResource('cases/supreme', SupremeCourtCaseController::class);

    // User Permissions routes
    Route::get('/users/permissions', [UserPermissionController::class, 'index']);
    Route::get('/users/{id}/permissions', [UserPermissionController::class, 'show']);
    Route::put('/users/{id}/permissions', [UserPermissionController::class, 'update']);

    // Archive routes
    Route::get('/archive', [ArchiveController::class, 'index']);
    Route::get('/archive/{id}', [ArchiveController::class, 'show']);
    Route::get('/archive/case/{caseType}/{caseId}', [ArchiveController::class, 'getCaseHistory']);
});

