<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LevelSeeder extends Seeder
{
    public function run(): void
    {
        // Nama dan ambang XP adalah contoh, silakan sesuaikan
        DB::table('levels')->upsert([
            ['level_number' => 1, 'name' => 'Level 1',        'min_xp' => 0,    'can_create_event' => false, 'description' => 'Awal perjalanan hijau'],
            ['level_number' => 2, 'name' => 'Level 2',        'min_xp' => 100,  'can_create_event' => false, 'description' => 'Mulai konsisten memilah sampah'],
            ['level_number' => 3, 'name' => 'Level 3',   'min_xp' => 300,  'can_create_event' => false, 'description' => 'Kebiasaan ramah lingkungan terbentuk'],
            ['level_number' => 4, 'name' => 'Level 4', 'min_xp' => 700,  'can_create_event' => true,  'description' => 'Boleh membuat event komunitas'],
            ['level_number' => 5, 'name' => 'Level 5', 'min_xp' => 1500, 'can_create_event' => true,  'description' => 'Level tertinggi'],
        ], ['level_number'], ['name', 'min_xp', 'can_create_event', 'description']);
    }
}