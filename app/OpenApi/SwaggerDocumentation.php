<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "AuraLearn AI API",
    version: "1.0.0",
    description: "API documentation for AuraLearn AI"
)]
#[OA\Tag(name: "Authentication", description: "Authentication endpoints")]
#[OA\Tag(name: "Students", description: "Student management endpoints")]
#[OA\Tag(name: "Courses", description: "Course management endpoints")]
#[OA\Tag(name: "Discussions", description: "Discussion board endpoints")]
#[OA\Tag(name: "Health", description: "Application and microservice health endpoints")]
class SwaggerDocumentation
{
}
