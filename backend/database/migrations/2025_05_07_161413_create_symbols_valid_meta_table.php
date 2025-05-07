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
        Schema::create('symbols_valid_meta', function (Blueprint $table) {
            $table->id();
            $table->boolean('nasdaq_traded')->default(false);
            $table->string('symbol')->unique()->index();
            $table->string('security_name')->nullable();
            $table->string('listing_exchange')->nullable();
            $table->string('market_category')->nullable();
            $table->boolean('etf')->default(false);
            $table->integer('round_lot_size')->nullable();
            $table->boolean('test_issue')->default(false);
            $table->string('financial_status')->nullable();
            $table->string('cqs_symbol')->nullable();
            $table->string('nasdaq_symbol')->nullable();
            $table->boolean('nextshares')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('symbols_valid_meta');
    }
};
