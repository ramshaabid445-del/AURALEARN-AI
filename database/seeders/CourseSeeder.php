<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        Course::updateOrCreate([
            'course_code' => 'AI101',
        ], [
            'title' => [
                'en' => 'AI Foundations',
                'ur' => 'اے آئی کے بنیادی اصول',
            ],
            'description' => [
                'en' => 'A complete introduction to artificial intelligence concepts.',
                'ur' => 'مصنوعی ذہانت کے تصورات کا مکمل تعارف۔',
            ],
            'credits' => 3,
        ]);

        Course::updateOrCreate([
            'course_code' => 'ML202',
        ], [
            'title' => [
                'en' => 'Machine Learning Principles',
                'ur' => 'مشین لرننگ کے اصول',
            ],
            'description' => [
                'en' => 'Build predictive models using modern machine learning techniques.',
                'ur' => 'جدید مشین لرننگ تکنیکوں کا استعمال کرتے ہوئے پیشگوئی کرنے والے ماڈل بنائیں۔',
            ],
            'credits' => 4,
        ]);

        Course::updateOrCreate([
            'course_code' => 'DS303',
        ], [
            'title' => [
                'en' => 'Data Science Workshop',
                'ur' => 'ڈیٹا سائنس ورکشاپ',
            ],
            'description' => [
                'en' => 'Practice analytics workflows and data-driven decision-making.',
                'ur' => 'تجزیاتی ورک فلو اور ڈیٹا پر مبنی فیصلے کرنے کی مشق.',
            ],
            'credits' => 2,
        ]);
    }
}
