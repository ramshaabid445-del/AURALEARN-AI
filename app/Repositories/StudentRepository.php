<?php

namespace App\Repositories;

use App\Models\Student;

class StudentRepository
{
    public function all()
    {
        return Student::all();
    }

    public function find(int $id)
    {
        return Student::find($id);
    }

    public function create(array $data)
    {
        return Student::create($data);
    }

    public function update(int $id, array $data)
    {
        $student = $this->find($id);

        if (!$student) {
            return null;
        }

        $student->update($data);

        return $student;
    }

    public function delete(int $id): bool
    {
        $student = $this->find($id);

        return $student ? $student->delete() : false;
    }
}
