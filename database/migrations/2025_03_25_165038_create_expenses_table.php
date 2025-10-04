<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            // $table->unsignedInteger('amount');
            $table->integer('amount');
            $table->integer('split')->nullable();
            $table->dateTime('date');
            $table->string('description')->nullable();
            $table->foreignId('group_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('spender_id')->constrained('members')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
