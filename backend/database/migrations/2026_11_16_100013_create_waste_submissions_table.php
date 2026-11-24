<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('waste_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('challenge_id')->nullable()->constrained()->nullOnDelete();
            $table->string('image_key');
            $table->enum('status', ['pending', 'confirmed', 'rejected'])->default('pending');
            $table->unsignedInteger('xp_awarded')->default(0);
            $table->unsignedInteger('points_awarded')->default(0);
            $table->dateTime('submitted_at')->useCurrent();
            $table->dateTime('confirmed_at')->nullable();

            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waste_submissions');
    }
};
