<?php

namespace App\Http\Controllers\API;

use App\Events\DiscussionCreated;
use App\Http\Controllers\API\BaseController;
use App\Models\Discussion;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Discussions", description: "Discussion board endpoints")]
class DiscussionController extends BaseController
{
    #[OA\Get(
    path: "/api/discussions",
    tags: ["Discussions"],
    summary: "List discussions",
    responses: [new OA\Response(response: 200, description: "Discussions retrieved successfully")]
)]
    public function index()
    {
        return response()->json($this->successResponse('Discussions retrieved successfully', Discussion::latest()->get()));
    }

    #[OA\Post(
    path: "/api/discussions",
    tags: ["Discussions"],
    summary: "Create a discussion entry",
    responses: [new OA\Response(response: 201, description: "Discussion created successfully")]
)]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'nullable|string',
            'started_by' => 'nullable|integer|exists:students,id',
            'is_active' => 'boolean',
        ]);

        $discussion = Discussion::create($validated);
        event(new DiscussionCreated($discussion));

        return response()->json($this->successResponse('Discussion created successfully', $discussion), 201);
    }
}
