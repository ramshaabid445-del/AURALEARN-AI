<?php

namespace App\Http\Controllers\API;

use App\Services\MicroserviceClient;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

#[OA\Tag(
    name: "Health",
    description: "Application and microservice health endpoints"
)]
class HealthController extends BaseController
{
    #[OA\Get(
    path: "/api/health",
    tags: ["Health"],
    summary: "Check application and database health",
    responses: [new OA\Response(response: 200, description: "Application health status")]
)]
    public function check()
    {
        try {
            DB::connection()->getPdo();
            $databaseStatus = 'ok';
        } catch (\Throwable $exception) {
            $databaseStatus = 'error';
        }

        return response()->json($this->successResponse('Health check passed', [
            'app_name' => config('app.name'),
            'app_version' => config('app.version', '1.0.0'),
            'environment' => config('app.env'),
            'database' => $databaseStatus,
        ]));
    }

    #[OA\Get(
    path: "/api/microservice/status",
    tags: ["Health"],
    summary: "Check external microservice health",
    responses: [new OA\Response(response: 200, description: "External microservice health")]
)]
    public function microserviceStatus(MicroserviceClient $microserviceClient)
    {
        return response()->json($this->successResponse('Microservice status retrieved', $microserviceClient->getHealth()));
    }
}
