<?php

namespace App\Events;

use App\Models\Discussion;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DiscussionCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Discussion $discussion;

    public function __construct(Discussion $discussion)
    {
        $this->discussion = $discussion;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('discussions'),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'discussion' => [
                'id' => $this->discussion->id,
                'title' => $this->discussion->title,
                'body' => $this->discussion->body,
                'started_by' => $this->discussion->started_by,
                'is_active' => $this->discussion->is_active,
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'discussion.created';
    }
}
