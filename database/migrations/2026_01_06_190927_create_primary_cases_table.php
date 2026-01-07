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
        Schema::create('case_registration', function (Blueprint $table) {
            $table->unsignedBigInteger('assigned_case_registration_request_id')->autoIncrement();
            $table->string('first_instance_judgment');
            $table->date('case_date');
            $table->integer('case_number');
            $table->date('session_date');
            $table->integer('court_number');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->primary('assigned_case_registration_request_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_registration');
    }
};
