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
        Schema::create('raw_analyst_ratings', function (Blueprint $table) {
            $table->id();
            $table->text('headline');
            $table->string('url')->nullable();
            $table->string('publisher')->nullable();
            $table->date('date');
            $table->string('stock');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('raw_analyst_ratings');
    }
}; 