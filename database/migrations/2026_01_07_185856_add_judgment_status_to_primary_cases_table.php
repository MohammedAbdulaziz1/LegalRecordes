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
        Schema::table('case_registration', function (Blueprint $table) {
            // 0 = قيد المعالجة, 1 = إلغاء القرار, 2 = رفض الدعوى, 3 = التأجيل
            $table->tinyInteger('judgment_status')->default(0)->after('first_instance_judgment');
            $table->softDeletes();
        });

        Schema::table('appeal', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('supreme_court', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('case_registration', function (Blueprint $table) {
            $table->dropColumn('judgment_status');
            $table->dropSoftDeletes();
        });

        Schema::table('appeal', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('supreme_court', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
