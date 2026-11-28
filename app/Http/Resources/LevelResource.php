<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LevelResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'level_number'     => $this->level_number,
            'name'             => $this->name,
            'min_xp'           => $this->min_xp,
            'can_create_event' => $this->can_create_event,
            'description'      => $this->description,
        ];
    }
}
