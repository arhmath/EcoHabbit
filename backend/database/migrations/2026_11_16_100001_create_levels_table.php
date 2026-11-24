<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('levels', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('level_number')->unique(); // 1 sampai 5
            $table->string('name');
            $table->unsignedInteger('min_xp')->default(0);
            $table->boolean('can_create_event')->default(false);
            $table->text('description')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('levels');
    }
};
