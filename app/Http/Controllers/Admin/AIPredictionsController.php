<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AIPredictionsController extends Controller
{
    public function index(): Response
    {
        $students = Student::with('performance')->get()->map(function (Student $student) {
            $score = $student->performance?->predicted_grade ?? 0;
            return [
                'id' => $student->id,
                'name' => trim($student->first_name . ' ' . $student->last_name),
                'gradeLevel' => $this->gradeLevel($score),
                'currentGrade' => round($score, 1),
                'attendance' => $student->performance?->attendance ?? 0,
                'riskScore' => round($score),
            ];
        });

        return Inertia::render('Admin/AIPredictions', [
            'riskStudents' => $students->filter(fn ($student) => $student['riskScore'] >= 70)->values(),
            'userName' => Auth::user()?->name ?? 'Admin',
        ]);
    }

    private function gradeLevel(float $predicted): string
    {
        if ($predicted >= 90) {
            return 'Grade 12';
        }

        if ($predicted >= 75) {
            return 'Grade 11';
        }

        if ($predicted >= 60) {
            return 'Grade 10';
        }

        return 'Grade 9';
    }
}
