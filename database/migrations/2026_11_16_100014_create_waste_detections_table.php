<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('waste_detections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('waste_submissions')->cascadeOnDelete();
            // TODO: samakan daftar enum dengan ERD final
            $table->enum('waste_class', ['kertas', 'plastik', 'kaca', 'kardus', 'logam', 'organik', 'lainnya']);
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('confidence', 5, 4)->nullable();
            $table->boolean('is_corrected')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waste_detections');
    }
};
