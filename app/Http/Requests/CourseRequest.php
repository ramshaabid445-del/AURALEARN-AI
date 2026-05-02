<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $courseId = optional($this->route('course'))->id;

        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'course_code' => 'required|string|max:50|unique:courses,course_code'.($courseId ? ",{$courseId}" : ''),
            'credits' => 'nullable|integer|min:0',
            'translations' => 'nullable|array',
            'translations.*.title' => 'nullable|string|max:255',
            'translations.*.description' => 'nullable|string',
        ];
    }
}
