<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('level_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_id')->constrained('levels')->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->unsignedInteger('order_no')->default(0);

            $table->unique(['level_id', 'order_no']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_modules');
    }
};
