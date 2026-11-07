<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jenis_aduan', function (Blueprint $table) {
            $table->id('jenis_aduan_id');
            $table->string('jenis');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jenis_aduan');
    }
};
