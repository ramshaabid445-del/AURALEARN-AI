<?php

namespace App\Services;

use App\Repositories\StudentRepository;

class StudentService
{
    protected StudentRepository $studentRepository;

    public function __construct(StudentRepository $studentRepository)
    {
        $this->studentRepository = $studentRepository;
    }

    public function listStudents()
    {
        return $this->studentRepository->all();
    }

    public function getStudent(int $id)
    {
        return $this->studentRepository->find($id);
    }

    public function createStudent(array $data)
    {
        return $this->studentRepository->create($data);
    }

    public function updateStudent(int $id, array $data)
    {
        return $this->studentRepository->update($id, $data);
    }

    public function deleteStudent(int $id): bool
    {
        return $this->studentRepository->delete($id);
    }
}
