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
        Schema::create('market_price', function (Blueprint $table) {
            $table->id();
            $table->string('symbol')->index();
            $table->date('date')->index();
            $table->decimal('open', 15, 6)->nullable();
            $table->decimal('high', 15, 6)->nullable();
            $table->decimal('low', 15, 6)->nullable();
            $table->decimal('close', 15, 6)->nullable();
            $table->decimal('adj_close', 15, 6)->nullable();
            $table->bigInteger('volume')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('market_price');
    }
};
