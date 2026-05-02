<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentPerformance extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'quiz_scores',
        'attendance',
        'predicted_grade',
    ];

    protected $casts = [
        'quiz_scores' => 'array',
        'attendance' => 'float',
        'predicted_grade' => 'float',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
