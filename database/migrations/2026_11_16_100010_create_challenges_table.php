<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_id')->constrained('levels')->restrictOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            // TODO: samakan daftar enum dengan ERD final
            $table->enum('target_waste_class', ['kertas', 'plastik', 'kaca', 'kardus', 'logam', 'organik', 'lainnya'])->nullable();
            $table->unsignedInteger('target_count')->default(1);
            $table->unsignedInteger('xp_reward')->default(0);
            $table->unsignedInteger('point_reward')->default(0);
            $table->boolean('is_ad_hoc')->default(false);
            $table->boolean('is_active')->default(true);
            $table->dateTime('start_at')->nullable();
            $table->dateTime('end_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();

            $table->index(['is_active', 'start_at', 'end_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenges');
    }
};
