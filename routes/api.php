<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\DiscussionController;
use App\Http\Controllers\API\HealthController;
use App\Http\Controllers\API\StudentController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('health', [HealthController::class, 'check']);
Route::get('microservice/status', [HealthController::class, 'microserviceStatus']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('students/{id}/predict', [StudentController::class, 'predict']);
    Route::apiResource('students', StudentController::class);
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('discussions', DiscussionController::class)->only(['index', 'store']);
});
