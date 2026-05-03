<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentPerformance;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // 1. Saaray students aur unki performance aik saath uthao
        $allStudents = Student::with('performance')->get();

        // 2. Risk students filter karo (Grade < 65)
        // Agar data na ho toh khali array jaye, dashboard crash na ho
        $riskStudents = $allStudents->filter(function ($student) {
            return ($student->performance?->predicted_grade ?? 0) < 65;
        })->map(function ($student) {
            return [
                'id' => $student->id,
                'name' => trim(($student->first_name ?? '') . ' ' . ($student->last_name ?? '')),
                'email' => $student->email,
                'predicted_grade' => $student->performance?->predicted_grade ?? 0,
            ];
        })->values();

        // 3. Grade Distribution data for Recharts
        $gradeDistribution = [
            'Low'       => StudentPerformance::where('predicted_grade', '<', 60)->count(),
            'Medium'    => StudentPerformance::whereBetween('predicted_grade', [60, 74.99])->count(),
            'High'      => StudentPerformance::whereBetween('predicted_grade', [75, 89.99])->count(),
            'Excellent' => StudentPerformance::where('predicted_grade', '>=', 90)->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'totalStudents'     => Student::count(),
            'riskStudents'      => $riskStudents,
            'gradeDistribution' => $gradeDistribution,
            'userName'          => Auth::user()?->name ?? 'Admin',
            'lastUpdated'       => now()->format('h:i A'),
        ]);
    }
}