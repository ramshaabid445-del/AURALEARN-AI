<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MicroserviceClient
{
    protected string $baseUrl;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.microservice.base_url', 'http://localhost');
        $this->timeout = config('services.microservice.timeout', 10);
    }

    public function getHealth(): array
    {
        $health = [
            'service' => $this->baseUrl,
            'status' => 'unreachable',
            'http_status' => null,
            'response' => null,
        ];

        try {
            $response = Http::timeout($this->timeout)->get(rtrim($this->baseUrl, '/') . '/health');

            $health['http_status'] = $response->status();
            $health['status'] = $response->successful() ? 'healthy' : 'unhealthy';
            $health['response'] = $response->json();
        } catch (\Throwable $exception) {
            $health['response'] = $exception->getMessage();
        }

        return $health;
    }
}
