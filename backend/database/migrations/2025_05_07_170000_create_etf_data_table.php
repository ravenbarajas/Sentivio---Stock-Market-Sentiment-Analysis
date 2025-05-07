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
        Schema::create('etf_data', function (Blueprint $table) {
            $table->id();
            $table->date('Date')->index();
            $table->decimal('Open', 15, 6)->nullable();
            $table->decimal('High', 15, 6)->nullable();
            $table->decimal('Low', 15, 6)->nullable();
            $table->decimal('Close', 15, 6)->nullable();
            $table->decimal('Adj Close', 15, 6)->nullable();
            $table->bigInteger('Volume')->nullable();
            $table->string('Symbol')->index();
            $table->unique(['Symbol', 'Date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etf_data');
    }
}; 