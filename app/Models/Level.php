<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    // Tabel levels tidak punya created_at / updated_at
    public $timestamps = false;

    protected $fillable = ['level_number', 'name', 'min_xp', 'can_create_event', 'description'];

    protected function casts(): array
    {
        return [
            'can_create_event' => 'boolean',
        ];
    }
}
