<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aduan', function (Blueprint $table) {
            $table->id('aduan_id');
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('jenis_aduan_id')->constrained('jenis_aduan', 'jenis_aduan_id');
            $table->string('prioritas');
            $table->text('text');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aduan');
    }
};
