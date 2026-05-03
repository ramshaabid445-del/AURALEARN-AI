<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentPerformance;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        $students = Student::with('performance')->get();
        $performanceValues = $students->map(fn ($student) => $student->performance?->predicted_grade ?? 0);
        $averageGrade = $performanceValues->count() ? round($performanceValues->avg()) : 0;
        $highPerformers = $students->filter(fn ($student) => ($student->performance?->predicted_grade ?? 0) >= 80)->count();
        $exportMetrics = [
            'average' => $averageGrade,
            'highPerformers' => $highPerformers,
            'riskMitigation' => 100 - min(100, $students->filter(fn ($student) => ($student->performance?->predicted_grade ?? 0) >= 75)->count() * 12),
            'reports' => $students->count(),
        ];

        $trend = collect(['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'])->mapWithKeys(function ($month, $index) use ($averageGrade) {
            return [$index => [
                'month' => $month,
                'performance' => min(100, max(50, $averageGrade + ($index - 2) * 3)),
                'risk' => min(100, max(18, 42 - ($index - 2) * 2)),
                'low' => max(0, 20 - $index * 2),
                'medium' => 25 + $index,
                'high' => 30 + $index,
                'excellent' => 25 - $index,
            ]];
        })->values()->all();

        return Inertia::render('Admin/Reports', [
            'students' => $students->map(fn ($student) => [
                'id' => $student->id,
                'name' => trim($student->first_name . ' ' . $student->last_name),
                'predicted_grade' => $student->performance?->predicted_grade ?? 0,
                'risk' => $student->performance?->predicted_grade ?? 0 < 65 ? 'High' : 'Low',
            ]),
            'trendData' => $trend,
            'summary' => [
                'average' => $averageGrade,
                'topPerformers' => $highPerformers,
                'riskMitigation' => max(0, 100 - $students->filter(fn ($student) => ($student->performance?->predicted_grade ?? 0) < 65)->count() * 10),
            ],
            'userName' => Auth::user()?->name ?? 'Admin',
        ]);
    }
}
