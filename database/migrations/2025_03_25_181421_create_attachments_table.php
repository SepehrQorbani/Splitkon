<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('path');
            $table->foreignId('group_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });
        Schema::create('attachmentables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attachment_id');
            $table->morphs('attachmentable');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
        Schema::dropIfExists('attachmentables');
    }
};
