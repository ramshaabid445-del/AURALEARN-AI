<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public function sendLowGradeAlert(Student $student, float $predictedGrade): void
    {
        Log::info('MockGradeAlert: student predicted grade below threshold', [
            'student_id' => $student->id,
            'email' => $student->email,
            'predicted_grade' => $predictedGrade,
        ]);
    }
}
