<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Course extends Model
{
    use HasFactory, HasTranslations;

    public array $translatable = [
        'title',
        'description',
    ];

    protected $fillable = [
        'title',
        'description',
        'course_code',
        'credits',
    ];

    protected $casts = [
        'credits' => 'integer',
    ];
}
