<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Services\AIPredictionService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(AIPredictionService $predictionService)
    {
        $userEmail = auth()->user()->email;
        $student = Student::with('performance')->where('email', $userEmail)->first();

        $studentData = [
            'name' => auth()->user()->name,
            'email' => $userEmail,
            'predicted_grade' => $student?->performance?->predicted_grade ?? null,
            'recommended_path' => [],
        ];

        if ($student?->performance) {
            $studentData['recommended_path'] = $predictionService->generatePersonalizedPath([
                'quiz_scores' => $student->performance->quiz_scores,
                'attendance' => $student->performance->attendance,
            ]);
        }

        return Inertia::render('Student/Dashboard', [
            'student' => $studentData,
            'userName' => auth()->user()->name,
        ]);
    }
}
