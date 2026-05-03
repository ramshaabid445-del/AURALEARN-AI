<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Pehle check karein ke table exist toh nahi karti (Errors se bachne ke liye)
        Schema::dropIfExists('student_performances');

        Schema::create('student_performances', function (Blueprint $table) {
            $table->id();
            
            // Student ke saath relationship
            $table->foreignId('student_id')
                  ->constrained('students')
                  ->cascadeOnDelete();
            
            // Performance Data
            $table->decimal('predicted_grade', 5, 2)->default(0.00);
            $table->decimal('attendance_rate', 5, 2)->default(0.00);
            
            // Dashboard analytics ke liye extra fields
            $table->json('quiz_scores')->nullable();
            $table->string('risk_level')->default('Low'); // Low, Medium, High
            $table->string('last_assessment_date')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_performances');
    }
};