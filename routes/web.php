<?php

use App\Http\Controllers\Auth\WebAuthController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// Namespaces ko direct use karein taake confusion na ho
Route::get('/', [WebAuthController::class, 'redirectToPortal'])->name('home');
Route::get('/login', [WebAuthController::class, 'showLogin'])->name('login');
Route::post('/login', [WebAuthController::class, 'login'])->name('login.post');
Route::post('/logout', [WebAuthController::class, 'logout'])->name('logout');

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Yahan humne direct string path diya hai taake agar import mein masla ho toh solve ho jaye
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/students', fn () => Inertia::render('Admin/Students'))->name('students.index');
    Route::get('/students/{student}', fn ($student) => Inertia::render('Admin/StudentProfile', [
        'studentId' => $student,
    ]))->name('students.show');
    Route::get('/reports', fn () => Inertia::render('Admin/Reports'))->name('reports.index');
    Route::get('/settings', fn () => Inertia::render('Admin/Settings'))->name('settings.index');
    Route::get('/academic-analytics', fn () => Inertia::render('Admin/AcademicAnalytics'))->name('academic-analytics.index');
    Route::get('/ai-predictions', fn () => Inertia::render('Admin/AIPredictions'))->name('ai-predictions.index');
    Route::get('/faculty', fn () => Inertia::render('Admin/FacultyManagement'))->name('faculty.index');
    Route::get('/intervention-logs', fn () => Inertia::render('Admin/InterventionLogs'))->name('intervention-logs.index');
});

// Student Routes
Route::middleware(['auth'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
});
