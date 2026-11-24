<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['user', 'admin'])->default('user')->after('password');
            $table->foreignId('level_id')->nullable()->after('role')
                ->constrained('levels')->nullOnDelete();
            $table->unsignedInteger('total_xp')->default(0)->after('level_id');
            $table->unsignedInteger('points_balance')->default(0)->after('total_xp');
            $table->string('avatar_url')->nullable()->after('points_balance');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('level_id');
            $table->dropColumn(['role', 'total_xp', 'points_balance', 'avatar_url']);
        });
    }
};
