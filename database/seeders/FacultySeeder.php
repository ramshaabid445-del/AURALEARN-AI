<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    public function run(): void
    {
        $faculties = [
            [
                'name' => 'Dr. Ahmed Raza',
                'email' => 'ahmed.raza@university.edu',
                'subject' => 'Computer Science',
                'workload' => 80,
                'assigned' => 5,
                'status' => 'Available',
            ],
            [
                'name' => 'Prof. Fatima Noor',
                'email' => 'fatima.noor@university.edu',
                'subject' => 'Mathematics',
                'workload' => 90,
                'assigned' => 6,
                'status' => 'Available',
            ],
            [
                'name' => 'Dr. Imran Khan',
                'email' => 'imran.khan@university.edu',
                'subject' => 'Physics',
                'workload' => 70,
                'assigned' => 4,
                'status' => 'Available',
            ],
        ];

        foreach ($faculties as $faculty) {
            Faculty::updateOrCreate([
                'email' => $faculty['email'],
            ], $faculty);
        }
    }
}