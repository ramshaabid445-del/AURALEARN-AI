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
        $riskStudents = Student::query()
            ->whereHas('performance', function ($query) {
                $query->where('predicted_grade', '<', 65);
            })
            ->with('performance')
            ->get()
            ->map(function (Student $student): array {
                return [
                    'id' => $student->id,
                    'name' => trim($student->first_name.' '.$student->last_name),
                    'email' => $student->email,
                    'predicted_grade' => $student->performance?->predicted_grade ?? 0,
                ];
            })
            ->values();

        return Inertia::render('Admin/Dashboard', [
            'totalStudents' => Student::query()->count(),
            'riskStudents' => $riskStudents,
            'gradeDistribution' => [
                'Low' => StudentPerformance::query()->where('predicted_grade', '<', 60)->count(),
                'Medium' => StudentPerformance::query()->whereBetween('predicted_grade', [60, 74.99])->count(),
                'High' => StudentPerformance::query()->whereBetween('predicted_grade', [75, 89.99])->count(),
                'Excellent' => StudentPerformance::query()->where('predicted_grade', '>=', 90)->count(),
            ],
            'userName' => Auth::user()?->name ?? 'Admin',
        ]);
    }
}
