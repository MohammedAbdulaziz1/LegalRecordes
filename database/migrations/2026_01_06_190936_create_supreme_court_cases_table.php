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
        Schema::create('supreme_court', function (Blueprint $table) {
            $table->unsignedBigInteger('supreme_request_id')->autoIncrement();
            $table->date('supreme_date');
            $table->integer('supreme_case_number');
            $table->unsignedBigInteger('appeal_request_id');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->primary('supreme_request_id');
            $table->foreign('appeal_request_id')
                  ->references('appeal_request_id')
                  ->on('appeal')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supreme_court');
    }
};
