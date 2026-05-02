<?php

namespace App\Repositories;

use App\Models\Course;

class CourseRepository
{
    public function all()
    {
        return Course::all();
    }

    public function find(int $id)
    {
        return Course::find($id);
    }

    public function create(array $data)
    {
        return Course::create($data);
    }

    public function update(int $id, array $data)
    {
        $course = $this->find($id);

        if (!$course) {
            return null;
        }

        $course->update($data);

        return $course;
    }

    public function delete(int $id): bool
    {
        $course = $this->find($id);

        return $course ? $course->delete() : false;
    }
}
