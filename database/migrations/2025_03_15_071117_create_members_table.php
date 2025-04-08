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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('avatar')->nullable();
            $table->string('name');
            $table->unsignedInteger('ratio');
            $table->json('bank_info')->nullable();
            // $table->unsignedBigInteger('total_expenses')->default(0);
            // $table->unsignedBigInteger('total_payments')->default(0);
            $table->decimal('total_payments', 15, 3)->default(0);
            $table->decimal('total_expenses', 15, 3)->default(0);
            $table->json('remainder_history')->nullable();
            $table->foreignId('group_id')->constrained()->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
