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
        Schema::create('appeal', function (Blueprint $table) {
            $table->unsignedBigInteger('appeal_request_id')->autoIncrement();
            $table->integer('appeal_number');
            $table->date('appeal_date');
            $table->integer('appeal_court_number');
            $table->string('appeal_judgment');
            $table->string('appealed_by');
            $table->unsignedBigInteger('assigned_case_registration_request_id');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->primary('appeal_request_id');
            $table->foreign('assigned_case_registration_request_id')
                  ->references('assigned_case_registration_request_id')
                  ->on('case_registration')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appeal');
    }
};
