<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $topLevelId = DB::table('levels')->where('level_number', 5)->value('id');

        $admin = User::firstOrNew(['email' => env('ADMIN_EMAIL', 'admin@ecohabit.test')]);

        // forceFill karena role/level_id tidak ada di $fillable
        $admin->forceFill([
            'name'     => 'Admin',
            'password' => env('ADMIN_PASSWORD', 'IniPassword'), // otomatis di-hash oleh cast 'hashed'
            'role'     => 'admin',
            'level_id' => $topLevelId,
        ])->save();
    }
}