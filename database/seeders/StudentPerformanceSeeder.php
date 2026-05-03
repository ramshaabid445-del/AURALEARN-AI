<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\StudentPerformance;
use App\Services\AIPredictionService;
use Illuminate\Database\Seeder;

class StudentPerformanceSeeder extends Seeder
{
    public function run(): void
    {
        $predictionService = new AIPredictionService();

        $students = [
            [
                'first_name' => 'Aisha',
                'last_name' => 'Khan',
                'email' => 'aisha.khan@example.com',
                'enrolled_at' => now()->subMonths(8),
                'performance' => [
                    'quiz_scores' => [85, 79, 92],
                    'attendance' => 92, // Ye input data hai, isay rehne dein
                ],
            ],
            [
                'first_name' => 'Zayd',
                'last_name' => 'Ali',
                'email' => 'zayd.ali@example.com',
                'enrolled_at' => now()->subMonths(5),
                'performance' => [
                    'quiz_scores' => [65, 58, 60],
                    'attendance' => 75,
                ],
            ],
            [
                'first_name' => 'Sara',
                'last_name' => 'Hassan',
                'email' => 'sara.hassan@example.com',
                'enrolled_at' => now()->subMonths(10),
                'performance' => [
                    'quiz_scores' => [45, 50, 55],
                    'attendance' => 68,
                ],
            ],
            [
                'first_name' => 'Bilal',
                'last_name' => 'Sheikh',
                'email' => 'bilal.sheikh@example.com',
                'enrolled_at' => now()->subMonths(4),
                'performance' => [
                    'quiz_scores' => [72, 68, 70],
                    'attendance' => 82,
                ],
            ],
            [
                'first_name' => 'Nadia',
                'last_name' => 'Tariq',
                'email' => 'nadia.tariq@example.com',
                'enrolled_at' => now()->subMonths(6),
                'performance' => [
                    'quiz_scores' => [78, 74, 81],
                    'attendance' => 88,
                ],
            ],
        ];

        foreach ($students as $data) {
            $student = Student::firstOrCreate([
                'email' => $data['email'],
            ], [
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'enrolled_at' => $data['enrolled_at'],
            ]);

            $prediction = $predictionService->predictPath([
                'quiz_scores' => $data['performance']['quiz_scores'],
                'attendance' => $data['performance']['attendance'],
            ]);

            StudentPerformance::updateOrCreate(
                ['student_id' => $student->id],
                [
                    'quiz_scores' => $data['performance']['quiz_scores'],
                    // FIXED: Yahan attendance ko attendance_rate kar diya hai
                    'attendance_rate' => $data['performance']['attendance'],
                    'predicted_grade' => $prediction['predicted_grade'],
                    'risk_level' => $prediction['predicted_grade'] < 65 ? 'High' : 'Low',
                ]
            );
        }
    }
}