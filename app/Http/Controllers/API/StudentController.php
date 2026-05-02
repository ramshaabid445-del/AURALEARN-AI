<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController;
use App\Http\Requests\StudentRequest;
use App\Models\Student;
use App\Services\AIPredictionService;
use App\Services\NotificationService;
use App\Services\StudentService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Students", description: "Student management endpoints")]
class StudentController extends BaseController
{
    protected StudentService $studentService;
    protected NotificationService $notificationService;

    public function __construct(StudentService $studentService, NotificationService $notificationService)
    {
        $this->studentService = $studentService;
        $this->notificationService = $notificationService;
    }

    #[OA\Get(
    path: "/api/students",
    tags: ["Students"],
    summary: "List all students",
    responses: [new OA\Response(response: 200, description: "Students retrieved successfully")]
)]
    public function index()
    {
        return response()->json($this->successResponse('Students retrieved successfully', $this->studentService->listStudents()));
    }

    #[OA\Get(
        path: "/api/students/{id}",
        tags: ["Students"],
        summary: "Retrieve a student by ID",
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "integer")
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: "Student retrieved successfully"),
        ],
    )]
    public function show(int $id)
    {
        $student = $this->studentService->getStudent($id);

        if (! $student) {
            return response()->json($this->errorResponse('Student not found'), 404);
        }

        return response()->json($this->successResponse('Student retrieved successfully', $student));
    }

    #[OA\Get(
    path: "/api/students/{id}/predict",
    tags: ["Students"],
    summary: "Generate a learning path prediction for a student",
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [new OA\Response(response: 200, description: "Prediction generated")]
)]
    public function predict(int $id, AIPredictionService $predictionService)
    {
        $student = $this->studentService->getStudent($id);

        if (! $student) {
            return response()->json($this->errorResponse('Student not found'), 404);
        }

        $metrics = [
            'quiz_scores' => $student->performance?->quiz_scores ?? [],
            'attendance' => $student->performance?->attendance ?? 0,
        ];

        $prediction = $predictionService->predictPath($metrics);
        $prediction['recommended_topics'] = $predictionService->generatePersonalizedPath($metrics);

        if ($prediction['predicted_grade'] < 60) {
            $this->notificationService->sendLowGradeAlert($student, $prediction['predicted_grade']);
        }

        return response()->json($this->successResponse('Prediction generated', $prediction));
    }

    #[OA\Post(
    path: "/api/students",
    tags: ["Students"],
    summary: "Create a new student",
    responses: [new OA\Response(response: 201, description: "Student created successfully")]
)]
    public function store(StudentRequest $request)
    {
        $student = $this->studentService->createStudent($request->validated());

        return response()->json($this->successResponse('Student created successfully', $student), 201);
    }

    #[OA\Put(
    path: "/api/students/{id}",
    tags: ["Students"],
    summary: "Update a student",
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [new OA\Response(response: 200, description: "Student updated successfully")]
)]
    public function update(StudentRequest $request, int $id)
    {
        $student = $this->studentService->getStudent($id);

        if (! $student) {
            return response()->json($this->errorResponse('Student not found'), 404);
        }

        $student = $this->studentService->updateStudent($id, $request->validated());

        return response()->json($this->successResponse('Student updated successfully', $student));
    }

    #[OA\Delete(
    path: "/api/students/{id}",
    tags: ["Students"],
    summary: "Delete a student",
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [new OA\Response(response: 200, description: "Student deleted successfully")]
)]
    public function destroy(int $id)
    {
        if (! $this->studentService->deleteStudent($id)) {
            return response()->json($this->errorResponse('Student not found'), 404);
        }

        return response()->json($this->successResponse('Student deleted successfully'));
    }
}
