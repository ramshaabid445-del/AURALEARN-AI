<?php

namespace App\Traits;

trait ResponseTrait
{
    protected function successResponse(string $message = 'Success', $data = null, int $status = 200): array
    {
        return [
            'status' => 'success',
            'message' => $message,
            'data' => $data,
            'errors' => null,
        ];
    }

    protected function errorResponse(string $message = 'Error', $errors = null, int $status = 500): array
    {
        return [
            'status' => 'error',
            'message' => $message,
            'data' => null,
            'errors' => $errors,
        ];
    }
}
