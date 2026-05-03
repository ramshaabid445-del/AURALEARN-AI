<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'subject',
        'workload',
        'assigned',
        'status',
    ];

    protected $casts = [
        'workload' => 'integer',
        'assigned' => 'integer',
    ];
}
