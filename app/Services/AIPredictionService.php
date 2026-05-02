<?php

namespace App\Services;

class AIPredictionService
{
    public function predictPath(array $studentMetrics): array
    {
        $quizScores = $studentMetrics['quiz_scores'] ?? [];
        $attendance = $studentMetrics['attendance'] ?? 0;

        $quizAverage = count($quizScores) > 0 ? array_sum($quizScores) / count($quizScores) : 0;
        $predictedGrade = ($quizAverage * 0.7) + ($attendance * 0.3);
        $predictedGrade = round(min(max($predictedGrade, 0), 100), 2);

        return [
            'predicted_grade' => $predictedGrade,
            'learning_path' => $this->determineLearningPath($predictedGrade),
        ];
    }

    public function generatePersonalizedPath(array $studentMetrics): array
    {
        $quizScores = $studentMetrics['quiz_scores'] ?? [];
        $lowestScores = collect($quizScores)->sort()->take(2)->values()->all();

        if (empty($lowestScores)) {
            return [
                'core-foundations',
                'interactive-review',
            ];
        }

        $recommendations = [];

        foreach ($lowestScores as $score) {
            if ($score < 50) {
                $recommendations[] = 'fundamental-concepts';
                $recommendations[] = 'structured-practice';
            } elseif ($score < 70) {
                $recommendations[] = 'concept-clarity';
                $recommendations[] = 'guided-exercises';
            } else {
                $recommendations[] = 'advanced-problem-solving';
                $recommendations[] = 'test-preparation';
            }
        }

        return array_values(array_unique($recommendations));
    }

    private function determineLearningPath(float $grade): string
    {
        return match (true) {
            $grade >= 85 => 'advanced',
            $grade >= 65 => 'intermediate',
            default => 'foundation',
        };
    }
}
