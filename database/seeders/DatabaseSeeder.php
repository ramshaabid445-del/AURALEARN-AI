<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\StudentPerformance;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'AuraLearn Admin',
            'email' => 'admin@auralearn.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
        ]);

        $studentUsers = [
            ['name' => 'Aisha Khan', 'email' => 'aisha.khan@example.com'],
            ['name' => 'Zayd Ali', 'email' => 'zayd.ali@example.com'],
            ['name' => 'Sara Hassan', 'email' => 'sara.hassan@example.com'],
            ['name' => 'Bilal Sheikh', 'email' => 'bilal.sheikh@example.com'],
            ['name' => 'Nadia Tariq', 'email' => 'nadia.tariq@example.com'],
        ];

        foreach ($studentUsers as $studentUser) {
            User::factory()->create([
                'name' => $studentUser['name'],
                'email' => $studentUser['email'],
                'role' => 'student',
                'password' => Hash::make('password'),
            ]);
        }

        $this->call([
            CourseSeeder::class,
            StudentPerformanceSeeder::class,
        ]);
    }
}
