<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('redemptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('reward_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('points_spent');
            $table->string('code')->unique();
            $table->enum('status', ['issued', 'used', 'cancelled'])->default('issued');
            $table->dateTime('redeemed_at')->useCurrent();
            // Tambahan di luar ERD: untuk mencegah redeem ganda saat retry
            $table->string('idempotency_key', 64)->nullable();

            $table->unique(['user_id', 'idempotency_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('redemptions');
    }
};
