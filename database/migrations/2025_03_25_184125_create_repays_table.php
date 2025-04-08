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
        Schema::create('repays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_id')->constrained('members')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('to_id')->constrained('members')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedInteger('amount');
            $table->string('description')->nullable();
            $table->dateTime('date');
            $table->foreignId('group_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repays');
    }
};
