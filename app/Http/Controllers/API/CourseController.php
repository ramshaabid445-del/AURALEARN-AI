<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController;
use App\Http\Requests\CourseRequest;
use App\Services\CourseService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Courses", description: "Course management endpoints")]
class CourseController extends BaseController
{
    protected CourseService $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    #[OA\Get(
    path: "/api/courses",
    tags: ["Courses"],
    summary: "List courses with localization support",
    responses: [new OA\Response(response: 200, description: "Courses retrieved successfully")]
)]
    public function index(Request $request)
    {
        $locale = $this->resolveLocale($request);
        $courses = $this->courseService->listCourses()->map(fn($course) => $this->localizeCourse($course, $locale));

        return response()->json($this->successResponse('Courses retrieved successfully', $courses));
    }

    #[OA\Get(
    path: "/api/courses/{id}",
    tags: ["Courses"],
    summary: "Retrieve course details",
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [new OA\Response(response: 200, description: "Course retrieved successfully")]
)]
    public function show(Request $request, int $id)
    {
        $course = $this->courseService->getCourse($id);

        if (! $course) {
            return response()->json($this->errorResponse('Course not found'), 404);
        }

        return response()->json($this->successResponse('Course retrieved successfully', $this->localizeCourse($course, $this->resolveLocale($request))));
    }

    #[OA\Post(
    path: "/api/courses",
    tags: ["Courses"],
    summary: "Create a new course",
    responses: [new OA\Response(response: 201, description: "Course created successfully")]
)]
    public function store(CourseRequest $request)
    {
        $payload = $request->validated();
        $translations = $payload['translations'] ?? [];
        unset($payload['translations']);

        $course = $this->courseService->createCourse($payload);
        $this->applyTranslations($course, $translations);

        return response()->json($this->successResponse('Course created successfully', $this->localizeCourse($course, app()->getLocale())), 201);
    }

    #[OA\Put(
    path: "/api/courses/{id}",
    tags: ["Courses"],
    summary: "Update an existing course",
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [new OA\Response(response: 200, description: "Course updated successfully")]
)]
    public function update(CourseRequest $request, int $id)
    {
        $course = $this->courseService->getCourse($id);

        if (! $course) {
            return response()->json($this->errorResponse('Course not found'), 404);
        }

        $payload = $request->validated();
        $translations = $payload['translations'] ?? [];
        unset($payload['translations']);

        $course = $this->courseService->updateCourse($id, $payload);
        $this->applyTranslations($course, $translations);

        return response()->json($this->successResponse('Course updated successfully', $this->localizeCourse($course, $this->resolveLocale($request))));
    }

    #[OA\Delete(
    path: "/api/courses/{id}",
    tags: ["Courses"],
    summary: "Delete a course",
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [new OA\Response(response: 200, description: "Course deleted successfully")]
)]
    public function destroy(int $id)
    {
        if (! $this->courseService->deleteCourse($id)) {
            return response()->json($this->errorResponse('Course not found'), 404);
        }

        return response()->json($this->successResponse('Course deleted successfully'));
    }

    private function resolveLocale(Request $request): string
    {
        $header = $request->header('Accept-Language');
        $locale = $header ? explode(',', $header)[0] : app()->getLocale();
        $supported = ['en', 'ur', 'ar'];

        return in_array($locale, $supported, true) ? $locale : app()->getLocale();
    }

    private function localizeCourse($course, string $locale): array
    {
        return [
            'id' => $course->id,
            'title' => $course->getTranslation('title', $locale),
            'description' => $course->getTranslation('description', $locale),
            'course_code' => $course->course_code,
            'credits' => $course->credits,
            'created_at' => $course->created_at,
            'updated_at' => $course->updated_at,
        ];
    }

    private function applyTranslations($course, array $translations): void
    {
        foreach ($translations as $locale => $translation) {
            if (! empty($translation['title'])) {
                $course->setTranslation('title', $locale, $translation['title']);
            }

            if (! empty($translation['description'])) {
                $course->setTranslation('description', $locale, $translation['description']);
            }
        }

        $course->save();
    }
}
