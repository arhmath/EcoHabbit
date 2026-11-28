<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'email'          => $this->email,
            'role'           => $this->role,
            'total_xp'       => $this->total_xp,
            'points_balance' => $this->points_balance,
            // Kolom avatar_url menyimpan path relatif (mis. avatars/abc.jpg); di sini diubah jadi URL lengkap
            'avatar_url'     => $this->avatar_url
                ? Storage::disk('public')->url($this->avatar_url)
                : null,
            'level'          => $this->whenLoaded('level', fn () => new LevelResource($this->level)),
            'created_at'     => $this->created_at,
        ];
    }
}
