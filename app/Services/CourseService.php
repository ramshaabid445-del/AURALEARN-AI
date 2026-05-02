<?php

namespace App\Services;

use App\Repositories\CourseRepository;

class CourseService
{
    protected CourseRepository $courseRepository;

    public function __construct(CourseRepository $courseRepository)
    {
        $this->courseRepository = $courseRepository;
    }

    public function listCourses()
    {
        return $this->courseRepository->all();
    }

    public function getCourse(int $id)
    {
        return $this->courseRepository->find($id);
    }

    public function createCourse(array $data)
    {
        return $this->courseRepository->create($data);
    }

    public function updateCourse(int $id, array $data)
    {
        return $this->courseRepository->update($id, $data);
    }

    public function deleteCourse(int $id): bool
    {
        return $this->courseRepository->delete($id);
    }
}
